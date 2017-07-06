queue()
   .defer(d3.json, "/fitbit/heart_rate")
   .await(makeGraphs);

function makeGraphs(error, heart_rateJson) {

    //Clean projectsJson data
    var fitbit_heart_rate = heart_rateJson;
    var dateFormat = d3.time.format("%Y-%m-%d");
    var displayDate = d3.time.format("%d %b");
    var week = d3.time.format("%U");
    fitbit_heart_rate.forEach(function (d) {
        d["date"] = dateFormat.parse(d["date"]);
        d["resting_heart_rate"] = +d["resting_heart_rate"];
       // d["normal_min_heart_rate"] = +d["normal_min_heart_rate"];
      //  d["normal_max_heart_rate"] = +d["normal_max_heart_rate"];
       // d["normal_calories_burned"] = +d["normal_calories_burned"];
       // d["normal_minutes"] = +d["normal_minutes"];
        d["fat_burn_min_heart_rate"] = +d["fat_burn_min_heart_rate"];
        d["fat_burn_max_heart_rate"] = +d["fat_burn_max_heart_rate"];
        d["fat_burn_calories_burned"] = +d["fat_burn_calories_burned"];
        d["fat_burn_minutes"] = +d["fat_burn_minutes"];
        d["cardio_min_heart_rate"] = +d["cardio_min_heart_rate"];
        d["cardio_max_heart_rate"] = +d["cardio_max_heart_rate"];
        d["cardio_calories_burned"] = +d["cardio_calories_burned"];
        d["cardio_minutes"] = +d["cardio_minutes"];
        d["peak_min_heart_rate"] = +d["peak_min_heart_rate"];
        d["peak_max_heart_rate"] = +d["peak_max_heart_rate"];
        d["peak_calories_burned"] = +d["peak_calories_burned"];
        d["peak_minutes"] = +d["peak_minutes"];
        // FILL OUT RELEVANT LINES
        d.value = +[d.value];
    });

    //Create a Crossfilter instance
    var ndx = crossfilter(fitbit_heart_rate);

    //Define data dimensions
    var dateDim =ndx.dimension(function(d) {
        return d3.time.day(d["date"]);
    });
    var restingHRDim =ndx.dimension(function(d) {
        return d["resting_heart_rate"];
      });

    var fatburnMinHRDim =ndx.dimension(function(d) {
        return d["fat_burn_min_heart_rate"];
        });
    var fatburnMaxHRDim =ndx.dimension(function(d) {
        return d["fat_burn_max_heart_rate"];
        });
    var fatburnCalsDim =ndx.dimension(function(d) {
        return d["fat_burn_calories_burned"];
        });
    var fatburnMinsDim =ndx.dimension(function(d) {
        return d["fat_burn_minutes"];
        });

    var cardioMinHRDim =ndx.dimension(function(d) {
        return d["cardio_min_heart_rate"];
        });
    var cardioMaxHRDim =ndx.dimension(function(d) {
        return d["cardio_max_heart_rate"];
        });
    var cardioCalsDim =ndx.dimension(function(d) {
        return d["cardio_calories_burned"];
        });
    var cardioMinsDim =ndx.dimension(function(d) {
        return d["cardio_minutes"];
        });

    var peakMinHRDim =ndx.dimension(function(d) {
        return d["peak_min_heart_rate"];
        });
    var peakMaxHRDim =ndx.dimension(function(d) {
        return d["peak_max_heart_rate"];
        });
    var peakCalsDim =ndx.dimension(function(d) {
        return d["peak_calories_burned"];
        });
    var peakMinsDim =ndx.dimension(function(d) {
        return d["peak_minutes"];
        });




    // Define Data Groups, Calculate Metrics
    var restingHRAvg = restingHRDim.group().reduce(reduceAdd, reduceRemove, reduceInitial);

      function reduceAdd(p, v) {
        ++p.count;
        p.total += v.value;
        return p;
      }
      function reduceRemove(p, v) {
        --p.count;
        p.total -= v.value;
        return p;
      }
      function reduceInitial() {
        return {count: 0, total: 0};
      }


    var fatburMinHRGroup = dateDim.group().reduceSum(function (d){
        return d.fat_burn_min_heart_rate;
    });
    var fatburMaxHRGroup = dateDim.group().reduceSum(function (d){
        return d.fat_burn_max_heart_rate;
    });


    var cardioMinHRGroup = dateDim.group().reduceSum(function (d){
        return d.cardio_min_heart_rate;
    });
    var cardioMaxHRGroup = dateDim.group().reduceSum(function (d){
        return d.cardio_max_heart_rate;
    });


    var peakMinHRGroup = dateDim.group().reduceSum(function (d){
        return d.peak_min_heart_rate;
    });
    var peakMaxHRGroup = dateDim.group().reduceSum(function (d){
        return d.peak_max_heart_rate;
    });

    var peakMingroup = dateDim.group()/reduceSum(function (d){
        return d.peak_minutes;
    });


      console.log(restingHRAvg);

    
    var all = ndx.groupAll();


    //Define values (to be used in charts)
    var minDate = dateDim.bottom(1)[0]["date"];
    var maxDate = dateDim.top(1)[0]["date"];


    //Charts
    var avgRestingHR_ND = dc.numberDisplay("#average-resting-hr");
    var heartRateChart = dc.lineChart("#heart-rate");
    

    var margin = {top: 30, right: 50, bottom: 25, left: 30},
        width = 700 - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom;

    var x = d3.time.scale().range([0, width]);
    var y = d3.scale.linear().range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .tickSize(6.0)
        .tickFormat(d3.time.format("%d"));
    var yAxis = d3.svg.axis().scale(y)
        .orient("left")
        .ticks(6);

   //Charts

   avgRestingHR_ND
      .formatNumber(d3.format("d"))
      .valueAccessor(function (d){
        return d;
      })
      .group(restingHRAvg);

   caloriesChart
       .width(width)
       .height(height)
       .margins(margin)
       .dimension(dateDim)
       .group(all)
       .transitionDuration(5000)
       .brushOn(false)
       .title(function(d){return d.value + " bpm";})
       .x(d3.time.scale().domain([minDate, maxDate]))
       .xUnits(d3.time.days)
       .elasticY(true)
       .elasticX(true)
       .xAxisLabel("May")
       .yAxisLabel("Heart Rate")
       .yAxis(yAxis)
       .xAxis(xAxis);
    
    dc.renderAll();
}