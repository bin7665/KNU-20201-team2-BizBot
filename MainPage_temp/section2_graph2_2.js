var s2g2_2Width = 600,
  s2g2_2Height = 700;

d3.csv("https://raw.githubusercontent.com/bin7665/KNU-20201-team2-BizBot/master/static/data/depart_data_2.csv",
  function(d){
    return { label : d.depart, value : +d.value }
  },
  // Now I can use this dataset:
  function(data) {
    // sort data
    data.sort(function(a, b) {
      return b.value - a.value;
    });
    
    var pie = new d3pie("section2_graph2_2", {
      header: {
        "title": {
          "text": "부서별 정부지원사업 건 수",
          "fontSize": 20,
          "font": "Nanum Gothic Coding"
        },
        "subtitle": {
          "text": "지자체",
          "color": "#999999",
          "fontSize": 16,
          "font": "Nanum Gothic Coding"
        },
        "titleSubtitlePadding": 9
      },"size": {
        "canvasWidth": 600,
        "canvasHeight": 500,
        "pieOuterRadius": "90%"
      },"footer": {
        "color": "#999999",
        "fontSize": 10,
        "font": "Nanum Gothic Coding",
        "location": "bottom-left"
      },
      data: {
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
        "fontsize" : 15,
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
        onMouseClickSegment: function (info){
          console.log("click", info)
        },
      },
    });
    
  s2g2_2Svg = d3.select("#section2_graph2_2").select("svg")
      .attr("height", s2g2_2Height);

    var topData = Array();
    for(var i=0; i<5; i++){
      topData.push(data[i]);
    }

    var colors = pie.options.colors;

    s2g2_2Svg.append('g')
      .append("text")
        .attr('x', 60)
        .attr('y', s2g2_2Height-160)
        .text("TOP 5")
        .style("font-size", 30);

    // Add a legend (interactive)
    s2g2_2Svg.selectAll("myLegend")
      .data(topData)
      .enter()
        .append('g')
        .append("text")
          .attr('x', function(d,i){ return 60 + (i%3)*170})
          .attr('y', function(d,i) { return (s2g2_2Height-120) +Math.floor(i/3)*30})
          .text(function(d,i) { return `${i+1}. ${d.label}(${d.value})`; })
          .style("font-size", 15)
          .style("fill", function(d,i){ return colors[i];})
  })