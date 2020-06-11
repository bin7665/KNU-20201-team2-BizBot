//////////////////////////////////////////////Graph//////////////////////////////////////////////////////////////////
var s1g1Width = 450
var s1g1height = 450

var nodes = d3.range(200).map(function() { return {r: Math.random() * 12 + 4}; }),
    root = nodes[0];

root.radius = 0;
root.fixed = true;

const forceX = d3.forceX(s1g1Width / 2).strength(0.03)
const forceY = d3.forceY(s1g1height / 2).strength(0.03)

var s1g1Force = d3.forceSimulation()
    .velocityDecay(0.2)
    .force("x", forceX)
    .force("y", forceY)
    .force("collide", d3.forceCollide().radius(function(d){
        if(d === root){
            return Math.random() * 50+30;
        }
        return d.r + 0.2;
    }).iterations(3))
    .nodes(nodes).on("tick", ticked);

var s1g1Svg = d3.select("#section1_graph1")
    .append("svg")
        .attr("width", s1g1Width)
        .attr("height", s1g1height);
        
s1g1Svg.selectAll("circle")
    .data(nodes.slice(1))
    .enter()
    .append("circle")
        .attr("r", 6)
        .style("fill", "#D1CC43")
        .style("fill-opacity", 0.7)
        .attr("stroke", "#8D880A")
        .style("stroke-width", 1)

function ticked(e) {
    s1g1Svg.selectAll("circle")
        .data(nodes.slice(1))
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });
};

s1g1Svg.on("mousemove", function() {
    var p1 = d3.mouse(this);
    root.fx = p1[0];
    root.fy = p1[1];
    s1g1Force.alphaTarget(0.2).restart();//reheat the simulation
});

d3.csv("https://raw.githubusercontent.com/bin7665/KNU-20201-team2-BizBot/master/static/data/d3_data.csv",
 function(data) {
    var data = data.map(function(d) {return 1});
    var svg_innerG = s1g1Svg.append("g")
                        .attr("transform", "translate(60, 160)")
        
    svg_innerG.append("rect")
                .attr("class", "label")
                .attr("width", 320)
                .attr("height", 100)
                .attr("rx", 4)
                .attr("ry", 4)

    svg_innerG.append("text")
                .attr("x", 160)
                .attr("y", 60)
                .attr("id", "label_text1")
                .attr("font-size", "30px")
                .attr("fill", "black")
                .attr("text-anchor", "middle")

    document.getElementById("label_text1").innerHTML = `${data.length-1}건`;

    svg_innerG
        .append("circle")
            .attr("r", 6)
            .attr("cx", "282")
            .attr("cy", "-103")
            .style("fill", "#D1CC43")
            .style("fill-opacity", 0.7)
            .attr("stroke", "#8D880A")
            .style("stroke-width", 1)

    svg_innerG.append("text")
                .attr("x", 320)
                .attr("y", -100)
                .attr("id", "label_text2")
                .attr("font-size", "11px")
                .attr("fill", "black")
                .attr("text-anchor", "middle")

    document.getElementById("label_text2").innerHTML = ` 당 약 ${parseInt((data.length-1)/nodes.length)}건`;
 })