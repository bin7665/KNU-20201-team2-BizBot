var s2g2Width = 600,
  s2g2Height = 700;

d3.csv("https://raw.githubusercontent.com/bin7665/KNU-20201-team2-BizBot/master/static/data/depart_data_1.csv",
  function(d){
    return { label : d.depart, value : +d.value }
  },
  // Now I can use this dataset:
  function(data) {
    // sort data
    data.sort(function(a, b) {
      return b.value - a.value;
    });
    
    var pie = new d3pie("section2_graph2", {
      header: {
        "title": {
          "text": "부서별 정부지원사업 건 수",
          "fontSize": 20,
          "font": "Nanum Gothic Coding"
        },
        "subtitle": {
          "text": "정부체",
          "color": "#999999",
          "fontSize": 16,
          "font": "Nanum Gothic Coding"
        },
        "titleSubtitlePadding": 9
      },"size": {
        "canvasWidth": 600,
        "pieOuterRadius": "90%"
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
      },"mixc": {
        "pieCenterOffset": {
          "y": -20
        }
      },
    
      //Here further operations/animations can be added like click event, cut out the clicked pie section.
      callbacks: {
        onMouseClickSegment: function (info){
          console.log("click", info)
        }
      },
    });//d3pie

    s2g2Svg = d3.select("#section2_graph2").select("svg")
      .attr("height", s2g2Height);
    var topData = Array();
    for(var i=0; i<5; i++){
      topData.push(data[i]);
    }

    var colors = pie.options.colors

    s2g2Svg.append('g')
      .append("text")
        .attr('x', 60)
        .attr('y', s2g2Height-160)
        .text("TOP 5")
        .style("font-size", 30)
        
    // Add a legend (interactive)
    s2g2Svg
      .selectAll("myLegend")
      .data(topData)
      .enter()
        .append('g')
        .append("text")
          .attr('x', function(d,i){ return 60 + (i%3)*170})
          .attr('y', function(d,i) { return (s2g2Height-120) +Math.floor(i/3)*30})
          .text(function(d,i) { return `${i+1}. ${d.label}(${d.value})`; })
          .style("font-size", 15)
          .style("fill", function(d,i){ return colors[i];})
 })
  // .on("click", function(d){
        //   if(pie.options.data.content.length==data.length){
        //     pie.updateProp("data.content", topData);
        //   } else {
        //     pie.updateProp("data.content", data);
        //     update();
        //   }
        // on("click", function(d){
        //   // is the element currently visible ?
        //   currentOpacity = d3.selectAll("." + d.label).style("opacity")
        //   console.log(currentOpacity)
        //   // Change the opacity: from 0 to 1 or from 1 to 0
        //   d3.selectAll("." + d.name).transition().style("opacity", currentOpacity == 1 ? 0:1);
        // })