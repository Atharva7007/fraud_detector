from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from pymongo import MongoClient
from pymongo.server_api import ServerApi
from google import genai
from db import get_mongo_client
from utils import get_bert_embedding
import json

# Initialize the Gemini client with the API key (replace with your actual API key)
gemini_client = genai.Client(api_key="AIzaSyDDILFwFz1Hl1PzRzYZH9uOgPrrgefnTec")

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

# Pydantic model for incoming requests
class EmailRequest(BaseModel):
    text: str

# Function to calculate cosine similarity
def get_similarity(input_text, stored_embedding):
    # Convert input text to embedding (same method used during storage)
    input_embedding = get_bert_embedding(input_text)  # Assuming you have the get_bert_embeddings function
    similarity = cosine_similarity([input_embedding], [stored_embedding])
    return similarity[0][0]

@app.post("/check_fraud/")
async def check_fraud(email: EmailRequest):
    # Search the database for similar emails
    input_text = email.text
    emails = emails_collection.find()
    relevant_emails = []
    # Compare with stored embeddings
    for stored_email in emails:
        stored_embedding = np.array(stored_email["embedding"])
        similarity = get_similarity(input_text, stored_embedding)
        
        # Define a threshold for phishing email detection
        if similarity > 0.9:  # You can adjust this threshold
            relevant_emails.append(stored_email["text"])
        if len(relevant_emails) == 5:
            break
    
    prompt = f"User Input: {input_text} Relevant Fraud Cases: {relevant_emails}\n\nDoes this look suspicious? Also give a confidence percentage where confidence represent chance that this is fraudulent text. Your answer should be in JSON format without any additional characters with the fields text:<your response of less than 5 sentences> and confidence:<percentage value>"
    # Generate content with Gemini API, passing the constructed prompt
    response = gemini_client.models.generate_content(
        model="gemini-1.5-flash",  # Specify the model version (Gemini 1.5 Flash)
        contents=prompt,  # Send the constructed prompt to the model
    )
    
    # Parse the response text as JSON
    try:
        text = response.text
        start = text.find("{")
        end = text.rfind("}") + 1
        json_string = text[start:end]
        result = json.loads(json_string)
        result["confidence"].replace("%", "")
    except json.JSONDecodeError:
        result = {"reason": "Invalid response from Gemini API", "confidence": 0}
    
    # Return the result as JSON
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

    return {"message": "Fraud reported successfully", "inserted_id": str(result.inserted_id), "index":new_index}


# Run with uvicorn
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
