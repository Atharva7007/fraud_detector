from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
# import numpy as np
# from sklearn.metrics.pairwise import cosine_similarity
from pymongo import MongoClient
from pymongo.server_api import ServerApi
from db import get_mongo_client
from utils import get_bert_embedding
from ollama_utils import get_ollama_response
import json

# Initialize FastAPI app
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Allow your frontend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = get_mongo_client()
db = client.get_database("fraud_detection")
emails_collection = db.get_collection("text_embeddings")
email_id_collection = db.get_collection("email_ids")

# Pydantic model for incoming requests
class EmailRequest(BaseModel):
    text: str
    email_id: str

# Function to calculate cosine similarity
# def get_similarity(input_text, stored_embedding):
#     # Convert input text to embedding (same method used during storage)
#     input_embedding = get_bert_embedding(input_text)  # Assuming you have the get_bert_embeddings function
#     similarity = cosine_similarity([input_embedding], [stored_embedding])
#     return similarity[0][0]

@app.post("/check_fraud/")
async def check_fraud(email: EmailRequest):
    input_text = email.text
    input_email_id = email.email_id
    input_embedding = get_bert_embedding(input_text).tolist()

    # Perform vector search using MongoDB Atlas
    pipeline = [
        {
            "$vectorSearch": {
                "index": "vector_search_index",  # Name of the vector search index
                "path": "embedding",  # Field containing the embeddings
                "queryVector": input_embedding,  # Embedding of the input text
                "numCandidates": 100,  # Number of candidates to consider
                "limit": 3  # Increase limit to ensure enough candidates are retrieved
            }
        },
        {
            "$project": {
                "text": 1,  # Include the text field
                "score": { "$meta": "vectorSearchScore" }  # Include the similarity score
            }
        }
    ]

    # Execute the aggregation pipeline
    relevant_emails = list(emails_collection.aggregate(pipeline))

    # Filter results with cosine similarity > 0.9
    filtered_emails = [email for email in relevant_emails if email["score"] > 0.95]

    known_fraud_email_id = "Not Found"
    if len(input_email_id) > 0:
        email_ids = email_id_collection.find()
        for email_id in email_ids:
            # print(email_id, input_email_id)
            if email_id["email_id"] == input_email_id:
                known_fraud_email_id = email_id["email_id"]
                break

    # Extract the text of the filtered emails
    relevant_texts = [email["text"] for email in filtered_emails]
    
    # Construct the prompt for Ollama
    if not input_email_id:
        input_email_id = "N/A"
    prompt = f"""You are a fraud detection expert. Analyze the following message and determine if it's suspicious or fraudulent.

Message Details:
- From: {input_email_id}
- Content: {input_text}

Known Fraud Cases for Reference:
{relevant_texts}

Known Fraudulent IDs:
{known_fraud_email_id}

Please analyze this message and provide your assessment in JSON format with two fields:
1. text: A brief explanation (less than 5 sentences) of why this might be fraudulent or legitimate
2. confidence: A percentage (0-100) indicating how confident you are in your assessment

Format your response as a valid JSON object with no additional text."""
    
    # Get response from Ollama
    response_text = get_ollama_response(prompt)
    
    # Parse the response text as JSON
    try:
        # Find JSON in the response
        start = response_text.find("{")
        end = response_text.rfind("}") + 1
        json_string = response_text[start:end]
        result = json.loads(json_string)
        
        # Ensure confidence is a number
        if isinstance(result.get("confidence"), str):
            result["confidence"] = int(str(result["confidence"]).replace("%", ""))
    except (json.JSONDecodeError, AttributeError) as e:
        result = {"text": "Error analyzing message", "confidence": 0}

    return result

# We will add the user's reported fraudulent email/text to our dataset 

@app.post("/report_fraud/")
async def report_fraud(email: EmailRequest):
    embedding = get_bert_embedding(email.text)

    last_entry = emails_collection.find_one(sort=[("index", -1)])
    if last_entry:
        new_index = int(last_entry["index"]) + 1
    else:
        new_index = 5000

    new_entry = {"index": new_index, "text": email.text, "embedding": embedding.tolist()}
    result = emails_collection.insert_one(new_entry)

    new_email_id = {"email_id" : email.email_id}
    email_id_collection.insert_one(new_email_id)

    return {"message": "Fraud reported successfully", "inserted_id": str(result.inserted_id), "index":new_index}


# Run with uvicorn
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
