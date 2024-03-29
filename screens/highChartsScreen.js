import { Screen } from './Screen.js';
import {addCharts, themeColor, themeLightBG} from "../components/highCharts.js";
import {db} from "../db.js";
import {
  dict, fieldsAltitudeArray, fieldsCadenceCyclArray, fieldsCadenceRunArray,
  fieldsHRArray, fieldsOtherArray, fieldsPaceArray, fieldsPowerArray,
  fieldsSpeedArray, fieldsTemperatureArray, fieldsTimeArray, userLang
} from "../config.js";
import {createMapWithWorkoutRoute} from "../components/maps.js";
import {convertPace, convertSpeed, doubleValue, getHourMinSec, getMinSec} from "../functionsDate.js";
import {BlockStatsComponent} from "../components/formComponent.js";

const page = `
<span id="leftRightButtons">
    <span class="chartsButtons"></span>
</span>
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
    <p id="paraAnalytics"></p>
    <div id="analytics"></div>
  </div>
</div>
<div id="powerCurve" class="charts" ></div>
`

export const highChartsScreen = new Screen({
  name: 'highChartsScreen',
  title: dict.title.viewTraining[userLang],
  start: startHighChartsScreen,
  html: page,
});

async function startHighChartsScreen(options) {
  let workoutId = options.urlParams.workoutId;
  let workout = await db.get('workouts', +workoutId);
  let para = document.getElementById('paraNameTraining');
  para.innerText = workout.name;
  addSportStartTime (workout);

  if (workout.isManual) {
    addMainInfoAboutTraining(workout);
    return;
  };

  let mapElem = document.getElementById('map')
  db.get('workoutsData', +workout.id).then(workoutData => {
    let map = createMapWithWorkoutRoute(workoutData, mapElem, 300, );
    let buttonHideMap = document.createElement('button');
    buttonHideMap.innerHTML = `${dict.title.anchorMap[userLang]}`;
    buttonHideMap.classList.add('chartsButton', 'button');
    buttonHideMap.addEventListener('click', hideShowElem)
    document.querySelector('.chartsButtons').prepend(buttonHideMap);
    let status = true;
    function hideShowElem(){
      buttonHideMap.innerHTML = `${dict.title.anchorMap[userLang]}`;
      status = !status;
      mapElem.style.position = 'sticky';
      buttonHideMap.style.backgroundColor = themeLightBG;
      buttonHideMap.style.color = themeColor;
      if (status) {
        mapElem.style.position = 'static';
        buttonHideMap.style.backgroundColor = themeColor;
        buttonHideMap.style.color = 'white';
      }
    }
    addCharts(workoutData, workout, map);
    if (workoutData.sessionMesgs[0])
    addMainInfoAboutTraining(workoutData.sessionMesgs[0]);
    addStats (workoutData.sessionMesgs[0]);
    addAnalytics (workoutData.sessionMesgs[0], analyticsItem, 365)
  });
}

function addSportStartTime (training) {
  let sportStartTime = document.getElementById('sportStartTime');
  let address = '';
  let sport = '';
  if (dict.sports[training.sport]) sport = dict.sports[training.sport][userLang];
  else sport = training.sport
  sportStartTime.innerHTML = sport + ', '
    + training.startTime.toLocaleString() + ' ' + address;
}

function addMainInfoAboutTraining(training) {
  let mainInfo = document.getElementById('mainInfo');
  // distance
  if (training.totalDistance) {
    let totalDistanceDiv = document.createElement('div');
    let totalDistanceSpan = document.createElement('span');
    totalDistanceDiv.innerHTML = (training.totalDistance / 1000).toFixed(2) + ' ' + dict.units.km[userLang];
    totalDistanceSpan.innerHTML = dict.fields.totalDistance[userLang];
    mainInfo.append(totalDistanceDiv);
    totalDistanceDiv.append(totalDistanceSpan);
  }
  // time
  if (training.totalTimerTime) {
    let totalTimeDiv = document.createElement('div');
    let totalTimeSpan = document.createElement('span');
    totalTimeDiv.innerHTML = getHourMinSec(training.totalTimerTime);
    totalTimeSpan.innerHTML = dict.fields.totalElapsedTime[userLang];
    mainInfo.append(totalTimeDiv);
    totalTimeDiv.append(totalTimeSpan);
  }
  // speed || pace
  let avgSpeed = 0;
  let avgPace = 0;
  if (training.avgSpeed) avgSpeed = convertSpeed(training.avgSpeed);
  if (training.enhancedAvgSpeed) avgPace = convertPace(training.enhancedAvgSpeed);
  if (training.isManual) {
    avgSpeed = convertSpeed(training.totalDistance / training.totalTimerTime);
    avgPace = convertPace(training.totalDistance / training.totalTimerTime);
  };
  {
    let avgSpeedDiv = document.createElement('div');
    let acgSpeedSpan = document.createElement('span');
    if (training.sport === 'running') {
      avgSpeedDiv.innerHTML = avgPace + ' ' + dict.units.pace[userLang];
      acgSpeedSpan.innerHTML = dict.fields.avgPace[userLang];
    } else {
      avgSpeedDiv.innerHTML = avgSpeed + ' ' + dict.units.kmph[userLang];
      acgSpeedSpan.innerHTML = dict.fields.avgSpeed[userLang];
    }
    mainInfo.append(avgSpeedDiv);
    avgSpeedDiv.append(acgSpeedSpan);
  }
  // totalAscent
  if (training.totalAscent) {
    let totalAscentDiv = document.createElement('div');
    let totalAscentSpan = document.createElement('span');
    totalAscentDiv.innerHTML =  Math.round(training.totalAscent) + ' ' + dict.units.m[userLang];
    totalAscentSpan.innerHTML = dict.fields.totalAscent[userLang];
    mainInfo.append(totalAscentDiv);
    totalAscentDiv.append(totalAscentSpan);
  }
  // avgPower
  if (training.avgPower) {
    let avgPowerDiv = document.createElement('div');
    let avgPowerSpan = document.createElement('span');
    avgPowerDiv.innerHTML = Math.round(training.avgPower) + ' ' + dict.units.w[userLang];
    avgPowerSpan.innerHTML = dict.fields.avgPower[userLang];
    mainInfo.append(avgPowerDiv);
    avgPowerDiv.append(avgPowerSpan);
  }
}

