var s2g2Width = 600,
 s2g2Height = 600;

d3.csv("https://raw.githubusercontent.com/bin7665/KNU-20201-team2-BizBot/master/static/data/depart_data_1.csv",
  function(d){
    return { label : d.depart, value : +d.value }
  },
  // Now I can use this dataset:
  function(data) {
    // sort data
    data.sort(function(a, b) {
      return a.value - b.value;
    });
    
    var pie = new d3pie("section2_graph2", {
      header: {
        "title": {
          "text": "부서별 정부지원사업 건 수",
          "fontSize": 24,
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

        },
        onMouseoutSegment: function (info) {

        },
      },
    });

// let legend = d3.select("#section2_graph2").append('div')
//   .attr('class', 'legend')
//   .style('margin-top', '30px');

// let keys = legend.selectAll('.key')
// 			.data(data)
// 			.enter().append('div')
// 			.attr('class', 'key')
// 			.style('display', 'flex')
// 			.style('align-items', 'center')
// 			.style('margin-right', '20px');

// 		keys.append('div')
// 			.attr('class', 'symbol')
// 			.style('height', '10px')
// 			.style('width', '10px')
// 			.style('margin', '5px 5px')
// 			.style('background-color', (d, i) => color(i));

// 		keys.append('div')
// 			.attr('class', 'name')
// 			.text(d => `${d.depart} (${d.value})`);

// 		keys.exit().remove();
  })