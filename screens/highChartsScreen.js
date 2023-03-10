import { Screen } from './Screen.js';
import {addCharts} from "../components/highCharts.js";
import {db} from "../db.js";
import {dict, userLang} from "../config.js";
import {createMapWithWorkoutRoute} from "../components/maps.js";

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
    <div id="statsLive"></div>
    <div>
        <span id="stats"></span>
    </div>
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
  if (training.isManual) {
    addStats (training);
    return
  };
  let viewTrainingH2 = document.getElementById('viewTrainingH2');
  let mapElem = document.getElementById('map')
  viewTrainingH2.innerText = dict.title.viewTraining[userLang] + ' ' + training.name;

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


