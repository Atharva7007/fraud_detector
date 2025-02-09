from pymongo import MongoClient
from pymongo.server_api import ServerApi

def get_mongo_client():
    # Connect to MongoDB Atlas
    password = "Hack_ncmongo11"
    uri = f"mongodb+srv://pydeshpa:{password}@cluster0.3pmgj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    client = MongoClient(uri, server_api=ServerApi('1'))
    try:
        client.admin.command("ping")
        print("You have successfully connected to MongoDB Atlas.")
    except Exception as e:
        print("Could not connect to Mongo.")
        return None

    return client