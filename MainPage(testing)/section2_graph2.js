// set the dimensions and margins of the graph
var s2g2Width = 450,
    s2g2Height = 450,
    s2g2Margin = 40;

// The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
var radius = Math.min(s2g2Width, s2g2Height) / 2 - s2g2Margin

// append the svg object to the div called 'my_dataviz'
var svg = d3.select("#section2_graph2")
  .append("svg")
    .attr("width", s2g2Width)
    .attr("height", s2g2Height)
  .append("g")
    .attr("transform", "translate(" + s2g2Width / 2 + "," + s2g2Height / 2 + ")");

//Read the data
d3.csv("https://raw.githubusercontent.com/bin7665/KNU-20201-team2-BizBot/master/static/data/depart_data.csv",
  // When reading the csv, I must format variables:
  function(d){
    // const textdecoder = new TextDecoder("iso-2022-cn-ext");//"\ufeff"+
    // console.log(textdecoder.decode(d.Department))
    return { depart : d.depart, value : +d.value }
  },

  // Now I can use this dataset:
  function(data) {
    // set the color scale
    var color = d3.scaleOrdinal()
      .domain(data.map(function(d){return d.value}))
      .range(d3.schemeSet2);

    // Compute the position of each group on the pie:
    var pie = d3.pie()
      .value(function(d) {return d.value; })
    var data_ready = pie(d3.entries(data))
    // Now I know that group A goes from 0 degrees to x degrees and so on.

    // shape helper to build arcs:
    var arcGenerator = d3.arc()
      .innerRadius(0)
      .outerRadius(radius)

    // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
    svg
      .selectAll('mySlices')
      .data(data_ready)
      .enter()
      .append('path')
        .attr('d', arcGenerator)
        .attr('fill', function(d){ return(color(d.data.depart)) })
        .attr("stroke", "black")
        .style("stroke-width", "2px")
        .style("opacity", 0.7)

    // Now add the annotation. Use the centroid method to get the best coordinates
    svg
      .selectAll('mySlices')
      .data(data_ready)
      .enter()
      .append('text')
      .text(function(d){ return "grp " + d.data.depart})
      .attr("transform", function(d) { return "translate(" + arcGenerator.centroid(d) + ")";  })
      .style("text-anchor", "middle")
      .style("font-size", 17)
})