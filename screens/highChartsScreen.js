import {addChartHeartRate} from "../components/highCharts.js";
import {otherWord} from "../language.js";

const page = `
<h2>ГРАФИКИ!!!1</h2>
<div id="container" style="width:100%; height:400px; margin:0 auto"></div>
`



export const highChartsScreen = {
  navName: "HIGHCHARTS",
  title: "HIGHCHARTS",
  start: startHighChartsScreen,
  path: "?screen=highcharts.js",
  html: page,
}

function startHighChartsScreen() {
  addChartHeartRate(264)
}

