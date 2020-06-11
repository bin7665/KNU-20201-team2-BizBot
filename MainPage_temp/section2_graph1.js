// set the dimensions and s2g1Margins of the graph
var s2g1Margin = { top: 10, right: 30, bottom: 30, left: 50 },
  s2g1Width = 1000 - s2g1Margin.left - s2g1Margin.right,
  s2g1Height = 400 - s2g1Margin.top - s2g1Margin.bottom;

// append the svg object to the body of the page
var s2g1Svg = d3
  .select("#section2_graph1")
  .append("svg")
  .attr("width", s2g1Width + s2g1Margin.left + s2g1Margin.right + 200)
  .attr("height", s2g1Height + s2g1Margin.top + s2g1Margin.bottom + 50)
  .append("g")
  .attr(
    "transform",
    "translate(" + (s2g1Margin.left + 100) + "," + s2g1Margin.top + ")"
  );

//Read the data
d3.csv(
  "https://raw.githubusercontent.com/bin7665/KNU-20201-team2-BizBot/master/static/data/inquiry_data.csv",
  // When reading the csv, I must format variables:
  function (d) {
    return { date: d.Date, value: +d.Value };
  },

  // Now I can use this dataset:
  function (data) {
    // data.forEach(function(d){
    // });

    // sort data
    data.sort(function (a, b) {
      return a.date - b.date;
    });

    // Add X axis --> it is a date format
    var x = d3
      .scaleBand()
      .range([0, s2g1Width])
      .domain(
        data.map(function (d) {
          return d.date;
        })
      )
      .padding(5);
    s2g1Svg
      .append("g")
      .attr("transform", "translate(0," + s2g1Height + ")")
      .call(d3.axisBottom(x))
      .selectAll("text")
      .text(function (d) {
        var Str = JSON.stringify(d);
        var year = Str.substring(1, 5);
        var quarter = Str.substring(5, 6);
        var text = year + "년 " + quarter + "분기";
        return text;
      })
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");

    // Add Y axis
    var y = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(data, function (d) {
          return +d.value;
        }),
      ])
      .range([s2g1Height, 0]);
    s2g1Svg.append("g").call(d3.axisLeft(y));

    s2g1Svg
      .append("text")
      .text("평균 조회수")
      .attr("writing-mode", "vertical-rl")
      .attr("transform", "translate(" + -50 + "," + s2g1Height / 2 + ")")
      .style("text-anchor", "middle")
      .style("font-size", 10);

    // create a tooltip
    var Tooltip = d3
      .select("#section2_graph1")
      .append("div")
      .style("width", "25%")
      .style("height", "27px")
      .attr("class", "tooltip")
      .style("opacity", 1)
      .style("margin-left", "442px")
      .style("background-color", "white")
      .style("border", "solid")
      .style("border-width", "3px")
      .style("border-radius", "5px")
      .style("border-color", "#D1CC43")
      .style("color", "black")
      .style("background-color", "#D1CC43")
      .style("padding", "5px")
      .html(`점 위에 마우스를 올려보세요!`);

    // Three function that change the tooltip when user hover / move / leave a cell
    var mouseover = function (d) {
      Tooltip.style("opacity", 1);
    };
    var mousemove = function (d) {
      var Str = JSON.stringify(d.date);
      var year = Str.substring(1, 5);
      var quarter = Str.substring(5, 6);
      var text = year + "년 " + quarter + "분기";
      Tooltip.html(`${text}: ${d.value}회`)
        .style("left", d3.mouse(this)[0] + 70 + "px")
        .style("top", d3.mouse(this)[1] + "px");
    };
    var mouseleave = function (d) {};

    // Add the line
    s2g1Svg
      .append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "rgba(251, 196, 0)")
      .attr("stroke-width", 2)
      .attr(
        "d",
        d3
          .line()
          .x(function (d) {
            return x(d.date);
          })
          .y(function (d) {
            return y(d.value);
          })
      );

    // Add the points
    s2g1Svg
      .append("g")
      .selectAll("dot")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", function (d) {
        return x(d.date);
      })
      .attr("cy", function (d) {
        return y(d.value);
      })
      .attr("r", 5)
      .attr("fill", "#69b3a2")
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave);

    s2g1Svg.select();
  }
);
