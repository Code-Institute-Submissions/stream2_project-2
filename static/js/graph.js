queue()
   .defer(d3.json, "/fitbit/activity")
   .await(makeGraphs);

function makeGraphs(error, activityJson) {

    //Clean projectsJson data
    var fitbitActivity = activityJson;
    var dateFormat = d3.time.format("%d-%m-%Y");
    var displayDate = d3.time.format("%d %b");
    fitbitActivity.forEach(function (d) {
      d["date"] = dateFormat.parse(d["date"]);
      d["calories_burned"] = +d["calories_burned"];
      d["steps"] = +d["steps"];
      d["distance"] = +d["distance"]; // unsure about distance km?
      d["floors"] = +d["floors"];
      // d["minutes_sedentary"] = +d["minutes_sedentary"];
      d["minutes_lightly_active"] = +d["minutes_lightly_active"];
      //d["minutes_fairly_active"] = +d["minutes_fairly_active"];
      d["minutes_very_active"] = +d["minutes_very_active"];
      d["activity_calories"] = +d["activity_calories"];
      d.value = +[d.value];
    });

  

    //Create a Crossfilter instance
    var ndx = crossfilter(fitbitActivity);


    //Define data dimensions 
    var dateDim =ndx.dimension(function(d) { 
      return d3.time.day(d["date"]); 
    });
    var caloriesDim =ndx.dimension(function(d) { 
      return d["calories_burned"]; 
    });
    var stepsDim =ndx.dimension(function(d) { 
      return d["steps"]; 
    });
    var distanceDim =ndx.dimension(function(d) { 
      return d["distance"]; 
    });
    var floorsDim =ndx.dimension(function(d) { 
      return d["floors"]; 
    });
    var minsLightlyActiveDim =ndx.dimension(function(d) {
      return d["minutes_lightly_active"]; 
    });
    var minsVeryActiveDim =ndx.dimension(function(d) {
      return d["minutes_very_active"]; 
    });
    var activityCaloriesDim =ndx.dimension(function(d) {
      return d["activity_calories"]; 
    });


    // Define Data Groups, Calculate Metrics

    var caloriesGroup = dateDim.group().reduceSum(function (d){
      return d.calories_burned;
    });
    var numberOfStepsTaken = stepsDim.group().reduceSum(function (d){
      return d.steps;
    });
    var distanceTravelled = distanceDim.group().reduceSum(function (d){
      return d.distance;
    });
    var floorsGroup = floorsDim.group().reduceSum(function (d){
      return d.floors;
    });
    //var minsSedentaryGroup = minsSedentaryDim.group();
    var minsLightlyActiveGroup = minsLightlyActiveDim.group();
    //var minsFairlyActiveGroup = minsFairlyActiveDim.group();
    var minsVeryActiveGroup = minsVeryActiveDim.group();
    var activityCaloriesGroup = activityCaloriesDim.group();
    var all = ndx.groupAll();

    //Define values (to be used in charts) 
    var minDate = dateDim.bottom(1)[0]["date"];
    var maxDate = dateDim.top(1)[0]["date"];

    //Charts

    var caloriesChart = dc.barChart("#calories-burned-chart");
    var stepsChart = dc.barChart("#steps-chart");
    var distanceChart = dc.barChart("#distance-chart");
    var floorChart = dc.barChart("#floor-chart");

   
   
    var margin = {top: 30, right: 50, bottom: 25, left: 30},
        width = 700 - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom;


    var x = d3.time.scale().range([0, width]);
    var y = d3.scale.linear().range([height, 0]);

    var xAxis = d3.svg.axis().scale(x)
        .orient("bottom").ticks(5);
    var yAxis = d3.svg.axis().scale(y)
        .orient("left").ticks(6);

  
    console.log(numberOfStepsTaken.top(10));

   //Charts
   caloriesChart
       .width(width)
       .height(height)
       .margins(margin)
       .dimension(dateDim)
       .group(caloriesGroup)
       .transitionDuration(5000)
       .brushOn(false)
       .title(function(d){return d.value + " kcal";})
       .x(d3.time.scale().domain([minDate, maxDate]))
       //.xAxis().tickFormat(function(v) {return displayDate(v);})
       .xUnits(d3.time.days)
       .elasticY(true)
       .elasticX(true)
       .xAxisLabel("May")
       .yAxisLabel("Calories Burned Per Day")
       .xAxis(xAxis)
       .yAxis(yAxis);
       

      
      
    stepsChart
       .width(width)
       .height(height)
       .margins(margin)
       .dimension(dateDim)
       .group(numberOfStepsTaken)
       .transitionDuration(5000)
       .brushOn(false)
       .title(function(d){return d.value + " steps";})
       .x(d3.time.scale().domain([minDate, maxDate]))
       .xUnits(d3.time.days)
       .elasticY(true)
       .elasticX(true)
       .xAxisLabel("May")
       .yAxisLabel("Steps Per Day")
       .yAxis(yAxis)
       .xAxis(xAxis);
       
       
    distanceChart
       .width(width)
       .height(height)
       .margins(margin)
       .dimension(dateDim)
       .group(distanceTravelled)
       .transitionDuration(5000)
       .brushOn(false)
       .title(function(d){return d.value + " km";})
       .x(d3.time.scale().domain([minDate, maxDate]))
       .xUnits(d3.time.days)
       .elasticY(true)
       .elasticX(true)
       .xAxisLabel("May")
       .yAxisLabel("Distance Travelled Per Day")
       .yAxis().ticks(6);

   floorChart
       .width(width)
       .height(height)
       .margins(margin)
       .dimension(floorsDim)
       .group(floorsGroup)
       .transitionDuration(5000)
       .brushOn(false)
       .title(function(d){return d.value + " floors";})
       .x(d3.time.scale().domain([minDate, maxDate]))
       .xUnits(d3.time.days)
       .elasticY(true)
       .elasticX(true)
       .xAxisLabel("May")
       .yAxisLabel("Floors Climbed Per Day")
       .yAxis().ticks(6);

    dc.renderAll();
}



