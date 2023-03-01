import {addChartHeartRate} from "../components/charts.js";

const page = `
<h1>Добро пожаловать</h1>
<div id="container" style="width:100%; height:400px; margin:0 auto"></div>
`
export const startScreen = {
  start: startStartScreen,
  path: "/",
  html: page,
}

function startStartScreen() {
  addChartHeartRate(264)
}

