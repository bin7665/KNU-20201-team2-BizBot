// menu change objects
const map = document.querySelector(".map__map-image");
const seoul = document.querySelector(".Seoul");
const sejong = document.querySelector(".Sejong");
const busan = document.querySelector(".Busan");
const daegu = document.querySelector(".Daegu");
const inchen = document.querySelector(".Inchen");
const gwangju = document.querySelector(".Gwangju");
const daejeon = document.querySelector(".Daejeon");
const ulsan = document.querySelector(".Ulsan");
const gyeonggi = document.querySelector(".Gyeonggi");
const gangwon = document.querySelector(".Gangwon");
const northCc = document.querySelector(".North-Chungcheong");
const southCc = document.querySelector(".South-Chungcheong");
const northJl = document.querySelector(".North-Jeolla");
const southJl = document.querySelector(".South-Jeolla");
const northGs = document.querySelector(".North-Gyeongsang");
const southGs = document.querySelector(".South-Gyeongsang");
const Jeju = document.querySelector(".Jeju");

// item change objects
const ranking = document.querySelector(".ranking");
const wordCloud = document.querySelector(".word-cloud");
const supportGraph = document.querySelector(".support-graph");

const text = document.querySelector(".view");

let menu = "전체";
let item = "지역별 랭킹";

function changeText() {
  text.innerText = `지역: ${menu}, 아이템: ${item}을 보여줍니다.`;
}

function handleClickMenu(event) {
  if (
    event.toElement.src ===
    "file:///C:/kangbin/github/KNU-20201-team2-BizBot/source/korea-map.gif"
  ) {
    menu = "전체";
    changeText();
  } else {
    menu = event.toElement.innerText;
    changeText();
  }
}

function handleClickItem(event) {
  item = event.toElement.innerText;
  changeText();
}

function init() {
  map.addEventListener("click", handleClickMenu);
  seoul.addEventListener("click", handleClickMenu);
  sejong.addEventListener("click", handleClickMenu);
  busan.addEventListener("click", handleClickMenu);
  daegu.addEventListener("click", handleClickMenu);
  inchen.addEventListener("click", handleClickMenu);
  gwangju.addEventListener("click", handleClickMenu);
  daejeon.addEventListener("click", handleClickMenu);
  ulsan.addEventListener("click", handleClickMenu);
  gyeonggi.addEventListener("click", handleClickMenu);
  gangwon.addEventListener("click", handleClickMenu);
  northCc.addEventListener("click", handleClickMenu);
  southCc.addEventListener("click", handleClickMenu);
  northJl.addEventListener("click", handleClickMenu);
  southJl.addEventListener("click", handleClickMenu);
  northGs.addEventListener("click", handleClickMenu);
  southGs.addEventListener("click", handleClickMenu);
  Jeju.addEventListener("click", handleClickMenu);

  ranking.addEventListener("click", handleClickItem);
  wordCloud.addEventListener("click", handleClickItem);
  supportGraph.addEventListener("click", handleClickItem);
}

init();
