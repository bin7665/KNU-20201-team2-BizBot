d3.csv("https://raw.githubusercontent.com/bin7665/KNU-20201-team2-BizBot/master/static/data/category_inquiry.csv",
  function(d){
    return { label : d.category, value : +d.value }
  },
  // Now I can use this dataset:
  function(data) {
    // sort data
    data.sort(function(a, b) {
      return a.value - b.value;
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
          console.log("mouse in", info);
        },
        onMouseoutSegment: function (info) {
          console.log("mouseout:", info);
        },
      },
    });
  })