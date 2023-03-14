import { Screen } from './Screen.js';
import {addCharts} from "../components/highCharts.js";
import {db} from "../db.js";
import {
  dict,
  fieldsAltitudeArray, fieldsCadenceCyclArray, fieldsCadenceRunArray,
  fieldsHRArray, fieldsOtherArray, fieldsPaceArray,
  fieldsPowerArray,
  fieldsSpeedArray, fieldsTemperatureArray, fieldsTimeArray,
  userLang
} from "../config.js";
import {createMapWithWorkoutRoute} from "../components/maps.js";
import {convertPace, convertSpeed, doubleValue, getHourMinSec} from "../functionsDate.js";
import {BlockStatsComponent} from "../components/formComponent.js";

const page = `
<div id="viewTrainingPage">
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
    <div id="sportStartTime"></div>
    <p id="paraNameTraining"></p>
    <div id="mainInfo"></div>
    <p id="paraStats"></p>
    <div id="stats"></div>
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
  addSportStartTime (training);
  if (training.isManual) {
    addStats (training);
    return;
  };

  let para = document.getElementById('paraNameTraining');
  let mapElem = document.getElementById('map')
  para.innerText = training.name;

  db.get('workoutsData', +training.id).then(workoutData => {
    let map = createMapWithWorkoutRoute(workoutData, mapElem, 300, );
    addCharts(training, workoutData, map);
    if (workoutData.sessionMesgs[0])
    addStats (workoutData.sessionMesgs[0]);
  });
}

function addSportStartTime (training) {
  let sportStartTime = document.getElementById('sportStartTime');
  let address = '';
  // if (polylinePoints[0]) address = polylinePoints[0]; // чуть позже сделать
  sportStartTime.innerHTML = training.sport + ', '
    + training.startTime.toLocaleString() + ' ' + address;
}

function addStats (obj) {
  let stats = document.getElementById('stats');
  let para = document.getElementById('paraStats')
  para.innerHTML = dict.title.stats[userLang];
  // stats.after(ul);

  let blockHR = new BlockStatsComponent(obj, 'hr', fieldsHRArray, 'bpm', Math.round);
  let blockCadenceRun = new BlockStatsComponent(obj, 'cadence', fieldsCadenceRunArray, 'cadenceRun', doubleValue);
  let blockCadenceCycl = new BlockStatsComponent(obj, 'cadence', fieldsCadenceCyclArray, 'cadenceCycl', Math.round);
  let blockPower = new BlockStatsComponent(obj, 'power', fieldsPowerArray, 'w', Math.round);
  let blockSpeed = new BlockStatsComponent(obj, 'speed', fieldsSpeedArray, 'kmph', convertSpeed);
  let blockPace = new BlockStatsComponent(obj, 'pace', fieldsPaceArray, 'pace', convertPace);
  let blockAltitude = new BlockStatsComponent(obj, 'altitude', fieldsAltitudeArray, 'm', Math.round);
  let blockTemperature = new BlockStatsComponent(obj, 'temperature', fieldsTemperatureArray, 'degreeCelsius', Math.round);
  let blockOther = new BlockStatsComponent(obj, 'other', fieldsOtherArray, '');
  let blockTime = new BlockStatsComponent(obj,'time', fieldsTimeArray, '', getHourMinSec)
  stats.append(blockHR.statBlock, blockCadenceCycl.statBlock, blockCadenceRun.statBlock, blockPower.statBlock, blockSpeed.statBlock, blockPace.statBlock, blockAltitude.statBlock,
    blockTemperature.statBlock, blockTime.statBlock, blockOther.statBlock);
  blockHR.removeEmptyElem();
  blockCadenceCycl.removeEmptyElem();
  blockCadenceRun.removeEmptyElem();
  blockPower.removeEmptyElem();
  blockSpeed.removeEmptyElem();
  blockPace.removeEmptyElem()
  blockAltitude.removeEmptyElem();
  blockTemperature.removeEmptyElem();
  blockOther.removeEmptyElem();
  blockTime.removeEmptyElem();
};




