import {addCharts} from "../components/highCharts.js";
import {otherWord} from "../language.js";
import {db} from "../db";

const page = `
<h2>ГРАФИКИ!!!1</h2>
<div id="speed" style="margin:0 auto"></div>
<div id="power" style="margin:0 auto"></div>
<div id="hr" style="margin:0 auto"></div>
<div id="cadence" style="margin:0 auto"></div>
<div id="altitude" style="margin:0 auto"></div>
`

export const highChartsScreen = {
  navName: "HIGHCHARTS",
  title: "HIGHCHARTS",
  start: startHighChartsScreen,
  path: "?screen=highcharts.js",
  html: page,
}

function startHighChartsScreen() {
// добавить проверку на флаг isManual в workout
  addCharts(269)
}

