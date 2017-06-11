queue()
   .defer(d3.json, "/fitbit/activity")
   .await(makeGraphs);

function makeGraphs(error, activityJson) {

    //Clean projectsJson data
    var fitbitActivity = activityJson;
    var dateFormat = d3.time.format("%Y-%m-%d");
    fitbitActivity.forEach(function (d) {
      d["date"] = dateFormat.parse(d["date"]);
      d["calories_burned"] = +d["calories_burned"];
      d["steps"] = +d["steps"];
      d["distance"] = +d["distance"]; // unsure aboout distance km?
      d["floors"] = +d["floors"];
      // d["minutes_sedentary"] = +d["minutes_sedentary"];
      d["minutes_lightly_active"] = +d["minutes_lightly_active"];
      //d["minutes_fairly_active"] = +d["minutes_fairly_active"];
      d["minutes_very_active"] = +d["minutes_very_active"];
      d["activity_calories"] = +d["activity_calories"];

    });



    //Create a Crossfilter instance
    var ndx = crossfilter(fitbitActivity);


    //Define data dimensions 
    var dateDim =ndx.dimension(function(d) { 
      return d["date"]; 
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
    var numRecordsByDate = dateDim.group();
    var caloriesGroup = caloriesDim.group();
    var stepsGroup = stepsDim.group();
    var distanceGroup = distanceDim.group();
    var floorsGroup = floorsDim.group();
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
    var timeChart = dc.barChart("#time-chart");
    var caloriesChart = dc.barChart("#calories-burned-chart");
    var stepsChart = dc.barChart("#steps-chart");
    var distanceND = dc.numberDisplay("#distance-chart");
    var floorsND = dc.numberDisplay("#floors-chart");


   //Chart Parameters


    dc.renderAll();
}