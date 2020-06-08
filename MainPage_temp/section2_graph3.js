// set the dimensions and margins of the graph
var s2g3Width = 450,
    s2g3Height = 450,
    s2g3Margin = 40;

// The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
var radius = Math.min(s2g3Width, s2g3Height) / 2 - s2g3Margin

// append the svg object to the div called 'my_dataviz'
var s2g3Svg = d3.select("#section2_graph3")
  .append("svg")
    .attr("width", s2g3Width)
    .attr("height", s2g3Height)
  .append("g")
    .attr("transform", "translate(" + s2g3Width / 2 + "," + s2g3Height / 2 + ")");


//Read the data
d3.csv("https://raw.githubusercontent.com/bin7665/KNU-20201-team2-BizBot/master/static/data/category_inquiry.csv",
  // Now I can use this dataset:
  function(data) {
    // When reading the csv, I must format variables:
    var Stringdata = '{ ';
        data.map(function(d){
          Stringdata += `${JSON.stringify(d.category)} : ${JSON.stringify(d.value)}, `;
        })
        Stringdata = Stringdata.substr(0, Stringdata.length-2);
        Stringdata += ' }';

    var dataReady = JSON.parse(Stringdata)

    // set the color scale
    var color = d3.scaleOrdinal()
      .domain(dataReady)
      .range(d3.schemeSet2);

    // Compute the position of each group on the pie:
    var pie = d3.pie()
      .value(function(d) {return d.value;})
    var data_ready = pie(d3.entries(dataReady))
    // Now I know that group A goes from 0 degrees to x degrees and so on.

    // shape helper to build arcs:
    var arcGenerator = d3.arc()
      .innerRadius(0)
      .outerRadius(radius)

    // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
    s2g3Svg
      .selectAll('mySlices')
      .data(data_ready)
      .enter()
      .append('path')
        .attr('d', arcGenerator)
        .attr('fill', function(d){ return(color(d.data.key)) })
        .attr("stroke", "black")
        .style("stroke-width", "2px")
        .style("opacity", 0.7)

    // Now add the annotation. Use the centroid method to get the best coordinates
    s2g3Svg
      .selectAll('mySlices')
      .data(data_ready)
      .enter()
      .append('text')
        .text(function(d){ return `${d.data.key} : ${d.data.value}`})
        .attr("transform", function(d) { return "translate(" + arcGenerator.centroid(d) + ")";  })
        .style("text-anchor", "middle")
        .style("font-size", 17)
})