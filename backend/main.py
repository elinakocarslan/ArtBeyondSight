import os
from dotenv import load_dotenv
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi

load_dotenv() 
mongodb_password = os.getenv('MONGODB_PASSWORD')
uri = f"mongodb+srv://elinakocarslan_db_user:{mongodb_password}@gallery.adiobn2.mongodb.net/?appName=gallery"
# Create a new client and connect to the server
client = MongoClient(uri, server_api=ServerApi('1'))
# Send a ping to confirm a successful connection
try:
    client.admin.command('ping')
    dbs = client.list_database_names()
    print("Databases found:", dbs)
    
    # Access the database and collection properly
    db = client["sight_data"]  # Get the database
    collection = db["artifacts"]  # Get the collection within the database
    doc = collection.find_one({"mode": "museum", "name": "The Soup"})
    print("Document found:", doc)
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)

