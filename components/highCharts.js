import * as L from '../node_modules/leaflet/dist/leaflet-src.esm.js';
import { garminLatLongToNormal, loadCss } from '../utils.js';
import {dict, userLang} from "../config.js";
import {getMinSec} from "../functionsDate.js";
import Highcharts from '../node_modules/highcharts/es-modules/masters/highcharts.src.js';

let polylinePoints = [];
let marker = {};
let distanceMax = 0;

let configSpeed = {
  id: 'speed',
  title: dict.fields.speed[userLang],
  plotLinesText: dict.fields.avgSpeed[userLang],
  plotLinesTextValue: dict.units.kmph[userLang],
  colorLine: 'blue',
  reversed: false,
}
let configPace = {
  id: 'pace',
  title: dict.fields.pace[userLang],
  plotLinesText: dict.fields.avgPace[userLang],
  plotLinesTextValue: dict.units.pace[userLang],
  colorLine: 'blue',
  type: 'pace',
  reversed: true,
}
let configPower = {
  id: 'power',
  title: dict.fields.power[userLang],
  plotLinesText: dict.fields.avgPower[userLang],
  plotLinesTextValue: dict.units.w[userLang],
  colorLine: '#ff6200',
  reversed: false,
}
let configHeartRate = {
  id: 'hr',
  title: dict.fields.hr[userLang],
  plotLinesText: dict.fields.avgHR[userLang],
  plotLinesTextValue: dict.units.bpm[userLang],
  colorLine: 'red',
  reversed: false,
}
let configCadenceCycl = {
  id: 'cadenceCycl',
  title: dict.fields.cadence[userLang],
  plotLinesText: dict.fields.avgCadence[userLang],
  plotLinesTextValue: dict.units.cadenceCycl[userLang],
  colorLine: 'violet',
  reversed: false,
}
let configCadenceRun = {
  id: 'cadenceRun',
  title: dict.fields.cadence[userLang],
  plotLinesText: dict.fields.avgCadence[userLang],
  plotLinesTextValue: dict.units.cadenceRun[userLang],
  colorLine: 'violet',
  reversed: false,
}
let configAltitude = {
  id: 'altitude',
  title: dict.fields.altitude[userLang],
  plotLinesText: dict.fields.avgAltitude[userLang],
  plotLinesTextValue: dict.units.m[userLang],
  colorLine: 'green',
  reversed: false,
}
export function addCharts(training, workoutData, map) {
  if (training.isManual || !workoutData) return;
  let recordMesgs = workoutData.recordMesgs;
  if (isNaN(recordMesgs[recordMesgs.length - 1].heartRate)
    && isNaN(recordMesgs[recordMesgs.length - 1].heartRate)
    && isNaN(recordMesgs[recordMesgs.length - 1].distance)
    && isNaN(recordMesgs[recordMesgs.length - 1].power)
    && isNaN(recordMesgs[recordMesgs.length - 1].enhancedAltitude)) return;

  // сбрасываем значения для переменных
  polylinePoints = [];
  marker = {};
  distanceMax = 0;

  let smoothing = 4;
  let step = 0;
  let avgTimeSmoothing = 0;
  let stepTimeArray = [];

  let speedDistanceArray = [];
  let speedMin = 200;
  let speedMax = 0;
  let speedAvg = 0;
  let avgSpeedSmoothing = 0;

  let powerDistanceArray = []
  let powerMin = 2000;
  let powerMax = 0;
  let powerAvg = 0;
  let avgPowerSmoothing = 0;

  let heartRateDistanceArray = []
  let heartRateMin = 250;
  let heartRateMax = 0;
  let heartRateAvg = 0;
  let avgHeartRateSmoothing = 0;

  let k = 1;
  if (training.sport.toLowerCase() === "бег" || training.sport.toLowerCase() === "run") k = 2;
  let cadenceDistanceArray = []
  let cadenceMin = 500;
  let cadenceMax = 0;
  let cadenceAvg = 0;
  let avgCadenceSmoothing = 0;

  let altitudeDistanceArray = []
  let altitudeMin = 8000;
  let altitudeMax = 0;
  let altitudeAvg = 0;
  let avgAltitudeSmoothing = 0;

  let paceDistanceArray = []
  let paceMin = 100;
  let paceMax = 1;
  let pace = 0;
  let paceAvg = 0;
  let avgPaceSmoothing = 0;

  for (let i = 0; i < recordMesgs.length; i++) {
    if (isNaN(recordMesgs[i].distance )) continue;
    step++;

    let distance = +(recordMesgs[i].distance / 1000).toFixed(2); // км
    let speed = +(recordMesgs[i].speed * 3.6).toFixed(1); // км/ч
    let power = Math.round(recordMesgs[i].power); // Вт
    let heartRate = Math.round(recordMesgs[i].heartRate);
    let cadence = Math.round(recordMesgs[i].cadence) * k;
    let altitude = Math.round(recordMesgs[i].enhancedAltitude); // м

    if (isNaN(speed)) speed = 0;
    if (isNaN(power)) power = 0;
    if (isNaN(heartRate)) heartRate = 0;
    if (isNaN(cadence)) cadence = 0;
    if (isNaN(altitude)) altitude = altitudeAvg/step;

    avgSpeedSmoothing += speed;
    speedMin = Math.min(speedMin, speed);
    speedMax = Math.max(speedMax, speed);
    speedAvg += speed;

    avgPowerSmoothing += power;
    powerMin = Math.min(powerMin, power);
    powerMax = Math.max(powerMax, power);
    powerAvg += power;

    avgHeartRateSmoothing += heartRate;
    heartRateMin = Math.min(heartRateMin, heartRate);
    heartRateMax = Math.max(heartRateMax, heartRate);
    heartRateAvg += heartRate;

    if (k === 2 && cadence === 0) cadence = cadenceAvg/step // при беге каденс не может быть равен 0
    avgCadenceSmoothing += cadence;
    cadenceMin = Math.min(cadenceMin, cadence);
    cadenceMax = Math.max(cadenceMax, cadence);
    cadenceAvg += cadence;

    if(altitude > 6000 || altitude < -300) altitude = altitudeAvg/step; // отсеиваем брак в данных
    avgAltitudeSmoothing += altitude;
    altitudeMin = Math.min(altitudeMin, altitude);
    altitudeMax = Math.max(altitudeMax, altitude);
    altitudeAvg += altitude;
    stepTimeArray.push([Math.round(avgTimeSmoothing), 0]);
    if (i > 0){
      let stepTime = (recordMesgs[i].timestamp - recordMesgs[i - 1].timestamp) / 1000  ;  // получаем время в секундах между соседними элементами массива
      let stepDistance = (recordMesgs[i].distance - recordMesgs[i - 1].distance) / 1000; // получаем расстояние в км между соседними элементами массива
      pace = +(stepTime / (stepDistance * 60)); // получаем мин/км
      if (pace > 12 || pace < 1.5) pace = paceAvg/step; // отсеиваем брак в данных
      paceMin = Math.min(paceMin, pace);
      avgPaceSmoothing += pace;
      paceAvg += pace;
      avgTimeSmoothing += stepTime;
    }

    if (!(i % smoothing) && i > 0) {
      speedDistanceArray.push([distance, +(avgSpeedSmoothing / smoothing).toFixed(1)]);
      powerDistanceArray.push([distance, Math.round(avgPowerSmoothing / smoothing)]);
      heartRateDistanceArray.push([distance, Math.round(avgHeartRateSmoothing / smoothing)])
      cadenceDistanceArray.push([distance, Math.round(avgCadenceSmoothing / smoothing)])
      altitudeDistanceArray.push([distance, Math.round(avgAltitudeSmoothing / smoothing)]);
      paceDistanceArray.push([distance, +(avgPaceSmoothing / smoothing).toFixed(2)]);
      stepTimeArray.push([Math.round(avgTimeSmoothing), 0]);

      // сбрасываем средние значения:
      avgSpeedSmoothing = 0;
      avgPowerSmoothing = 0;
      avgHeartRateSmoothing = 0;
      avgCadenceSmoothing = 0;
      avgAltitudeSmoothing = 0;
      avgPaceSmoothing = 0;

      if (recordMesgs[i].hasOwnProperty('positionLat') && map)
      polylinePoints.push( garminLatLongToNormal([recordMesgs[i].positionLat, recordMesgs[i].positionLong]) );
    }
  }


  if (step < 1) {
    console.log(step)
    return
  };
  heartRateAvg = Math.round(heartRateAvg/step);
  speedAvg = +(speedAvg/step).toFixed(1);
  powerAvg = Math.round(powerAvg/step);
  cadenceAvg = Math.round(cadenceAvg/step);
  altitudeAvg = Math.round(altitudeAvg/step);
  distanceMax = +(recordMesgs[recordMesgs.length - 1].distance / 1000).toFixed(2);
  paceAvg = paceAvg/(step - 1);
  // let timeTraining = +(recordMesgs[recordMesgs.length - 1].timestamp - timestampStart) / 60000;
  // paceAvg = +(timeTraining / distanceMax).toFixed(2);
  paceMax = paceAvg * 1.3;
  // console.log(paceAvg, paceMin, paceMax, timeTraining, distanceMax);
  // console.log(configAltitude, altitudeMin, altitudeMax, altitudeAvg, altitudeDistanceArray)
  while (Highcharts.charts.length>0) Highcharts.charts.pop(); //очищаем глобальную переменную Highcharts от старых графиков
  // console.log(Highcharts.charts)
  addChartByValue(configPower, powerMin, powerMax, powerAvg, powerDistanceArray);
  addChartByValue(configHeartRate, heartRateMin, heartRateMax, heartRateAvg, heartRateDistanceArray);
  addChartByValue(configAltitude, altitudeMin, altitudeMax, altitudeAvg, altitudeDistanceArray);
  if (training.sport.toLowerCase() === "бег" || training.sport.toLowerCase() === "running") {
    addChartByValue(configPace, paceMin, paceMax, paceAvg, paceDistanceArray);
    addChartByValue(configCadenceRun, cadenceMin, cadenceMax, cadenceAvg, cadenceDistanceArray);
  }
  else {
    addChartByValue(configSpeed, speedMin, speedMax, speedAvg, speedDistanceArray);
    addChartByValue(configCadenceCycl, cadenceMin, cadenceMax, cadenceAvg, cadenceDistanceArray);
  }
  addStatsLive();
  if (polylinePoints.length*smoothing/step > 0.8 && map) marker = L.marker(polylinePoints[0]).addTo(map);
  console.log(stepTimeArray, speedDistanceArray)
}

