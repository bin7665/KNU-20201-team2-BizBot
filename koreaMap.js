// item change objects
const ranking = document.querySelector(".ranking");
const wordCloud = document.querySelector(".word-cloud");
const supportGraph = document.querySelector(".support-graph");
const s = document.querySelector(".selected");

let menu = "전체";
let item = "지역별 랭킹";

// The svg
var svg = d3.select("svg"),
  width = +svg.attr("width"),
  height = +svg.attr("height");

// Map and projection
var projection = d3
  .geoAitoff()
  .rotate([-128, -36])
  .scale(width * 10)
  .translate([width / 2, height / 2]);

function selected(name, show) {
  menu = name;
  item = show;
  s.innerText = `지역: ${menu}, 아이템: ${item}을 보여줍니다.`;
}

// Load external data and boot
d3.json(
  "https://www.amcharts.com/lib/4/geodata/json/southKoreaHigh.json",
  function (data) {
    let mouseOver = function (d) {
      d3.selectAll(".City").transition().duration(200).style("opacity", 0.5);
      d3.select(this).transition().duration(200).style("opacity", 1);
    };

    let mouseLeave = function (d) {
      d3.selectAll(".City").transition().duration(200).style("opacity", 0.8);
    };

    let mouseClick = function (d) {
      d3.selectAll(".City").attr("fill", "#69b3a2");
      d3.select(this).attr("fill", "#FF3B30");
      selected(d.properties.name, item);
    };

    // Draw the map
    svg
      .append("g")
      .selectAll("path")
      .data(data.features)
      .enter()
      .append("path")
      .attr("class", function (d) {
        return "City";
      })
      .style("opacity", 0.8)
      .attr("fill", "#69b3a2")
      .attr("d", d3.geoPath().projection(projection))
      .style("stroke", "#fff")
      .on("mouseover", mouseOver)
      .on("mouseleave", mouseLeave)
      .on("click", mouseClick);
  }
);

function handleClickItem(event) {
  selected(menu, event.toElement.innerText);
}

ranking.addEventListener("click", handleClickItem);
wordCloud.addEventListener("click", handleClickItem);
supportGraph.addEventListener("click", handleClickItem);
