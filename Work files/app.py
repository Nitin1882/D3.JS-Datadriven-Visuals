from flask import Flask, render_template, redirect
from flask_pymongo import PyMongo
from pymongo import MongoClient
import json
from bson import json_util
from bson.json_util import dumps

app = Flask(__name__)

## MONGO_URI = 'mongodb+srv://Test123:Test123@cluster0-hljmv.mongodb.net/test?retryWrites=true&w=majority'
client = MongoClient(
    "mongodb+srv://Test123:Test123@cluster0-hljmv.mongodb.net/test?retryWrites=true&w=majority")
db = client.test

MONGODB_HOST = 'localhost'
MONGO_PORT = 27017
DBS_NAME = 'd3jsproject'
COLLECTION_NAME = 'harborwatersample'
FIELDS = {'_id': False, 'sampling_location': True}


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/d3jsproject/harborwatersample")
def d3jsproject_harborwatersample():
    connection = MongoClient(MONGODB_HOST, MONGO_PORT)
    collection = connection[DBS_NAME][COLLECTION_NAME]
    projects = collection.find(projection=FIELDS)
    json_harborwatersample = []
    for project in projects:
        json_harborwatersample.append(project)
    json_harborwatersample = json.dumps(json_harborwatersample, default=json_util.default)
    connection.close()
    return json_harborwatersample


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)
