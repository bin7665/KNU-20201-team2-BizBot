d3.csv("https://raw.githubusercontent.com/bin7665/KNU-20201-team2-BizBot/master/static/data/depart_data_2.csv",
  function(d){
    return { label : d.depart, value : +d.value }
  },
  // Now I can use this dataset:
  function(data) {
    // sort data
    data.sort(function(a, b) {
      return a.value - b.value;
    });
    
    var pie = new d3pie("section2_graph2_2", {
      header: {
        "title": {
          "text": "부서별 정부지원사업 건 수",
          "fontSize": 24,
          "font": "open sans"
        },
        "subtitle": {
          "text": "지자체",
          "color": "#999999",
          "fontSize": 16,
          "font": "open sans"
        },
        "titleSubtitlePadding": 9
      },"size": {
        "canvasWidth": 600,
        "canvasHeight": 500,
        "pieOuterRadius": "90%"
      },"footer": {
        "color": "#999999",
        "fontSize": 10,
        "font": "open sans",
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
        "string": "{label}: {value}건, {percentage}%"
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
          console.log("mouse in", mouseinEvent);
        },
        onMouseoutSegment: function (info) {
          console.log("mouseout:", info);
        },
      },
    });
  })