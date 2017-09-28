window.onload = function() {
queue()
   .defer(d3.json, "/fitbit/heart_rate")
   .await(makeGraphs);

function makeGraphs(error, heart_rateJson) {

    //Clean projectsJson data
    var fitbit_heart_rate = heart_rateJson;
    var dateFormat = d3.time.format("%Y-%m-%d");
    var displayDate = d3.time.format("%d %b");
    var week = d3.time.format("%U");
    //var monthNameFormat = d3.time.format("%b");
    fitbit_heart_rate.forEach(function (d) {
        d.date = dateFormat.parse(d.date);
        //d.month = d3.time.month(d.date);
        d.resting_heart_rate = +d.resting_heart_rate;
        d.fat_burn_min_heart_rate = +d.fat_burn_min_heart_rate;
        d.fat_burn_max_heart_rate = +d.fat_burn_max_heart_rate;
        d.fat_burn_calories_burned = +d.fat_burn_calories_burned ;
        d.fat_burn_minutes = +d.fat_burn_minutes;
        d.cardio_min_heart_rate = +d.cardio_min_heart_rate ;
        d.cardio_max_heart_rate = +d.cardio_max_heart_rate;
        d.cardio_calories_burned = + d.cardio_calories_burned;
        d.cardio_minutes = +d.cardio_minutes;
        d.peak_min_heart_rate = + d.peak_min_heart_rate ;
        d.peak_max_heart_rate = +d.peak_max_heart_rate;
        d.peak_calories_burned= +d.peak_calories_burned;
        d.peak_minutes = +d.peak_minutes;
        // FILL OUT RELEVANT LINES
        d.value = +[d.value];
    });

    //Create a Crossfilter instance
    var ndx = crossfilter(fitbit_heart_rate);

    //Define data dimensions
    var dateDim =ndx.dimension(function(d) {
        return d.date;
    });
    var monthDim=ndx.dimension(function(d) {
        var month = d.date.getMonth();
        var months= ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        if (typeof month !== 'undefined' && parseInt(month) > 0 && parseInt(month) < 12) {
          return months[month];
        }
        return undefined;
    });


    var restingHRDim =ndx.dimension(function(d) {
        return d.resting_heart_rate;
      });

    var fatburnMinHRDim =ndx.dimension(function(d) {
        return d.fat_burn_min_heart_rate;
        });
    var fatburnMaxHRDim =ndx.dimension(function(d) {
        return d.fat_burn_max_heart_rate;
        });
    var fatburnCalsDim =ndx.dimension(function(d) {
        return d.fat_burn_calories_burned;
        });
    var fatburnMinsDim =ndx.dimension(function(d) {
        return d.fat_burn_minutes;
        });

    var cardioMinHRDim =ndx.dimension(function(d) {
        return d.cardio_min_heart_rate;
        });
    var cardioMaxHRDim =ndx.dimension(function(d) {
        return d.cardio_max_heart_rate;
        });
    var cardioCalsDim =ndx.dimension(function(d) {
        return d.cardio_calories_burned;
        });
    var cardioMinsDim =ndx.dimension(function(d) {
        return d.cardio_minutes;
        });

    var peakMinHRDim =ndx.dimension(function(d) {
        return d.peak_min_heart_rate;
        });
    var peakMaxHRDim =ndx.dimension(function(d) {
        return d.peak_max_heart_rate;
        });
    var peakCalsDim =ndx.dimension(function(d) {
        return d.peak_calories_burned;
        });
    var peakMinsDim =ndx.dimension(function(d) {
        return d.peak_minutes;
        });




    // Define Data Groups, Calculate Metrics
    
    // A custom reduce function that takes all the values of our heart rate
    // data set and counts up the total heart rate as well as the number of 
    // heart rate data points. We use this later to get the average
    var restingHRTotals = restingHRDim
      .groupAll()
      .reduce(
    // This "reduceAdd" function is run on every object in your group
    //  as well as when you add new data to the group.
    //  
    // P is the 'running total' object that you set up in the reduceInitial
    // function, in other words it's the 'count', 'total' and 'avg' values
    // 
    // V is the actual row from the database, so a single data entry
    // with your heart rate values for one day.
      function(p, v) {
        console.log(p, v);
        ++p.count;
        p.total += v.resting_heart_rate;
        return p;
      },
      // This is the "reduceRemove" function and is basically the reverse
      // of the add function.
      function(p, v) {
        --p.count;
        p.total -= v.resting_heart_rate;
        return p;
      },
      // This function is used only once, at the start of the reduce operation
      // to define your initial state (your starting parameters). In this case
      // we are creating an object with 3 values, but that's not required. We
      // could just as easily return a single value if we were doing a less
      // complicated operation. In this case we need all 3 values to be able
      // to calculate our average
      function(){
        return {count:0, total:0};
      });

      // This function performs the actual averaging of the heart rate data
      // after the reduce function is carried out.
    var restingHRAVG = function(d) {
      var avg = d.count ? d.total/d.count : 0;
      console.log('AVG', avg);
      return avg;
    };






    var fatburMinHRGroup = dateDim.group().reduceSum(function (d){
        return d.fat_burn_min_heart_rate;
    });
    var fatburMaxHRGroup = dateDim.group().reduceSum(function (d){
        return d.fat_burn_max_heart_rate;
    });
    var fatburnCalsGroup = dateDim.group().reduceSum(function (d){
        return d.fat_burn_calories_burned;
    });
    var fatburnMinsGroup = dateDim.group().reduceSum(function (d){
        return d.fat_burn_minutes;
    });



    var cardioMinHRGroup = dateDim.group().reduceSum(function (d){
        return d.cardio_min_heart_rate;
    });
    var cardioMaxHRGroup = dateDim.group().reduceSum(function (d){
        return d.cardio_max_heart_rate;
    });
    var cardioCalsGroup = dateDim.group().reduceSum(function (d){
        return d.cardio_calories_burned;
    });
    var cardioMinsGroup = dateDim.group().reduceSum(function (d){
        return d.cardio_minutes;
    });



    var peakMinHRGroup = dateDim.group().reduceSum(function (d){
        return d.peak_min_heart_rate;
    });
    var peakMaxHRGroup = dateDim.group().reduceSum(function (d){
        return d.peak_max_heart_rate;
    });

    var peakCalsGroup = dateDim.group().reduceSum(function (d){
        return d.peak_calories_burned;
    });

    var peakMinsGroup = dateDim.group().reduceSum(function (d){
        return d.peak_minutes;
    });

    var monthGroup = monthDim.group();

    var all = ndx.groupAll();


    //Define values (to be used in charts)
    var minDate = dateDim.bottom(1)[0].date;
    var maxDate = dateDim.top(1)[0].date;


    //Charts
    var avgRestingHR_ND = dc.numberDisplay("#average-resting-hr");
    var maxHeartRateChart = dc.lineChart("#max-heart-rate");
    var heartRateCalsBurnedChart = dc.lineChart("#heart-rate-cals");
    var minsInHRZonesChart = dc.lineChart("#mins-in-heart-rate");
    

    var margin = {top: 30, right: 170, bottom: 25, left: 30},
        width = 700 - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom;

    var x = d3.time.scale().range([0, width]);
    var y = d3.scale.linear().range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottomß")
        .tickSize(6.0)
        .tickFormat(d3.time.format("%d"));
    var yAxis = d3.svg.axis().scale(y)
        .orient("left")
        .ticks(8);

   //Charts

   selectField = dc.selectMenu('#menu-select')
       .dimension(monthDim)
       .group(monthGroup);

   avgRestingHR_ND
      .formatNumber(d3.format(".3g"))
      .valueAccessor(restingHRAVG)
      .group(restingHRTotals);

   maxHeartRateChart 
       .width(700)
       .height(height)
       .margins(margin)
       .dimension(dateDim)
       .group(fatburMaxHRGroup, "Fat Burn Heart Rate")
       .stack(cardioMaxHRGroup, "Cardio Heart Rate")
       .stack(peakMaxHRGroup, "Peak Heart Rate")
       .transitionDuration(5000)
       .brushOn(false)
       .renderArea(true)
       .title(function(d){return d.value + " bpm";})
       .x(d3.time.scale().domain([minDate, maxDate]))
       .xUnits(d3.time.days)
       .elasticY(true)
       .elasticX(true)
       .xAxisLabel("2017")
       .yAxisLabel("Heart Rate")
       .legend(dc.legend()
          .x(550)
          .y(-2)
          .itemHeight(13)
          .gap(5))
       .yAxis(yAxis)
       .xAxis(xAxis);

    heartRateCalsBurnedChart
       .width(700)
       .height(height)
       .margins(margin)
       .dimension(dateDim)
       .group(fatburnCalsGroup, "Fat Burn")
       .stack(cardioCalsGroup, "Cardio")
       .stack(peakCalsGroup, "Peak")
       .transitionDuration(5000)
       .brushOn(false)
       .renderArea(true)
       .title(function(d){return d.value + "cals";})
       .x(d3.time.scale().domain([minDate, maxDate]))
       .xUnits(d3.time.days)
       .elasticY(true)
       .elasticX(true)
       .xAxisLabel("2017")
       .yAxisLabel("Calories Burned")
       .legend(dc.legend()
          .x(550)
          .y(-2)
          .itemHeight(13)
          .gap(5))
       .yAxis(yAxis)
       .xAxis(xAxis);

    minsInHRZonesChart
       .width(700)
       .height(height)
       .margins(margin)
       .dimension(dateDim)
       .group(fatburnMinsGroup, "Fat Burn")
       .stack(cardioMinsGroup, "Cardio")
       .stack(peakMinsGroup, "Peak")
       .transitionDuration(5000)
       .brushOn(false)
       .renderArea(true)
       .title(function(d){return d.value + "minutes";})
       .x(d3.time.scale().domain([minDate, maxDate]))
       .xUnits(d3.time.days)
       .elasticY(true)
       .elasticX(true)
       .xAxisLabel("2017")
       .yAxisLabel("Minutes Spent In Heart Rate Zone")
       .legend(dc.legend()
          .x(550)
          .y(-2)
          .itemHeight(13)
          .gap(5))
       .yAxis(yAxis)
       .xAxis(xAxis);


    dc.renderAll();
}
};