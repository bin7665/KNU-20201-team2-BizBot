// set the dimensions and margins of the graph
var s2g2Width = 500,
    s2g2Height = 500,
    s2g2Margin = 40;

// The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
var radius_1 = Math.min(s2g2Width, s2g2Height) / 2 - s2g2Margin

// append the svg object to the div called 'my_dataviz'
var s2g2Svg_1 = d3.select("#section2_graph2")
  .append("svg")
    .attr("width", s2g2Width)
    .attr("height", s2g2Height)
  .append("g")
    .attr("transform", "translate(" + s2g2Width / 2 + "," + s2g2Height / 2 + ")");

//Read the data
d3.csv("https://raw.githubusercontent.com/bin7665/KNU-20201-team2-BizBot/master/static/data/depart_data_1.csv",
  // Now I can use this dataset:
  function(data) {
    // When reading the csv, I must format variables:
    var Stringdata1 = '{ ';
        data.map(function(d){
          Stringdata1 += `${JSON.stringify(d.depart)} : ${JSON.stringify(d.value)}, `;
        })
        Stringdata1 = Stringdata1.substr(0, Stringdata1.length-2);
        Stringdata1 += ' }';

    var dataReady1 = JSON.parse(Stringdata1)
    
    // set the color scale
    var color_1 = d3.scaleOrdinal()
      .domain(dataReady1)
      .range(d3.schemeSet2);

    // Compute the position of each group on the pie:
    var pie_1 = d3.pie()
      .value(function(d) { return d.value;})
    var data_ready_1 = pie_1(d3.entries(dataReady1))
    // Now I know that group A goes from 0 degrees to x degrees and so on.

    // shape helper to build arcs:
    var arcGenerator = d3.arc()
      .innerRadius(0)
      .outerRadius(radius_1)

    // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
    s2g2Svg_1
      .selectAll('mySlices')
      .data(data_ready_1)
      .enter()
      .append('path')
        .attr('d', arcGenerator)
        .attr('fill', function(d){ return color_1(d.data.key)})
        .style("stroke-width", "1px")
        .style("opacity", 0.7)

    // Now add the annotation. Use the centroid method to get the best coordinates
    // s2g2Svg_1
    //   .selectAll('mySlices')
    //   .data(data_ready_1)
    //   .enter()
    //   .append('text')
    //   .text(function(d){ return d.data.key})
    //   .attr("transform", function(d) { return "translate(" + arcGenerator.centroid(d) + ")";  })
    //   .style("text-anchor", "middle")
    //   .style("font-size", 17)
    var text = s2g2Svg_1
      .selectAll('mySlices')
      .data(data_ready_1)
      .enter()
      .append('text')
      .text(function(d){ return d.data.key})
      .attr("transform", function(d) { return "translate(" + arcGenerator.centroid(d) + ")";  })
      .style("text-anchor", "middle")
      .style("font-size", 17)

  // function midAngle(d){
	// 	return d.startAngle + (d.endAngle - d.startAngle)/2;
	// }

	// text.transition().duration(1000)
	// 	.attrTween("transform", function(d) {
	// 		this._current = this._current || d;
	// 		var interpolate = d3.interpolate(this._current, d);
	// 		this._current = interpolate(0);
	// 		return function(t) {
	// 			var d2 = interpolate(t);
	// 			var pos = outerArc.centroid(d2);
	// 			pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);
	// 			return "translate("+ pos +")";
	// 		};
	// 	})
	// 	.styleTween("text-anchor", function(d){
	// 		this._current = this._current || d;
	// 		var interpolate = d3.interpolate(this._current, d);
	// 		this._current = interpolate(0);
	// 		return function(t) {
	// 			var d2 = interpolate(t);
	// 			return midAngle(d2) < Math.PI ? "start":"end";
	// 		};
	// 	});
})