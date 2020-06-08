// set the dimensions and s1g3Margins of the graph
var s1g3Margin = {top: 10, right: 30, bottom: 40, left: 130},
    s1g3Width = 1500 - s1g3Margin.left - s1g3Margin.right,
    s1g3Height = 460 - s1g3Margin.top - s1g3Margin.bottom;

// append the svg object to the body of the page
var s1g3Svg = d3.select("#section1_graph3")
  .append("svg")
    .attr("width", s1g3Width + s1g3Margin.left + s1g3Margin.right)
    .attr("height", s1g3Height + s1g3Margin.top + s1g3Margin.bottom + 50)
  .append("g")
    .attr("transform",
          "translate(" + s1g3Margin.left + "," + s1g3Margin.top + ")");

// Parse the Data
d3.csv("https://raw.githubusercontent.com/bin7665/KNU-20201-team2-BizBot/master/static/data/circle_month.csv", function(data) {
// sort data
data.sort(function(a, b) {
  return a.Date - b.Date;
});

// Add X axis
var x = d3.scaleBand()
  .range([ 0, s1g3Width ])
  .domain(data.map(function(d) { return d.Date; }))
  .padding(1);
s1g3Svg.append("g")
  .attr("transform", "translate(0," + s1g3Height + ")")
  .call(d3.axisBottom(x))
  .selectAll("text")
    .text(function(d){
      var Str = JSON.stringify(d);
      var year = Str.substring(1,5);
      var month = Str.substring(5,7);
      var text = year +"년 "+ month+"월";
      return text
    })
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end");

// Y axis
var y = d3.scaleLinear()
  .domain([1000, 0])
  .range([ 0, s1g3Height]);
s1g3Svg.append("g")
  .call(d3.axisLeft(y))

// Lines
s1g3Svg.selectAll("myline")
  .data(data)
  .enter()
  .append("line")
    .attr("x1", function(d) { return x(d.Date);})
    .attr("x2", function(d) { return x(d.Date);})
    .attr("y1", y(0))
    .attr("y2", y(0))
    .attr("stroke", "grey")

// Circles -> start at X=0
s1g3Svg.selectAll("mycircle")
  .data(data)
  .enter()
  .append("circle")
    .attr("cx", function(d) { return x(d.Date); } )
    .attr("cy", y(0))
    .attr("r", "7")
    .style("fill", "#69b3a2")
    .attr("stroke", "black")

// Change the X coordinates of line and circle
s1g3Svg.selectAll("circle")
  .transition()
  .duration(2000)
  .attr("cy", function(d) { return y(d.Value); })

s1g3Svg.selectAll("line")
  .transition()
  .duration(2000)
  .attr("y1", function(d) { return y(d.Value); })

})