import * as L from '../node_modules/leaflet/dist/leaflet-src.esm.js';
import { garminLatLongToNormal } from '../utils.js';
import {dict, userLang} from "../config.js";
import {getMinSec} from "../functionsDate.js";
import Highcharts from '../node_modules/highcharts/es-modules/masters/highcharts.src.js';

let polylinePoints = [];
let marker = {};
let distanceMax = 0;
let active = false;
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
  let distanceArray = [];
  let stepTimeArray = [];

  let speedDistanceArray = [];
  let speedMin = 200;
  let speedMax = 0;
  let speedAvg = 0;
  let avgSpeedSmoothing = 0;

  let powerDistanceArray = [];
  let powerMin = 2000;
  let powerMax = 0;
  let powerAvg = 0;
  let avgPowerSmoothing = 0;

  let heartRateDistanceArray = [];
  let heartRateMin = 250;
  let heartRateMax = 0;
  let heartRateAvg = 0;
  let avgHeartRateSmoothing = 0;

  let k = 1;
  if (training.sport.toLowerCase() === "бег" || training.sport.toLowerCase() === "run") k = 2;
  let cadenceDistanceArray = [];
  let cadenceMin = 500;
  let cadenceMax = 0;
  let cadenceAvg = 0;
  let avgCadenceSmoothing = 0;

  let altitudeDistanceArray = [];
  let altitudeMin = 8000;
  let altitudeMax = 0;
  let altitudeAvg = 0;
  let avgAltitudeSmoothing = 0;

  let paceDistanceArray = [];
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
    let power = recordMesgs[i].power; // Вт
    let heartRate = recordMesgs[i].heartRate;
    let cadence = recordMesgs[i].cadence * k;
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

    if (i == smoothing) {
      speedDistanceArray.push([0, +(avgSpeedSmoothing / smoothing).toFixed(1)]);
      powerDistanceArray.push([0, Math.round(avgPowerSmoothing / smoothing)]);
      heartRateDistanceArray.push([0, Math.round(avgHeartRateSmoothing / smoothing)])
      cadenceDistanceArray.push([0, Math.round(avgCadenceSmoothing / smoothing)])
      altitudeDistanceArray.push([0, Math.round(avgAltitudeSmoothing / smoothing)]);
      paceDistanceArray.push([0, +(avgPaceSmoothing / smoothing).toFixed(2)]);
      stepTimeArray.push([0, 0]);
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

  addChartByValue(configPower, powerMin, powerMax, powerAvg, powerDistanceArray, stepTimeArray);
  addChartByValue(configHeartRate, heartRateMin, heartRateMax, heartRateAvg, heartRateDistanceArray, stepTimeArray);
  addChartByValue(configAltitude, altitudeMin, altitudeMax, altitudeAvg, altitudeDistanceArray, stepTimeArray);
  if (training.sport.toLowerCase() === "бег" || training.sport.toLowerCase() === "running") {
    addChartByValue(configPace, paceMin, paceMax, paceAvg, paceDistanceArray, stepTimeArray);
    addChartByValue(configCadenceRun, cadenceMin, cadenceMax, cadenceAvg, cadenceDistanceArray, stepTimeArray);
  }
  else {
    addChartByValue(configSpeed, speedMin, speedMax, speedAvg, speedDistanceArray, stepTimeArray);
    addChartByValue(configCadenceCycl, cadenceMin, cadenceMax, cadenceAvg, cadenceDistanceArray, stepTimeArray);
  }
  addStatsLive();
  if (polylinePoints.length*smoothing/step > 0.8 && map) marker = L.marker(polylinePoints[0]).addTo(map);
}

