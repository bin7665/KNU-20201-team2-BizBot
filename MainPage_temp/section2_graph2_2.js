// set the dimensions and margins of the graph
var s2g2Width_2 = 500,
    s2g2Height_2 = 500,
    s2g2Margin_2 = 40;

// The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
var radius_2 = Math.min(s2g2Width_2, s2g2Height_2) / 2 - s2g2Margin_2

// append the svg object to the div called 'my_dataviz'
var s2g2Svg_2 = d3.select("#section2_graph2_2")
  .append("svg")
    .attr("width", s2g2Width_2)
    .attr("height", s2g2Height_2)
  .append("g")
    .attr("transform", "translate(" + s2g2Width / 2 + "," + s2g2Height / 2 + ")");
    //.attr("transform", "translate(" + (s2g2Width_2 / 2 + s2g2Width_2) + "," + s2g2Height_2 / 2 + ")");

//Read the data
d3.csv("https://raw.githubusercontent.com/bin7665/KNU-20201-team2-BizBot/master/static/data/depart_data_2.csv",
  // Now I can use this dataset:
  function(data) {
    // When reading the csv, I must format variables:
    var Stringdata2 = '{ ';
        data.map(function(d){
          Stringdata2 += `${JSON.stringify(d.depart)} : ${JSON.stringify(d.value)}, `;
        })
        Stringdata2 = Stringdata2.substr(0, Stringdata2.length-2);
        Stringdata2 += ' }';

    var dataReady2 = JSON.parse(Stringdata2)

    // set the color scale
    var color_2 = d3.scaleOrdinal()
      .domain(dataReady2)
      .range(d3.schemeSet2);

    // Compute the position of each group on the pie:
    var pie_2 = d3.pie()
      .value(function(d) { return d.value;})
    var data_ready_2 = pie_2(d3.entries(dataReady2))
    // Now I know that group A goes from 0 degrees to x degrees and so on.

    // shape helper to build arcs:
    var arcGenerator = d3.arc()
      .innerRadius(0)
      .outerRadius(radius_2)

    // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
    s2g2Svg_2
      .selectAll('mySlices2')
      .data(data_ready_2)
      .enter()
      .append('path')
        .attr('d', arcGenerator)
        .attr('fill', function(d){ return color_2(d.data.key)})
        .style("stroke-width", "2px")
        .style("opacity", 0.7)

    // Now add the annotation. Use the centroid method to get the best coordinates
    s2g2Svg_2
      .selectAll('mySlices2')
      .data(data_ready_2)
      .enter()
      .append('text')
      .text(function(d){ return d.data.key})
      .attr("transform", function(d) { return "translate(" + arcGenerator.centroid(d) + ")";  })
      .style("text-anchor", "middle")
      .style("font-size", 17)
})