// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 40, left: 100},
    s1g3Width = 460 - margin.left - margin.right,
    s1g3Height = 900 - margin.top - margin.bottom;

// append the svg object to the body of the page
var s1g3Svg = d3.select("#section1_graph3")
  .append("svg")
    .attr("width", s1g3Width + margin.left + margin.right)
    .attr("height", s1g3Height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// Parse the Data
d3.csv("https://raw.githubusercontent.com/bin7665/KNU-20201-team2-BizBot/master/static/data/circle_month.csv", function(data) {
// sort data
data.sort(function(a, b) {
  return a.Date - b.Date;
});

// Add X axis
var x = d3.scaleLinear()
  .domain([0, 1000])
  .range([ 0, s1g3Width]);
s1g3Svg.append("g")
  .attr("transform", "translate(0," + s1g3Height + ")")
  .call(d3.axisBottom(x))
  .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end");

// Y axis
var y = d3.scaleBand()
  .range([ 0, s1g3Height ])
  .domain(data.map(function(d) { return d.Date; }))
  .padding(1);
s1g3Svg.append("g")
  .call(d3.axisLeft(y))

// Lines
s1g3Svg.selectAll("myline")
  .data(data)
  .enter()
  .append("line")
    .attr("x1", x(0))
    .attr("x2", x(0))
    .attr("y1", function(d) { return y(d.Date); })
    .attr("y2", function(d) { return y(d.Date); })
    .attr("stroke", "grey")

// Circles -> start at X=0
s1g3Svg.selectAll("mycircle")
  .data(data)
  .enter()
  .append("circle")
    .attr("cx", x(0) )
    .attr("cy", function(d) { return y(d.Date); })
    .attr("r", "7")
    .style("fill", "#69b3a2")
    .attr("stroke", "black")

// Change the X coordinates of line and circle
s1g3Svg.selectAll("circle")
  .transition()
  .duration(2000)
  .attr("cx", function(d) { return x(d.Value); })

s1g3Svg.selectAll("line")
  .transition()
  .duration(2000)
  .attr("x1", function(d) { return x(d.Value); })

})