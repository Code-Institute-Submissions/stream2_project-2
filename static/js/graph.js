queue()
   .defer(d3.json, "/fitbitData/May")
   .await(makeGraphs);

function makeGraphs(error, projectsJson) {

    //Clean projectsJson data
    var healthOverviewHealthData = projectsJson;
    var dateFormat = d3.time.format("%Y-%m-%d");


    //Create a Crossfilter instance



    //Calculate metrics




    //Define values (to be used in charts)
    var minDate = dateDim.bottom(1)[0]["ACTIVITY DATE"];
    var maxDate = dateDim.top(1)[0]["ACTIVITY DATE"];

    //Charts
    var caloriesChart = dc.barChart("#calories-burned-chart");
    var stepsChart = dc.barChart("#steps-chart");
    var distanceChart = dc.barChart("#distance-chart");
    var floorsChart = dc.barChart("#floors-chart");



    distanceChart
       .width(300)
       .height(250)
       .dimension(distanceDim)
       .group(numDistance)
       .xAxis().ticks(4);

    floorsChart
       .width(300)
       .height(250)
       .dimension(floorsDim)
       .group(numFloors)
       .xAxis().ticks(4);


    timeChart
        .width(800)
        .height(200)
        .margins({top: 10, right: 50, bottom: 30, left: 50})
        .dimension(dateDim)
        .group(numActivityByDate)
        .transitionDuration(500)
        .x(d3.time.scale().domain([minDate, maxDate]))
        .elasticY(true)
        .xAxisLabel("Year")
        .yAxis().ticks(4);

    caloriesChart
        .width(300)
        .height(250)
        .dimension(caloriesDim)
        .group(numCalories)
        .xAxis().ticks(4);

    stepsChart
        .width(300)
        .height(250)
        .dimension(stepsDim)
        .group(numSteps)
        .xAxis().ticks(4);


    dc.renderAll();
}