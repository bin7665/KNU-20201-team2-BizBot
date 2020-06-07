// set the dimensions and margins of the graph
var margin = {top: 10, right: 100, bottom: 30, left: 100},
    width = 700 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// append the coronagrp_svg object to the body of the page
var coronagrp_svg = d3.select("#coronaGraph")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform","translate(" + margin.left + "," + margin.top + ")");

//Read the data
d3.csv("https://raw.githubusercontent.com/datasets/covid-19/master/data/key-countries-pivoted.csv",
 function(data) {
    // List of groups (here I have one group per column)
    var allGroup = ["China","US","United_Kingdom","Italy","France","Germany","Spain","Iran"]
    // Reformat the data: we need an array of arrays of {x, y} tuples
    var dataReady = allGroup.map( function(grpName) { // .map allows to do something for each element of the list
      return {
        name: grpName,
        values: data.map(function(d) {
          return {Date: (d.Date), value: +d[grpName]};
        })
      };
    });
    
    // A color scale: one color for each group
    var myColor = d3.scaleOrdinal()
      .domain(allGroup)
      .range(d3.schemeSet2);

    // Add X axis --> it is a Date format
    var x = d3.scaleTime()
      .domain(d3.extent(data, function(d) { return d.date }))
      .range([ 0, width ]);
    coronagrp_svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    // Add Y axis
    var y = d3.scaleLinear()
      .domain([
        d3.min(data.map(function(d){
          return d3.min(allGroup.map(function(name){
            return parseInt(d[name])
          }))
        })),
        d3.max(data.map(function(d){
          return d3.max(allGroup.map(function(name){
            return parseInt(d[name])
          }))
        }))])
      .range([ height, 0 ]);
    coronagrp_svg.append("g")
      .call(d3.axisLeft(y));

    // create a tooltip
    var Tooltip = d3.select("#coronaGraph")
      .append("div")
      .style("opacity", 0)
      .attr("class", "tooltip")
      .style("background-color", "white")
      .style("border", "solid")
      .style("border-width", "2px")
      .style("border-radius", "5px")
      .style("padding", "5px")

    // Three function that change the tooltip when user hover / move / leave a cell
    var mouseover = function(d) {
      Tooltip
          .style("opacity", 1)
    }
    var mousemove = function(d) {
      Tooltip
        .html("Exact value: " + d.value)
        .style("left", (d3.mouse(this)[0]+70) + "px")
        .style("top", (d3.mouse(this)[1]) + "px")
    }
    var mouseleave = function(d) {
      Tooltip
        .style("opacity", 0)
    }

    // Add the lines
    var line = d3.line().curve(d3.curveBasis)
      .x(function(d) { return x(+d.Date) })
      .y(function(d) { return y(+d.value) })
    coronagrp_svg.selectAll("myLines")
      .data(dataReady)
      .enter()
      .append("path")
        .attr("d", function(d){ return line(d.values) } )
        .attr("stroke", function(d){ return myColor(d.name) })
        .style("stroke-width", 4)
        .style("fill", "none")

    //Add the points
    coronagrp_svg.selectAll("myDots")
      .data(dataReady)
      .enter()
        .append('g')
        .style("fill", function(d){ return myColor(d.name) })
      .selectAll("myPoints")
      .data(function(d){ return d.values })
      .enter()
      .append("circle")
        .attr("cx", function(d) { return x(d.Date) } )
        .attr("cy", function(d) { return y(d.value) } )
        .attr("r", 2)
        .attr("stroke", null)
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)

    //Add a legend at the end of each line 
    coronagrp_svg.selectAll("myLabels")
      .data(dataReady)
      .enter()
        .append('g')
        .append("text")
          .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; }) // keep only the last value of each Date series
          .attr("transform", function(d) { return "translate(" + x(d.value.Date) + "," + y(d.value.value) + ")"; }) // Put the text at the position of the last point
          .attr("x", 12) // shift the text a bit more right
          .text(function(d) { return d.name; })
          .style("fill", function(d){ return myColor(d.name) })
          .style("font-size", 15)
})