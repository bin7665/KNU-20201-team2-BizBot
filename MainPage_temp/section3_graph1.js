// set the dimensions and s3g1Margins of the graph
var s3g1Margin = {top: 10, right: 30, bottom: 10, left: 80},
    s3g1Width = 760 - s3g1Margin.left - s3g1Margin.right,
    s3g1Height = 400 - s3g1Margin.top - s3g1Margin.bottom;
    // append the svg object to the body of the page
    var s3g1Svg = d3.select("#section3_graph1")
      .append("svg")
        .attr("width", s3g1Width + s3g1Margin.left + s3g1Margin.right+50)
        .attr("height", s3g1Height + s3g1Margin.top + s3g1Margin.bottom+40)
      .append("g")
        .attr("transform",
              "translate(" + s3g1Margin.left + "," + s3g1Margin.top + ")")   

//Read the data
d3.csv("https://raw.githubusercontent.com/bin7665/KNU-20201-team2-BizBot/master/static/data/period_data.csv", function(data) {
    // sort data
    data.sort(function(a, b) {
        return a.Period - b.Period;
    });
  // Add X axis
  var x = d3.scaleLinear()
    .domain([0, 300])
    .range([ 0, s3g1Width ]);
  var s3g1xAxis = s3g1Svg.append("g")
    .attr("class", "myXaxis")   // Note that here we give a class to the X axis, to be able to call it later and modify it
    .attr("transform", "translate(0," + s3g1Height + ")")
    .call(d3.axisBottom(x))

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([0, 3000])
    .range([ s3g1Height, 0]);
  s3g1Svg.append("g")
    .call(d3.axisLeft(y));

    // Add the line
    var myline = s3g1Svg.append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", "rgba(251, 196, 0)")
    .attr("stroke-width", 3)
    .attr("d", d3.line()
        .curve(d3.curveBasis) // Just add that to have a curve instead of segments
        .x(function(d) { return x(d.Period); })
        .y(function(d) { return y(d.Value); })
    ) 
      
    s3g1Svg.append('text')
        .text("건 수")
        .attr("writing-mode", "vertical-rl")
        .attr("transform", "translate(" + (-50) + "," + (s3g1Height/2) + ")")
        .style("text-anchor", "middle")
        .style("font-size", 15)

    s3g1Svg.append('text')
        .text("접수기간(일)")
        .attr("transform", "translate(" + s3g1Width / 2 + "," + (s3g1Height+40) + ")")
        .style("text-anchor", "middle")
        .style("font-size", 15)

    // A function that update the plot for a given xlim value
    function updatePlot() {
        // Get the value of the button
        xlim = this.value

        // Update X axis
        x.domain([0,xlim])
        s3g1xAxis.transition().duration(1000).call(d3.axisBottom(x))

        // Update chart
        myline
        .datum(data)
        .transition()
        .duration(2000)
        .attr("d", d3.line()
            .curve(d3.curveBasis) // Just add that to have a curve instead of segments
            .x(function(d) { return x(d.Period); })
            .y(function(d) { return y(d.Value); })
        ) 
    }

    // Add an event listener to the button created in the html part
    d3.select("#buttonXlim").on("input", updatePlot )
})