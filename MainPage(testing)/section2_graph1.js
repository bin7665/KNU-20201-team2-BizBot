// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 30, left: 50},
    s2g1Width = 700 - margin.left - margin.right,
    s2g1Height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var s2g1Svg = d3.select("#section2_graph1")
  .append("svg")
    .attr("width", s2g1Width + margin.left + margin.right)
    .attr("height", s2g1Height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

//Read the data
d3.csv("https://raw.githubusercontent.com/bin7665/KNU-20201-team2-BizBot/master/static/data/inquiry_data.csv",
  // When reading the csv, I must format variables:
  function(d){
    return { date : d.Date, value : +d.Value }
  },

  // Now I can use this dataset:
  function(data) {
    // data.forEach(function(d){
    // });

    // sort data
    data.sort(function(a, b) {
        return a.date - b.date;
    });

    // Add X axis --> it is a date format
    var x = d3.scaleBand()
        .range([ 0, s2g1Width ])
        .domain(data.map(function(d) { return d.date; }))
        .padding(5);
    s2g1Svg.append("g")
      .attr("transform", "translate(0," + s2g1Height + ")")
      .call(d3.axisBottom(x));

    // Add Y axis
    var y = d3.scaleLinear()
      .domain([0, d3.max(data, function(d) { return +d.value; })])
      .range([ s2g1Height, 0 ]);
    s2g1Svg.append("g")
      .call(d3.axisLeft(y));

    // create a tooltip
    var Tooltip = d3.select("#section2_graph1")
      .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "3px")
        .style("border-radius", "5px")
        .style("padding", "5px")

    // Three function that change the tooltip when user hover / move / leave a cell
    var mouseover = function(d) {
      Tooltip
        .style("opacity", 1)
    }
    var mousemove = function(d) {
      var Str = JSON.stringify(d.date);
      var year = Str.substring(1,5);
      var quarter = Str.substring(5,6);
      var text = year +"년 "+ quarter+"분기";
      Tooltip
        .html(`${text}: ${d.value}회`)
        .style("left", (d3.mouse(this)[0]+70) + "px")
        .style("top", (d3.mouse(this)[1]) + "px")
    }
    var mouseleave = function(d) {
      Tooltip
        .style("opacity", 0)
    }

    // Add the line
    s2g1Svg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#69b3a2")
      .attr("stroke-width", 1.5)
      .attr("d", d3.line()
        .x(function(d) { return x(d.date) })
        .y(function(d) { return y(d.value) })
        )

    // Add the points
    s2g1Svg
    .append("g")
    .selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
      .attr("cx", function(d) { return x(d.date) } )
      .attr("cy", function(d) { return y(d.value) } )
      .attr("r", 5)
      .attr("fill", "#69b3a2")
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave)
    
    s2g1Svg.select()
})