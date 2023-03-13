import { Screen } from './Screen.js';
import {addCharts} from "../components/highCharts.js";
import {db} from "../db.js";
import {dict, userLang} from "../config.js";
import {createMapWithWorkoutRoute} from "../components/maps.js";

const page = `
<div id="viewBox">
  <div id="charts-container">
    <div id="statsLive">
      <div id="speedLive" class="statsLive" hidden></div>
      <div id="paceLive" class="statsLive" hidden></div>
      <div id="powerLive" class="statsLive" hidden></div>
      <div id="hrLive" class="statsLive" hidden></div>
      <div id="cadenceLive" class="statsLive" hidden></div>
      <div id="altitudeLive" class="statsLive" hidden></div>
      <div id="distanceLive" class="statsLive" ></div>
      <div id="timeLive" class="statsLive" ></div>
    </div>
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
    <div id="startPositionTime"></div>
    <p id="viewTrainingH2"></p>
    <div id="mainInfo"></div>
    <span id="stats"></span>
  </div>
</div>
`

export const highChartsScreen = new Screen({
  name: 'highChartsScreen',
  title: dict.title.viewTraining[userLang],
  start: startHighChartsScreen,
  html: page,
});

async function startHighChartsScreen(options) {
  let workoutId = options.urlParams.workoutId;
  let training = await db.get('workouts', +workoutId);
  addBarStartPositionTime (training);
  if (training.isManual) {
    addStats (training);
    return;
  };
  let viewTrainingH2 = document.getElementById('viewTrainingH2');
  let mapElem = document.getElementById('map')
  viewTrainingH2.innerText = training.name;

  db.get('workoutsData', +training.id).then(workoutData => {
    let map = createMapWithWorkoutRoute(workoutData, mapElem, 300, 400);
    addCharts(training, workoutData, map);
    addStats (training, workoutData);
  });
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

function addBarStartPositionTime (training) {
  let startPositionTime = document.getElementById('startPositionTime');
  let address = '';
  // if (polylinePoints[0]) address = polylinePoints[0]; // чуть позже сделать
  startPositionTime.innerHTML = training.sport + ', '
    + training.startTime.toLocaleString() + ' ' + address;
}


