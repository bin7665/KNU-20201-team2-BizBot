// item change objects
const selceted = document.querySelector(".selected");
const body = document.querySelector("body");

let area = "전체";
let category = "지역별 랭킹";

// The svg
//var svg = d3.select("#"),
var width = 500;//+svg.attr("width"),
    height = 500;//+svg.attr("height");

// Map and projection
var projection = d3
  .geoAitoff()
  .rotate([-128, -36])
  .scale(width*10)
  .translate([width/2, height/2]);

function showItem() {
  selceted.innerText = `지역: ${area}, 아이템: ${category}을 보여줍니다.`;
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
      area = d.properties.name;
      d3.selectAll(".City").attr("fill", "#69b3a2");
      d3.select(this).attr("fill", "#FF3B30");
      showItem();
    };

    // Draw the map
    var svg = d3.select("#map")
      .append("svg")
        .attr("width", width+100)
        .attr("height", height+100)
      .append("g")
      .selectAll("path")
      .data(data.features)
      .enter()
      .append("path")
        .attr("id", "koreaMap")
        .attr("class", function (d) {
        return `City ${d.properties.name}`;
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
  if (
    event.toElement.parentNode.classList.contains(
      "clickable-items__clickable-item"
    )
  )
    category = event.toElement.innerText;
  else if (event.target.id != "koreaMap") {
    area = "전체";
    d3.selectAll(".City").attr("fill", "#69b3a2");
  }
  showItem();
}

body.addEventListener("click", handleClickItem);