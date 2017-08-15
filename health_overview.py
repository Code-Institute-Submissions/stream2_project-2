from flask import Flask
from flask import render_template
from pymongo import MongoClient
import json
import os

app = Flask(__name__)


MONGO_DB_URI = os.getenv('MONGO_DB_URI', 'mongodb://root:health_overview1@ds131492.mlab.com:31492/heroku_0dl950d9')
MONGO_DB_NAME = os.getenv('MONGO_DB_NAME', 'heroku_0dl950d9')
# MONGO_DB_COLLECTION = os.getenv('MONGO_DB_COLLECTION', 'activity')



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

    print(MONGO_DB_URI, MONGO_DB_NAME, MONGO_DB_COLLECTION)

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

@app.route("/fitbit/heart_rate")  ## unsure if i need this or whether the code below 
def heart_rate_db():             ## should just be embedded in the app route above
    
    """
    A Flask view to serve the project data from
    MongoDB in JSON format
    """

    # A constant that defines the record fields that we wish to retrieve
    FIELDS = {
        "_id": False,
        "date": True,
        "resting_heart_rate": True,
        "normal_min_heart_rate": True,
        "normal_max_heart_rate": True,
        "normal_calories_burned": True,
        "normal_minutes": True,
        "fat_burn_min_heart_rate": True,
        "fat_burn_max_heart_rate": True,
        "fat_burn_calories_burned": True,
        "fat_burn_minutes": True,
        "cardio_min_heart_rate": True,
        "cardio_max_heart_rate": True,
        "cardio_calories_burned": True,
        "cardio_calories_burned": True,
        "cardio_minutes": True,
        "peak_min_heart_rate": True,
        "peak_max_heart_rate": True,
        "peak_calories_burned": True,
        "peak_minutes": True
    }

    

    # Open a connection to MongoDB using a with statement such that the
    # connection will be closed as soon as we exit the with statement
    # The MONGO_URI connection is required when hosted using a remote mongo db.
    with MongoClient(MONGO_DB_URI) as conn:
        # Define which collection we wish to access
        collection = conn[MONGO_DB_NAME]['heart_rate']
        # Retrieve a result set only with the fields defined in FIELDS
        # and limit the the results to a lower limit of 20000
        projects = collection.find(projection=FIELDS, limit=20000)
        # Convert projects to a list in a JSON object and return the JSON data
        return json.dumps(list(projects))

    

@app.route("/sleep")
def sleep():
    return render_template("/sleep.html")

@app.route("/fitbit/sleep_data")  
def sleep_db():
    
    """
    A Flask view to serve the project data from
    MongoDB in JSON format
    """

    # A constant that define the record fields that we wish to retrieve
    FIELDS = {
        "_id": False,
        "date": True,
        "start_time": True,
        "time_in_bed": True,
        "minutes_aslepp": True,
        "awakening_counts": True,
        "minutes_awake": True,
        "minutes_to_fall_asleep": False,
        "minutes_after_wakeup": False,
        "efficiency": True
    }

    # Open a connection to MongoDB using a with statement such that the
    # connection will be closed as soon as we exit the with statement
    # The MONGO_URI connection is required when hosted using a remote mongo db.
    with MongoClient(MONGO_DB_URI) as conn:
        # Define which collection we wish to access
        collection = conn[MONGO_DB_NAME]['sleep_data']
        # Retrieve a result set only with the fields defined in FIELDS
        # and limit the the results to a lower limit of 20000
        projects = collection.find(projection=FIELDS, limit=20000)
        # Convert projects to a list in a JSON object and return the JSON data
        return json.dumps(list(projects))

if __name__ == '__main__':
    app.run(debug=True)
