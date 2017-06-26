from flask import Flask
from flask import render_template
from pymongo import MongoClient
import json
import os

app = Flask(__name__)


MONGO_DB_URI = os.getenv('MONGO_DB_URI', 'mongodb://localhost:27017')
MONGO_DB_NAME = os.getenv('MONGO_DB_NAME', 'fitbit')
MONGO_DB_COLLECTION = os.getenv('MONGO_DB_COLLECTION', 'activity')



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
    with MongoClient(MONGO_DB_URI) as conn:
        # Define which collection we wish to access
        collection = conn[MONGO_DB_NAME][MONGO_DB_COLLECTION]
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
