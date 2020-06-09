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
          "font": "open sans"
        },
        "subtitle": {
          "text": "정부체",
          "color": "#999999",
          "fontSize": 16,
          "font": "open sans"
        },
        "titleSubtitlePadding": 9
      },"size": {
        "canvasWidth": window.innerWidth/2,
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

    const color = d3.scaleOrdinal(d3.schemeCategory20);

    var legend = s2g2Svg.selectAll('legend')
			.data(data.slice(0,50))
			.enter().append('g')
			.attr('class', 'legend')
			.attr('transform', function(d,i){ 
          //return 'translate(' + ( -50+s2g2Width/4*(Math.floor(i/25)-1) ) + ',' + (i%25 * 20) + ')';
          return `translate(0,0)`
      });

		legend.append('rect')
			.attr('x', s2g2Width)
			.attr('width', 18)
			.attr('height', 18)
			.style('fill', function(d){return color(d.depart);});

		legend.append('text')
			.attr('x', s2g2Width - 6)
			.attr('y', 9)
			.attr('dy', '.35em')
			.style('text-anchor', 'end')
			.text(function(d){ return d.depart + ': ' + d.value; });
  })