function addChartByValue (config, valueMin, valueMax, valueAvg, data) {
  if (valueAvg === 0) return;
  let avgText = '';
  { if (config.type) avgText = getMinSec(valueAvg);
  else avgText = valueAvg.toString().replace('.', ',')

  new Highcharts.chart(config.id, {
    chart: {
      type: 'line',
      zoomType: 'x',
      panning: true,
      panKey: 'shift',
      events: {
        selection : zooming,
      }
    },
    title: {
      text: config.title,
      },
      legend: {
        enabled: false
      },
    xAxis: [{
      labels: {
        formatter: function () {
          return this.value + dict.units.km[userLang];
        },
      },
      min: 0,
      max: distanceMax,
      crosshair: true,
    }],
    rangeSelector: {
      enabled: true
    },
    yAxis: [{
      // scrollbar: {
      //   enabled: true,
      //   showFull: false
      // },
      title: {
        text: '',
      },
      min: valueMin,
      reversed: config.reversed,
      // max: valueMax,
      plotLines: [{ // mark the weekend
        color: '#383838',
        width: 1,
        value: valueAvg,
        dashStyle: 'shortdash',
        label: {
          text: `${config.plotLinesText}<br/>${avgText} ${config.plotLinesTextValue}`, // `${filterKey.avgHeartRate}` + ': ' + `${otherWord.hrm}`, // Content of the label.
          align: 'right', // Positioning of the label.
          x: - 20,
          y: 20,
          style:{
            fontWeight: 'bold',
            color: '#383838',
          }
        },
        zIndex: 5
      }],
    }],
    series: [{
      data: data,
      name: config.id,
      color: config.colorLine,
      lineWidth: 1,
      marker: { radius: 1 },
      point: {
        events: {
          mouseOver: function() {
            synchronize(this);
          },
        }
      },
    }],
    plotOptions: {
      areaspline: {
        fillOpacity: 1,
      },
    },
    tooltip: {
        formatter:
          function() {
            if(config.type) this.y = getMinSec(this.y);
            return `${this.y.toString().replace('.', ',')} ${config.plotLinesTextValue}<br/>${this.x.toString().replace('.', ',')} ${dict.units.km[userLang]}`;
          },
        // outside: true,
        // positioner: function () {
        //   return {y: this.y};
        // },
        // distance: 500,
        // tooltip: {
        //   snap: 5000
        // },
        backgroundColor: {
          linearGradient: [0, 0, 0, 60],
          stops: [
            [0, '#FFFFFF'],
            [1, '#E0E0E0']
          ]
        },
        borderWidth: 1,
        borderColor: '#AAA'
      },
  });
  }
    // console.timeEnd(config.id);
}

