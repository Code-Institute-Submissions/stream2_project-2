# Stream 2 Project - Maisie's Health Data 

## Overview 

This is a data based website for my personal Health data taken from a fitbit activity tracker. Data includes calories burned, steps, distance, floors and heart rate data. 

#Features
- Calories burned chart 
- Total calories burned
- Steps chart 
- Totsl steps 
- Distance 
- Total distance
- Floors climbed chart
- Total floors climbed
- Average heart rate
- Max Heart Rate
- Calories Burned In Heart Rate Zones
- Minutes In Heart Rate Zones


## Tech Used 
-[Python](https://www.python.org/)
	- **Pyton** lets you work quickly
	and integrate systems more effectively
-[Flask](http://flask.pocoo.org/)
	- **Flask** microframework for Python
-[Bootstrap](http://getbootstrap.com/)
	- **Bootstrap** to give the website a simple, responsive layout. 
-[Crossfilter](http://square.github.io/crossfilter/)
	- **Crossfilter** Crossfilter  used to manipulate data, filtering, grouping (aggregation) with very quick speeds.
-[d3.js](https://d3js.org/)
	- **d3.js** JavaScript library for manipulating documents based on data. D3 helps bring data to life.
-[dc.js](https://dc-js.github.io/dc.js/)
	- **dc.js** Javascript charting library with native crossfilter support, allowing highly efficient exploration on large multi-dimensional datasets.


## Usage
### Getting the code up and running
1. Firstly you will need to clone this repository by running the ``` git clone <project's Gitbub URL> ``` command
2. After you've done this you will need to install virtualenv if you haven't already got it installed. Run ``` [sudo] pip install virtualenv ``` in commandline
3. Once you have done this create a virtual env and activate it. **Mac OS X** run ```  source bin/activate```
4. Next make sure you are in the project root folder and run the ``` pip install -r requirements.txt ``` this will install all the requirements for the project. 
5. To run the project on local server run 
``` python health_overview.py```

##Contributing
1. Fork it!
2. Create your feature branch: ``` git checkout -b my-new-feature ```
Commit your changes:  ``` git commit -am 'Add some feature' ```
Push to the branch: ``` git push origin my-new-feature ```
Submit a pull request :)
