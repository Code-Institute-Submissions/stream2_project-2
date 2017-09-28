window.onload = function() {


queue()
   .defer(d3.json, "/fitbit/activity")
   .await(makeGraphs);

function makeGraphs(error, activityJson) {

    //Clean projectsJson data
    var fitbitActivity = activityJson;
    var dateFormat = d3.time.format("%d-%m-%Y");
    var displayDate = d3.time.format("%d %b");
    var week = d3.time.format("%U");
    var monthNameFormat = d3.time.format("%b");
    fitbitActivity.forEach(function (d) {
        d.date = dateFormat.parse(d.date);
        d.calories_burned = +d.calories_burned;
        d.steps = +d.steps;
        d.distance = +d.distance;
        d.floors = +d.floors;
        d.minutes_lightly_active = +d.minutes_lightly_active;
        d.minutes_very_active = +d.minutes_very_active;
        d.activity_calories = +d.activity_calories;
        d.value = +[d.value];

    });

    //Create a Crossfilter instance
    var ndx = crossfilter(fitbitActivity);


    //Define data dimensions
    var dateDim =ndx.dimension(function(d) {
        return d3.time.day(d.date);
    });

    var monthDim=ndx.dimension(function(d) {
        var month = d.date.getMonth();
        var months= [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        if (typeof month !== 'undefined' && parseInt(month) > 0 && parseInt(month) < 12) {
          return months[month];
        }
        return undefined;
    });

    var caloriesDim =ndx.dimension(function(d) {
        return d.calories_burned;
    });
    var stepsDim =ndx.dimension(function(d) {
        return d.stps;
    });
    var distanceDim =ndx.dimension(function(d) {
        return d.distance;
    });

    var floorsDim =ndx.dimension(function(d) {
        return d.floors;
    });
    var minsLightlyActiveDim =ndx.dimension(function(d) {
        return d.minutes_lightly_active;
    });
    var minsVeryActiveDim =ndx.dimension(function(d) {
        return d.minutes_very_active;
    });
    var activityCaloriesDim =ndx.dimension(function(d) {
        return d.activity_calories;
    });

    // Define Data Groups, Calculate Metrics
    var caloriesGroup = dateDim.group().reduceSum(function (d){
        return d.calories_burned;
    });
    var numberOfStepsTaken = dateDim.group().reduceSum(function (d){
        return d.steps;
    });
    var distanceTravelled = dateDim.group().reduceSum(function (d){
        return d.distance;
    });
    var floorsGroup = dateDim.group().reduceSum(function (d){
        return d.floors;
    });
    var monthGroup = monthDim.group();

    var totalCalories = ndx.groupAll().reduceSum(function (d) {
       return d.calories_burned;
   });

    var totalSteps = ndx.groupAll().reduceSum(function (d) {
       return d.steps;
   });

    var totalDistance = ndx.groupAll().reduceSum(function (d) {
      return d.distance;
   });

    var totalFloors = ndx.groupAll().reduceSum(function (d) {
      return d.floors;
    });

    

    //var minsSedentaryGroup = minsSedentaryDim.group();
    var minsLightlyActiveGroup = minsLightlyActiveDim.group();
    //var minsFairlyActiveGroup = minsFairlyActiveDim.group();
    var minsVeryActiveGroup = minsVeryActiveDim.group();
    var activityCaloriesGroup = activityCaloriesDim.group();
    var all = ndx.groupAll();

    

    //Define values (to be used in charts)
    var minDate = dateDim.bottom(1)[0].date;
    var maxDate = dateDim.top(1)[0].date;

    

    //Charts
    var caloriesChart = dc.barChart("#calories-burned-chart");
    var caloriesND = dc.numberDisplay("#caloriesND");
    var stepsChart = dc.barChart("#steps-chart");
    var stepsND = dc.numberDisplay("#stepsND");
    var distanceChart = dc.barChart("#distance-chart");
    var distanceND = dc.numberDisplay("#distanceND");
    var floorChart = dc.barChart("#floor-chart");
    var floorND = dc.numberDisplay("#floorND");
    

    var margin = {top: 30, right: 50, bottom: 25, left: 30},
        width = 900,
        height = 400;

    var x = d3.time.scale().range([0, width]);
    var y = d3.scale.linear().range([height, 0]);

    // var xAxis = d3.svg.axis()
    //     .scale(x)
    //     .orient("bottom")
    //     .tickSize(6.0)
    //     .tickFormat(d3.time.format("%d"));
    // var yAxis = d3.svg.axis().scale(y)
    //     .orient("left")
    //     .ticks(6);

     selectField = dc.selectMenu('#menu-select')
        .dimension(monthDim)
        .group(monthGroup)
        .order();

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
       .xUnits(d3.time.days)
       .elasticY(true)
       .elasticX(true)
       .xAxisLabel("2017")
       .yAxisLabel("Calories Burned Per Day")
       .yAxis().ticks(5);

    caloriesND
      .formatNumber(d3.format("d"))
      .valueAccessor(function (d){
        return d;
      })
      .group(totalCalories);

    stepsChart
       .width(width)
       .height(height)
       .margins(margin)
       .dimension(dateDim)
       .group(numberOfStepsTaken)
       .transitionDuration(5000)
       .brushOn(false)
       .title(function(d){return d.value + " kcal";})
       .x(d3.time.scale().domain([minDate, maxDate]))
       .xUnits(d3.time.days)
       .elasticY(true)
       .elasticX(true)
       .xAxisLabel("2017")
       .yAxisLabel("Steps Taken")
       .yAxis().ticks(5);

    stepsND
      .formatNumber(d3.format("d"))
      .valueAccessor(function (d){
        return d;
      })
      .group(totalSteps);

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
       .xAxisLabel("2017")
       .yAxisLabel("Distance Travelled Per Day")
       .yAxis().ticks(5);

    distanceND
      .formatNumber(d3.format("f"))
      .valueAccessor(function (d){
        return d;
      })
      .group(totalDistance);

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
       .xAxisLabel("2017")
       .yAxisLabel("Floors Climbed Per Day")
       .yAxis().ticks(5);

   floorND
      .formatNumber(d3.format("d"))
      .valueAccessor(function (d){
        return d;
      })
      .group(totalFloors);

  

    dc.renderAll();
}
};
