// set the dimensions and s1g2Margins of the graph
var s1g2Margin = {top: 10, right: 30, bottom: 50, left: 100},
    s1g2Width = 420 - s1g2Margin.left - s1g2Margin.right,
    s1g2Height = 420 - s1g2Margin.top - s1g2Margin.bottom;

// append the svg object to the body of the page
var s1g2Svg = d3.select("#section1_graph2")
  .append("svg")
    .attr("width", s1g2Width + s1g2Margin.left + s1g2Margin.right)
    .attr("height", s1g2Height + s1g2Margin.top + s1g2Margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + s1g2Margin.left + "," + s1g2Margin.top + ")");

// Parse the Data
d3.csv("https://raw.githubusercontent.com/bin7665/KNU-20201-team2-BizBot/master/static/data/circle_year.csv", function(data) {
// sort data
data.sort(function(a, b) {
  return a.year - b.year;
});

// Add X axis
var x = d3.scaleBand()
  .range([ 0, s1g2Width ])
  .domain(data.map(function(d) { return d.year; }))
  .padding(1);
s1g2Svg.append("g")
  .attr("transform", "translate(0," + s1g2Height + ")")
  .call(d3.axisBottom(x))
  
// Y axis
var y = d3.scaleLinear()
  .domain([10000, 0])
  .range([ 0, s1g2Height]);
s1g2Svg.append("g")
  .call(d3.axisLeft(y))
    .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");
  

// Lines
s1g2Svg.selectAll("myline")
.data(data)
.enter()
.append("line")
  .attr("x1", function(d) { return x(d.year); })
  .attr("x2", function(d) { return x(d.year); })
  .attr("y1", y(0))
  .attr("y2", y(0))
  .attr("stroke", "grey")

// Circles -> start at X=0
s1g2Svg.selectAll("mycircle")
.data(data)
.enter()
.append("circle")
  .attr("cx", function(d) { return x(d.year); } )
  .attr("cy", y(0))
  .attr("r", "7")
  .style("fill", "#69b3a2")
  .attr("stroke", "black")

// Change the X coordinates of line and circle
s1g2Svg.selectAll("circle")
  .transition()
  .duration(2000)
  .attr("cy", function(d) { return y(d.value); })

s1g2Svg.selectAll("line")
  .transition()
  .duration(2000)
  .attr("y1", function(d) { return y(d.value); })
})