function addStats (obj) {
  let stats = document.getElementById('stats');
  let para = document.getElementById('paraStats')
  para.innerHTML = dict.title.stats[userLang];

  let blockHR = new BlockStatsComponent(obj, 'hr', fieldsHRArray, 'bpm', Math.round);
  let blockCadenceRun = new BlockStatsComponent(obj, 'cadence', fieldsCadenceRunArray, 'cadenceRun', doubleValue);
  let blockCadenceCycl = new BlockStatsComponent(obj, 'cadence', fieldsCadenceCyclArray, 'cadenceCycl', Math.round);
  let blockPower = new BlockStatsComponent(obj, 'power', fieldsPowerArray, 'w', Math.round);
  let blockSpeed = new BlockStatsComponent(obj, 'speed', fieldsSpeedArray, 'kmph', convertSpeed);
  let blockPace = new BlockStatsComponent(obj, 'pace', fieldsPaceArray, 'pace', convertPace);
  let blockAltitude = new BlockStatsComponent(obj, 'altitude', fieldsAltitudeArray, 'm', Math.round);
  let blockTemperature = new BlockStatsComponent(obj, 'temperature', fieldsTemperatureArray, 'degreeCelsius', Math.round);
  let blockOther = new BlockStatsComponent(obj, 'other', fieldsOtherArray, '');
  let blockTime = new BlockStatsComponent(obj,'time', fieldsTimeArray, '', getHourMinSec);
  stats.append(blockHR.statBlock, blockCadenceCycl.statBlock, blockCadenceRun.statBlock, blockPower.statBlock, blockSpeed.statBlock, blockPace.statBlock, blockAltitude.statBlock,
    blockTemperature.statBlock, blockTime.statBlock, blockOther.statBlock);
  blockHR.removeEmptyOrConflictElem();
  blockCadenceCycl.removeEmptyOrConflictElem('running');
  blockCadenceRun.removeEmptyOrConflictElem('cycling');
  blockPower.removeEmptyOrConflictElem();
  blockSpeed.removeEmptyOrConflictElem('running');
  blockPace.removeEmptyOrConflictElem('cycling');
  blockAltitude.removeEmptyOrConflictElem();
  blockTemperature.removeEmptyOrConflictElem();
  blockOther.removeEmptyOrConflictElem();
  blockTime.removeEmptyOrConflictElem();
};

let analyticsItem = ['totalTimerTime', 'totalDistance',
  'avgHeartRate', 'avgCadence', 'avgPower', 'avgSpeed', 'totalAscent', 'maxPower', 'maxHeartRate']
async function addAnalytics (obj, arr, days) {
  if (obj.sport === 'running') return
  let analytics = document.getElementById('analytics');
  let para = document.getElementById('paraAnalytics')
  para.innerHTML = `${dict.title.analytics[userLang]} ${days} ${dict.units.days[userLang]}`;
  let resultWorkout = {};
  for (let item of arr) {
    if (obj[item])
    resultWorkout[item] = obj[item];
  }
  let statsAllTime = await addAllStats(obj.sport, arr, days);
  for (let key in resultWorkout) {
    resultWorkout[key] = resultWorkout[key]/statsAllTime[key]
  }
  for (let key in resultWorkout) {
    if (resultWorkout[key] >= 1.05) {
      let span = document.createElement('span')
      span.innerHTML = `${dict.fields[key][userLang]} ${dict.title.phraseValueBetter[userLang]} 
      ${Math.round((resultWorkout[key] - 1) * 100)}% <br/>`
      analytics.append(span)
    }
  }
};

// статистика по sport по ключам из arr и за последние days
async function addAllStats (sport, arr, days) {
  let result = {};
  let workouts = await db.getAll('workouts');
  let periodOfTime = new Date() - days * 24 * 3600 * 1000;
  workouts = workouts.sort((a, b) => b.timestamp - a.timestamp);
  let index = workouts.findIndex(item => item.timestamp < periodOfTime);
  for (let item of arr) {
    let i = 1;
    result[item] = 0;
    for (let j = 0; j < index; j++) {
      if (!workouts[j].sport === sport || !workouts[j][item]) continue;
      result[item] = ((result[item] * (i - 1)) + workouts[j][item]) / i;
      i++;
    }
  }
  return result;
}