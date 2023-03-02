import {addChartHeartRate} from "../components/chartsJs.js";

const page = `
<h2>ГРАФИКИ!!12</h2>
  <div style="width: 800px;"><canvas id="container"></canvas></div>
`

export const chartsJsScreen = {
  navName: "CHARTS.JS",
  title: "CHARTS.JS",
  start: startChartsJsScreen,
  path: "?screen=charts.js",
  html: page,
}

function startChartsJsScreen() {
  addChartHeartRate(264)
}

