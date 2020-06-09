// set the dimensions and s3g2Margins of the graph
var s3g2Margin = {top: 10, right: 30, bottom: 30, left: 60},
    s3g2Width = 800 - s3g2Margin.left - s3g2Margin.right,
    s3g2Height = 400 - s3g2Margin.top - s3g2Margin.bottom;
    // append the s3g2Svg object to the body of the page
    var s3g2Svg = d3.select("#section3_graph2")
      .append("svg")
        .attr("width", s3g2Width + s3g2Margin.left + s3g2Margin.right)
        .attr("height", s3g2Height + s3g2Margin.top + s3g2Margin.bottom)
      .append("g")
        .attr("transform", "translate(" + s3g2Margin.left + "," + s3g2Margin.top + ")")

//Read the data
d3.csv("https://raw.githubusercontent.com/bin7665/KNU-20201-team2-BizBot/master/static/data/upload_inquiry.csv", 

// When reading the csv, I must format variables:
function(d){
  return { date : d3.timeParse("%Y-%m-%d")(d.upload_date), value : d.inquiry }
},

function(data) {
  // Add X axis
  var x = d3.scaleLinear()
    .domain([0, 0])
    .range([ 0, s3g2Width ]);
  var s3g2xAxis=s3g2Svg.append("g")
    .attr("class", "myXaxis")   // Note that here we give a class to the X axis, to be able to call it later and modify it
    .attr("transform", "translate(0," + s3g2Height + ")")
    .call(d3.axisBottom(x))
    .attr("opacity", "0")

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([0, d3.max(data, function(d) { return +d.value; })])
    .range([ s3g2Height, 0]);
  s3g2Svg.append("g")
    .call(d3.axisLeft(y));

  // Add dots
  s3g2Svg.append('g')
    .selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
      .attr("cx", function (d) { return x(d.date); } )
      .attr("cy", function (d) { return y(d.value); } )
      .attr("r", 1.5)
      .style("fill", "#69b3a2")

  // new X axis
  x.domain(d3.extent(data, function(d) {return d.date}))
  s3g2xAxis.selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");
  s3g2Svg.select(".myXaxis")
    .transition()
    .duration(2000)
    .attr("opacity", "1")
    .call(d3.axisBottom(x));

  s3g2Svg.selectAll("circle")
    .transition()
    .delay(function(d,i){return(i*2)})
    .duration(500)
    .attr("cx", function (d) { return x(d.date); } )
    .attr("cy", function (d) { return y(d.value); } )
})