// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 40, left: 100},
    s1g2Width = 460 - margin.left - margin.right,
    s1g2Height = 300 - margin.top - margin.bottom;

// append the svg object to the body of the page
var s1g2Svg = d3.select("#section1_graph2")
  .append("svg")
    .attr("width", s1g2Width + margin.left + margin.right)
    .attr("height", s1g2Height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// Parse the Data
d3.csv("https://raw.githubusercontent.com/bin7665/KNU-20201-team2-BizBot/master/static/data/circle_year.csv", function(data) {
// sort data
data.sort(function(a, b) {
  return a.year - b.year;
});

// Add X axis
var x = d3.scaleLinear()
  .domain([0, 10000])
  .range([ 0, s1g2Width]);
s1g2Svg.append("g")
  .attr("transform", "translate(0," + s1g2Height + ")")
  .call(d3.axisBottom(x))
  .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end");

// Y axis
var y = d3.scaleBand()
  .range([ 0, s1g2Height ])
  .domain(data.map(function(d) { return d.year; }))
  .padding(1);
s1g2Svg.append("g")
  .call(d3.axisLeft(y))

// Lines
s1g2Svg.selectAll("myline")
  .data(data)
  .enter()
  .append("line")
    .attr("x1", x(0))
    .attr("x2", x(0))
    .attr("y1", function(d) { return y(d.year); })
    .attr("y2", function(d) { return y(d.year); })
    .attr("stroke", "grey")

// Circles -> start at X=0
s1g2Svg.selectAll("mycircle")
  .data(data)
  .enter()
  .append("circle")
    .attr("cx", x(0) )
    .attr("cy", function(d) { return y(d.year); })
    .attr("r", "7")
    .style("fill", "#69b3a2")
    .attr("stroke", "black")

// Change the X coordinates of line and circle
s1g2Svg.selectAll("circle")
  .transition()
  .duration(2000)
  .attr("cx", function(d) { return x(d.value); })

s1g2Svg.selectAll("line")
  .transition()
  .duration(2000)
  .attr("x1", function(d) { return x(d.value); })
})