function synchronize(point) {
  for (let chart of Highcharts.charts) {
    let index = chart.series[0].processedXData.findIndex(item => item == point.options.x);
    if (chart.customCrosshair) {
      chart.customCrosshair.element.remove();
    }
    chart.customCrosshair = chart.renderer.rect(point.plotX + chart.plotLeft - 1,chart.plotTop, 0.5, chart.plotSizeY).attr({
      fill: '#383838',
      zIndex: 5,
    }).add()
    chart.tooltip.refresh([chart.series[0].points[index]]);
    fillStatsLive(index);

    if (polylinePoints[index]) {
      marker.setLatLng(polylinePoints[index]);
    }
  }
}

function zooming () {
  Highcharts.charts.forEach(chart => {
    chart.xAxis[0].update({
      events: {
        afterSetExtremes: function (event) {
          Highcharts.charts.forEach(otherChart => {
            if (otherChart.xAxis[0].min != event.min || otherChart.xAxis[0].max != event.max) {
              otherChart.xAxis[0].setExtremes(event.min, event.max)
            }
          })
        }
      }
    })
  });
}

function addStatsLive () {
  let statsLive = document.getElementById('statsLive');
  for (let chart of Highcharts.charts) {
    let name = chart.series[0].name;
    let div = document.createElement('div');
    let span = document.createElement('span');
    if (document.querySelector(`.span${name}`)) continue
    span.classList.add('span' + name);
    div.classList.add('div' + name, 'divStatsLive');
    div.innerHTML = name + ': ';
    span.innerHTML = '--';
    statsLive.append(div);
    div.append(span);
  }
  let div = document.createElement('div');
  let span = document.createElement('span');
  span.classList.add('spanDistance');
  div.classList.add('divDistance', 'divStatsLive');
  div.innerHTML = 'Distance: ';
  span.innerHTML = '--';
  statsLive.append(div);
  div.append(span);
}


function fillStatsLive (index) {
  let spanDistance = document.querySelector('.spanDistance');
  let x = Highcharts.charts[0].series[0].points[index].x;
  spanDistance.innerHTML = x;

  for (let chart of Highcharts.charts) {
    let name = chart.series[0].name;
    let span = document.querySelector(`.span${name}`);
    span.innerHTML = chart.series[0].points[index].y;
  }
}

