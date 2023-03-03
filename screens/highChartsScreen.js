import {addCharts} from "../components/highCharts.js";
import {otherWord} from "../language.js";

const page = `
<h2>ГРАФИКИ!!!1</h2>
<div id="speed" style="width:100%; height:400px; margin:0 auto"></div>
<div id="power" style="width:100%; height:400px; margin:0 auto"></div>
<div id="hr" style="width:100%; height:400px; margin:0 auto"></div>
<div id="cadence" style="width:100%; height:400px; margin:0 auto"></div>
<div id="altitude" style="width:100%; height:400px; margin:0 auto"></div>
`



export const highChartsScreen = {
  navName: "HIGHCHARTS",
  title: "HIGHCHARTS",
  start: startHighChartsScreen,
  path: "?screen=highcharts.js",
  html: page,
}

function startHighChartsScreen() {
  addCharts(264)
}

