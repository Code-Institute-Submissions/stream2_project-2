# Stream 2 Project - Maisie's Health Data 

## Overview 

This is a data based website for my personal Health data taken from a fitbit activity tracker. Data includes calories burned, steps, distance, floors and heart rate data. 

### What does it do?

This website is made to show my health data in a visual way and allow you to compare and filter through the data by month.

### How does it work
- This websites uses **Flask** to route through the website. 
- **Bootstrap** has been used as basis for styling. 
- Charts created using **D3**, **DC** and **Crossfilter** 
- All the data for the website is stored in **MongoDB**. The data was exported from my fitbit.

### Features Left to Implement
- Order months


#Features
Home
- Month select Pie Chart
- Calories burned chart 
- Total calories burned
- Steps chart 
- Totsl steps 
- Distance 
- Total distance
- Floors climbed chart
- Total floors climbed

Heart Data 
- Month select Pie Chart
- Average heart rate
- Max Heart Rate
- Calories Burned In Heart Rate Zones
- Minutes In Heart Rate Zones


## Tech Used
### Some the tech used includes:
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
- [MongoDB](https://www.mongodb.com)
    - Used to store information
- [PyMongo](https://api.mongodb.com/python/current/)
    - Used to allow interaction between **Python** and **MongoDB**
- [Heroku](https://www.heroku.com/)
  - **Heroku** is a platform as a service (PaaS) that enables developers to build, run, and operate applications entirely in the cloud.


## Database
- I exported data for each category and each month as a .csv file, I then uploaded each file into its corresponding collection via MongoDB.

## Testing
- Site was tested extensively using Chrome, Firefox, Opera and Edge. Was also tested using different web broswers on ipad, iphone and on an android phone.
- Site responsiveness was tested on all platforms by resizing the browser window and using Chrome developer tools.
