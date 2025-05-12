from pymongo import MongoClient
from pymongo.server_api import ServerApi
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def get_mongo_client():
    # Connect to MongoDB Atlas using environment variables
    uri = os.getenv('MONGODB_URI')
    if not uri:
        raise ValueError("MONGODB_URI environment variable is not set")
        
    client = MongoClient(uri, server_api=ServerApi('1'))
    try:
        client.admin.command("ping")
        print("You have successfully connected to MongoDB Atlas.")
    except Exception as e:
        print("Could not connect to Mongo.")
        return None

    return client