function addChartByValue (config, valueMin, valueMax, valueAvg, data, time) {
  if (valueAvg === 0) return;
  let avgText = '';
  { if (config.type) avgText = getMinSec(valueAvg);
  else avgText = valueAvg.toString().replace('.', ',')

    Highcharts.chart(config.id, {
      chart: {
        height: 200,
        spacingTop: 0,
        type: 'areaspline',
        // styledMode: true,
        zoomType: 'x',
        panning: true,
        panKey: 'shift',
        events: {
          selection : zooming,
        }
      },
      title: {
        text: config.title,
        align: 'left',
        x: 0,
        y: 25,
        style: {
          color: config.colorLine,
          fontWeight: 'bold',
        },
      },
      legend: {
        enabled: false,
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
        title: {
          text: '',
        },
        labels: {
          align: 'left',
          x: 0,
          y: -2,
        },
        reversed: config.reversed,
        plotLines: [{
          color: '#383838',
          width: 1,
          value: valueAvg,
          dashStyle: 'shortdash',
          label: {
            text: `${config.plotLinesText} ${avgText} ${config.plotLinesTextValue}`, // `${filterKey.avgHeartRate}` + ': ' + `${otherWord.hrm}`, // Content of the label.
            align: 'right',
            x: - 15,
            y: 15,
            style:{
              fontWeight: 'bold',
              color: '#383838',
              textShadow: 'white 0 0 10px',
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
              synchronizeMouseOver(this);
            },
            mouseOut: function () {
              active = false;
              synchronizeMouseOut()
            }
          }
        },
      }, {
        visible: false,
        data: time,
      }],
      plotOptions: {
        areaspline: {
          fillOpacity: 1,
        },
      },
      tooltip: {
        // enabled: false,
        formatter:
          function() {
            if(config.type) this.y = getMinSec(this.y);
            return `${this.y.toString().replace('.', ',')} ${config.plotLinesTextValue}<br/>${this.x.toString().replace('.', ',')} ${dict.units.km[userLang]}`;
          },
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
}


function synchronizeMouseOut() {
  let div = document.getElementById('charts-container');
  let width = (+document.querySelector('.highcharts-plot-border').getAttribute('width'))
  let mouse = document.querySelector('.mouse');
  let rect = div.getBoundingClientRect();
  div.addEventListener('mousemove', (e) => {
    if (active) return;
    let charts = Highcharts.charts;
    let padding = charts[0].plotLeft; // необходимо вычислить
    let x = (e.clientX - rect.x - padding);
    if (x < 0) x = 0;
    if (x > width) x = width;
    let chartsLength = charts[0].series[0].xAxis.series[0].points.length;
    let indexProcessedXData = Math.round(charts[0].series[0].processedXData.length * (x / 732));
    let value = charts[0].series[0].processedXData[indexProcessedXData]

    let indexSeries0 = charts[0].series[0].xData.findIndex(item => item == value)
    mouse.innerHTML = `
    x: ${x} </br> 
    index: ${indexSeries0} </br> 
    value: ${value} </br>
    chartsLength: ${chartsLength} </br>
  `;
    fillStatsLive(indexSeries0);
    if (polylinePoints[indexSeries0]) {
      marker.setLatLng(polylinePoints[indexSeries0]);
    }
    for (let chart of charts) {
      if (chart.customCrosshair) {
        chart.customCrosshair.element.remove();
      }
      chart.customCrosshair = chart.renderer.rect(+x + chart.plotLeft - 1, chart.plotTop, 0.5, chart.plotSizeY).attr({
        fill: '#383838',
        zIndex: 5,
      }).add()
      // chart.tooltip.refresh([chart.series[0].points[index]]);
    }
  })
}

function synchronizeMouseOver(point) {
  active = true;
  for (let chart of Highcharts.charts) {
    let indexSeries0 = chart.series[0].xData.findIndex(item => item === point.category);
    if (chart.customCrosshair) {
      chart.customCrosshair.element.remove();
    }
    chart.customCrosshair = chart.renderer.rect(point.plotX + chart.plotLeft - 1,chart.plotTop, 0.5, chart.plotSizeY).attr({
      fill: '#383838',
      zIndex: 5,
    }).add()
    // chart.tooltip.refresh([chart.series[0].points[indexSeries0]]);
    fillStatsLive(indexSeries0);
    if (polylinePoints[indexSeries0]) {
      marker.setLatLng(polylinePoints[indexSeries0]);
    }
    let pointSpan = document.querySelector('.spanPoint');
    pointSpan.innerHTML = point.plotX;
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
  let divDistance = document.createElement('div');
  let divTime = document.createElement('div');
  let spanDistance = document.createElement('span');
  let spanTime = document.createElement('span');

  let pointSpan = document.createElement('span');
  let activeSpan = document.createElement('span');
  let mouse = document.createElement('span');
  let pointDiv = document.createElement('div');
  mouse.classList.add('mouse');
  pointDiv.classList.add('divPoint');
  pointSpan.classList.add('spanPoint');
  activeSpan.classList.add('active');
  pointDiv.innerHTML = 'PointX: ';
  pointSpan.innerHTML = '--';
  activeSpan.innerHTML = active;


  divDistance.classList.add('divDistance', 'divStatsLive');
  spanDistance.classList.add('spanDistance');
  divDistance.innerHTML = 'Distance: ';
  spanDistance.innerHTML = '--';

  divTime.classList.add('divTime', 'divStatsLive');
  spanTime.classList.add('spanTime');
  divTime.innerHTML = 'Time: ';
  spanTime.innerHTML = '--';

  statsLive.append(divDistance);
  divDistance.append(spanDistance);
  statsLive.append(divTime);
  divTime.append(spanTime);

  statsLive.append(pointDiv);
  pointDiv.append(pointSpan);
  pointDiv.after(activeSpan);
  pointDiv.after(mouse);
}

function fillStatsLive (indexSeries0) {
  let spanActive = document.querySelector('.active');
  spanActive.innerHTML = active
  let spanDistance = document.querySelector('.spanDistance');
  let spanTime = document.querySelector('.spanTime');
  if (Highcharts.charts[0].series[0].xData[indexSeries0]) {
    let value = Highcharts.charts[0].series[0].xData[indexSeries0];
    let sec = Highcharts.charts[0].series[1].xData[indexSeries0];
    spanDistance.innerHTML = value;
    spanTime.innerHTML = sec;
  }
  // console.log(Highcharts.charts[0].series[1].xData, Highcharts.charts[0].series[0].points)
  for (let chart of Highcharts.charts) {
    if (chart.series[0].yData[indexSeries0]) {
      let name = chart.series[0].name;
      let span = document.querySelector(`.span${name}`);
      span.innerHTML = chart.series[0].yData[indexSeries0];
    }
  }
}





