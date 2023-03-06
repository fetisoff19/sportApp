import {addCharts} from "../components/highCharts.js";
import {otherWord} from "../language.js";
import {db} from "../db";
import {dict, userLang} from "../config";
import {createMapWithWorkoutRoute} from "../components/maps";

export let training = {};

const page = `
<h2 id="viewTrainingH2"></h2>
<div id="viewBox">
  <div id="viewCharts">
    <div id="speed" class="charts" ></div>
    <div id="pace" class="charts" ></div>
    <div id="power" class="charts" ></div>
    <div id="hr" class="charts" ></div>
    <div id="cadenceCycl" class="charts" ></div>
    <div id="cadenceRun" class="charts" ></div>
    <div id="altitude" class="charts" ></div>
  </div>
  <div>
    <div id="map"></div>
    <div>
        <span id="stats"></span>
    </div>
  </div>
</div>
`

export const highChartsScreen = {
  title: dict.title.viewTraining[userLang],
  start: startHighChartsScreen,
  path: "?screen=highcharts.js",
  html: page,
}

async function startHighChartsScreen() {
  if (training.isManual) {
    addStats (training);
    training = {}; // необходимо обнулять объект каждый раз после
    return
  };
  let viewTrainingH2 = document.getElementById('viewTrainingH2');
  let map = document.getElementById('map')
  viewTrainingH2.innerText = dict.title.viewTraining[userLang] + ' ' + training.name;
  db.get('workoutsData', +training.id).then(workoutData => {
    addCharts(training, workoutData);
    createMapWithWorkoutRoute(workoutData, map, 300, 400);
    addStats (training, workoutData)
  }).then(() => training = {})
}

function addStats (training, workoutData) {
  let stats = document.getElementById('stats');
  let ul = document.createElement('ul');
  stats.after(ul);

  if (workoutData) {
    for (let message in workoutData.sessionMesgs[0]) {
      let li = document.createElement('li');
      li.innerHTML = message + ': ' + workoutData.sessionMesgs[0][message];
      ul.after(li)
    }
  } else for (let message in training) {
    let li = document.createElement('li');
    li.innerHTML = message + ': ' + training[message];
    ul.after(li)
  }

}


