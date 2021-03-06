// set the dimensions and s3g2Margins of the graph
var s3g2Margin = {top: 10, right: 0, bottom: 0, left: 80},
    s3g2Width = 800 - s3g2Margin.left - s3g2Margin.right,
    s3g2Height = 400 - s3g2Margin.top - s3g2Margin.bottom;
    // append the s3g2Svg object to the body of the page
    var s3g2Svg = d3.select("#section3_graph2")
      .select("svg")
        .attr("width", s3g2Width + s3g2Margin.left + s3g2Margin.right+70)
        .attr("height", s3g2Height + s3g2Margin.top + s3g2Margin.bottom+70)
      .append("g")
        .attr("transform", "translate(" + s3g2Margin.left + "," + s3g2Margin.top + ")")

//Read the data
d3.csv("https://raw.githubusercontent.com/bin7665/KNU-20201-team2-BizBot/master/static/data/upload_inquiry.csv", 

// When reading the csv, I must format variables:
function(d){
  return { date : d3.timeParse("%Y-%m-%d")(d.upload_date), value : d.inquiry }
},

function(data) {
  // sort data
  data.sort(function(a, b) {
    return a.date - b.date;
  });
  // Add X axis
  var x = d3.scaleTime()
    .domain([0, 0])
    .range([ 0, s3g2Width ]);
  var s3g2xAxis = s3g2Svg.append("g")
    .attr("class", "myXaxis2")   // Note that here we give a class to the X axis, to be able to call it later and modify it
    .attr("transform", "translate(0," + s3g2Height + ")")
    .call(d3.axisBottom(x))
    .attr("opacity", "0")
  
  // Add Y axis
  var y = d3.scaleLinear()
    .domain([0, 30000])//d3.max(data, function(d) { return +d.value; })
    .range([ s3g2Height, 0]);
  var s3g2yAxis = s3g2Svg.append("g")
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

  s3g2Svg.append('text')
    .text("조회수")
    .attr("writing-mode", "vertical-rl")
    .attr("transform", "translate(" + (-50) + "," + (s3g1Height/2) + ")")
    .style("text-anchor", "middle")
    .style("font-size", 15)

  s3g2Svg.append('text')
      .text("등록일자")
      .attr("transform", "translate(" + (s3g1Width / 2+30) + "," + (s3g1Height+60) + ")")
      .style("text-anchor", "middle")
      .style("font-size", 15)

  // new X axis
  x.domain(d3.extent(data, function(d) {return d.date}))
  s3g2xAxis.selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "start");
        
  s3g2Svg.select(".myXaxis2")
    .transition()
    .duration(2000)
    .attr("opacity", "1")
    .call(d3.axisBottom(x));

  s3g2Svg.selectAll("circle")
    .transition()
    .delay(function(d,i){return(i)})
    .duration(100)
    .attr("cx", function (d) { return x(d.date); } )
    .attr("cy", function (d) { return y(d.value); } )

  var V = d3.max(data, function(d) {return Number(d.date)})
  var M = d3.min(data, function(d) {return Number(d.date)})
  var minxd = M,
    maxxd = V;

  d3.select("#buttonylim1")
    .attr("max", Number(new Date("May 31, 2017 00:00:00")))
    .attr("value", M)
    .attr("min", M)
    .attr("step", (Number(new Date("May 31, 2017 00:00:00"))-M)/100)
    .style("padding", "0px")
    .style("margin", "0px")
    .on("input", updatePlot1 )

  d3.select("#buttonylim2")
    .attr("max", V)
    .attr("value", V)
    .attr("min", Number(new Date("June 1, 2017 00:00:00")))
    .attr("step", (V-Number(new Date("June 1, 2017 00:00:00")))/100)
    .style("padding", "0px")
    .style("margin", "0px")
    .on("input", updatePlot2 )

      // A function that update the plot for a given xlim value
      function updatePlot1() {
        // Get the value of the button
        ylim = this.value
        minxd = ylim;
        // Update X axis
        x.domain([ylim,maxxd])
        s3g2xAxis.transition().duration(1000).call(d3.axisBottom(x))
        // Update chart
        s3g2Svg.selectAll("circle")
          .transition()
          .delay(function(d,i){return(i)})
          .duration(100)
          .attr("cx", function (d) { return x(d.date); } )
          .attr("cy", function (d) { return y(d.value); } )
      }

      // A function that update the plot for a given xlim value
      function updatePlot2() {
    
        // Get the value of the button
        ylim = this.value;
        maxxd = ylim;
        // Update X axis
        x.domain([minxd, ylim])
        s3g2xAxis.transition().duration(1000).call(d3.axisBottom(x))
    
        // Update chart
        s3g2Svg.selectAll("circle")
          .transition()
          .delay(function(d,i){return(i)})
          .duration(100)
          .attr("cx", function (d) { return x(d.date); } )
          .attr("cy", function (d) { return y(d.value); } )
      }
})