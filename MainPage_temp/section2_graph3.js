var s2g3Width = 700;
var s2g3Height = 600;

d3.csv("https://raw.githubusercontent.com/bin7665/KNU-20201-team2-BizBot/master/static/data/category_inquiry.csv",
  function(d){
    return { label : d.category, value : +d.value }
  },
  // Now I can use this dataset:
  function(data) {
    // sort data
    data.sort(function(a, b) {
      return b.value - a.value;
    });
    
    var pie = new d3pie("section2_graph3", {
      header: {
        "subtitle": {
          "text": "사업분야별",
          "color": "#999999",
          "fontSize": 18,
          "font": "Nanum Gothic Coding"
        },
        "titleSubtitlePadding": 9
      }, data: {
        content: data
      },"labels": {
        "outer": {
          "pieDistance": 20
        },
        "inner": {
          "hideWhenLessThanPercentage": 2
        }
      },"tooltips": {
        "enabled": true,
        "type": "placeholder",
        "string": "{label}: {value}건, {percentage}%",
        "styles" : {
          "fadeInSpeed": 500,
          "borderRadius": 10,
          "fontSize": 12,
          "padding" : 5
        }
      },"effects": {
        "pullOutSegmentOnClick": {
          "effect": "back",
          "speed": 400,
          "size": 8
        }
      },
    
      //Here further operations/animations can be added like click event, cut out the clicked pie section.
      callbacks: {
        onMouseoverSegment: function (info) {
          console.log("mouse in", info);
        },
        onMouseoutSegment: function (info) {
          console.log("mouseout:", info);
        },
        onMouseClickSegment: function (info){
          console.log("click", info)
        },
      },
    });

    s2g3Svg = d3.select("#section2_graph3").select("svg")
      .attr("width", s2g3Width);
    var topData = Array();
    for(var i=0; i<5; i++){
      topData.push(data[i]);
    }

    var colors = pie.options.colors

    s2g3Svg.append('g')
      .append("text")
        .attr('x', s2g3Width-160)
        .attr('y', 150)
        .text("TOP 5")
        .style("font-size", 30)
        
    // Add a legend (interactive)
    s2g3Svg
      .selectAll("myLegend")
      .data(topData)
      .enter()
        .append('g')
        .append("text")
          .attr('x', function(d,i){ return (s2g3Width-150) })
          .attr('y', function(d,i) { return 200 + i*40})
          .text(function(d,i) { return `${i+1}. ${d.label}(${
            d.value})`; })
          .style("font-size", 15)
          .style("fill", function(d,i){ return colors[i];})
  })