from fastapi import FastAPI
from pydantic import BaseModel
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from pymongo import MongoClient
from pymongo.server_api import ServerApi
from google import genai
from db import get_mongo_client
from utils import get_bert_embedding

# Initialize the Gemini client with the API key (replace with your actual API key)
gemini_client = genai.Client(api_key="AIzaSyDAnkj4X4staPk_1Qs9R8AsuG3DNJ0TMg4")

# Initialize FastAPI app
app = FastAPI()

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
        if similarity > 0.8:  # You can adjust this threshold
            relevant_emails.append(stored_email["text"])
        if len(relevant_emails) == 5:
            break
    
    prompt = f"User Input: {input_text} Relevant Fraud Cases: {relevant_emails}\n\nDoes this look suspicious? Also give a confidence percentage where confidence represent chance that this is fraudulent text. Your answer should be in JSON format with the fields text:<your response of less than 5 sentences> and confidence:<percentage value>"
    # Generate content with Gemini API, passing the constructed prompt
    response = gemini_client.models.generate_content(
        model="gemini-1.5-flash",  # Specify the model version (Gemini 1.5 Flash)
        contents=prompt,  # Send the constructed prompt to the model
    )
    return response.text

# Run with uvicorn
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
