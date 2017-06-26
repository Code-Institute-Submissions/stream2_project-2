from flask import Flask
from flask import render_template
from pymongo import MongoClient
import json
import os

app = Flask(__name__)


# MONGODB_HOST = 'localhost'
# MONGODB_PORT = 27017
# DBS_NAME = 'fitbit'
# COLLECTION_NAME = 'activity'

MONGO_URI = os.getenv('MONGO_URI', 'mongodb://root:health_overview1@ds131492.mlab.com:31492/heroku_0dl950d9')
DBS_NAME = os.getenv('DBS_NAME', 'heroku_0dl950d9')
COLLECTION_NAME = 'fitbit'



@app.route("/")
def index():
    """
    A Flask view to serve the main dashboard page. 
    """
    return render_template("index.html")

@app.route("/fitbit/activity")
def health_overview():
    """
    A Flask view to serve the project data from
    MongoDB in JSON format
    """

    # A constant that define the record fields that we wish to retrieve
    FIELDS = {
        "_id": False,
        "date": True,
        "calories_burned": True,
        "steps": True,
        "distance": True,
        "floors": True,
        "minutes_sedentary": True,
        "minutes_lightly_active": True,
        "minutes_fairly_active": True,
        "minutes_very_active": True,
        "activity_calories": True
    }

    #print(MONGO_URI)

    # Open a connection to MongoDB using a with statement such that the
    # connection will be closed as soon as we exit the with statement
    # The MONGO_URI connection is required when hosted using a remote mongo db.
    with MongoClient(MONGO_URI) as conn:
        # Define which collection we wish to access
        collection = conn[DBS_NAME][COLLECTION_NAME]
        # Retrieve a result set only with the fields defined in FIELDS
        # and limit the the results to a lower limit of 20000
        projects = collection.find(projection=FIELDS, limit=20000)
        # Convert projects to a list in a JSON object and return the JSON data
        return json.dumps(list(projects))

@app.route("/heart_rate")
def heart_rate():
    return render_template("/heart_rate.html")


@app.route("/sleep")
def sleep():
    return render_template("/sleep.html")


if __name__ == '__main__':
    app.run(debug=True)
