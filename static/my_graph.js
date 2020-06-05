// set the dimensions and margins of the graph
var graph_width = 700
  , graph_height = 400

// append the mygrp_svg object to the body of the page
var mygrp_svg = d3.select("#my_graph")
  .append("svg")
    .attr("width", graph_width)
    .attr("height", graph_height)

//Read data
d3.csv("https://raw.githubusercontent.com/datasets/covid-19/master/data/key-countries-pivoted.csv",
  function(data){
    var allGroup = ["China","US","United_Kingdom","Italy","France","Germany","Spain","Iran"]
    var myData = allGroup.map(function(grpName){
      return data.map(function(d){
        return d[grpName]
      })
    })
    console.log(myData[0])
    // Color palette for continents?
    var color = d3.scaleOrdinal()
     .domain(allGroup)
     .range(d3.schemeSet1);

    //Size scale for countries
    var size = d3.scaleLinear()
      .domain([0, 1400000000])
      .range([7,55])  // circle will be between 7 and 55 px wide

    // create a mytooltip
    var myTooltip = d3.select("#my_graph")
      .append("div")
      .style("opacity", 0)
      .attr("class", "mytooltip")
      .style("background-color", "white")
      .style("border", "solid")
      .style("border-width", "2px")
      .style("border-radius", "5px")
      .style("padding", "5px")

    // Three function that change the mytooltip when user hover / move / leave a cell
    var mouseover = function(d) {
      myTooltip
        .style("opacity", 1)
    }
    var mousemove = function(d) {
      myTooltip
        .html('<u>' + d.key + '</u>' + "<br>" + d.value + " inhabitants")
        .style("left", (d3.mouse(this)[0]+20) + "px")
        .style("top", (d3.mouse(this)[1]) + "px")
    }
    var mouseleave = function(d) {
      myTooltip
        .style("opacity", 0)
    }

    // Initialize the circle: all located at the center of the svg area
    var node = mygrp_svg.append("g")
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
      .attr("class", "node")
      .attr("r", function(d){ return size(d.value)})
      .attr("cx", width / 2)
      .attr("cy", height / 2)
      .style("fill", function(d){ return color(d.region)})
      .style("fill-opacity", 0.8)
      .attr("stroke", "black")
      .style("stroke-width", 1)
      .on("mouseover", mouseover) // What to do when hovered
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave)
      .call(d3.drag() // call specific function when circle is dragged
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended));

      // Features of the forces applied to the nodes:
      var simulation = d3.forceSimulation()
          .force("center", d3.forceCenter().x(width / 2).y(height / 2)) // Attraction to the center of the svg area
          .force("charge", d3.forceManyBody().strength(.1)) // Nodes are attracted one each other of value is > 0
          .force("collide", d3.forceCollide().strength(.2).radius(function(d){ return (size(d.value)+3) }).iterations(1)) // Force that avoids circle overlapping
          // .force("center", d3.forceCenter().x(width / 2).y(height / 2)) // Attraction to the center of the svg area
          // .force("charge", d3.forceManyBody().strength(1)) // Nodes are attracted one each other of value is > 0
          // .force("collide", d3.forceCollide().strength(.1).radius(32).iterations(1)) // Force that avoids circle overlapping
          // .force("x", d3.forceX().strength(0.5).x( function(d){ return x(d.group) } ))
          // .force("y", d3.forceY().strength(0.1).y( height/2 ))

      // Apply these forces to the nodes and update their positions.
      // Once the force algorithm is happy with positions ('alpha' value is low enough), simulations will stop.
      simulation
          .nodes(data)
          .on("tick", function(d){
            node
                .attr("cx", function(d){ return d.x; })
                .attr("cy", function(d){ return d.y; })
          });

      // What happens when a circle is dragged?
      function dragstarted(d) {
        if (!d3.event.active) simulation.alphaTarget(.03).restart();
        d.fx = d.x;
        d.fy = d.y;
      }
      function dragged(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
      }
      function dragended(d) {
        if (!d3.event.active) simulation.alphaTarget(.03);
        d.fx = null;
        d.fy = null;
      }
  })