import * as L from '../node_modules/leaflet/dist/leaflet-src.esm.js';
import { garminLatLongToNormal } from '../utils.js';
import {
  configAltitude, configCadenceCycl,
  configCadenceRun,
  configHeartRate,
  configPace,
  configPower,
  configSpeed,
  dict,
  userLang
} from "../config.js";
import {convertPace, convertPaceInMinute, convertSpeed, getHourMinSec, getMinSec} from "../functionsDate.js";
import Highcharts from '../node_modules/highcharts/es-modules/masters/highcharts.src.js';

let polylinePoints = [];
let marker = {};
let distanceMax = 0;
let active = false;

let themeColor = getComputedStyle(document.documentElement)
  .getPropertyValue('--app-color');
let themeLightBG = getComputedStyle(document.documentElement)
  .getPropertyValue('--light-grey-bg');

export function addCharts(workoutData, map) {
  if (!workoutData) return;
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

  let speedAvg = 0;
  if (workoutData.sessionMesgs[0].avgSpeed) {
    speedAvg = convertSpeed(workoutData.sessionMesgs[0].avgSpeed);
  }
  let speedDistanceArray = [];
  let speedMin = 200;
  let speedMax = 0;
  let avgSpeedSmoothing = 0;

  let powerAvg = 0;
  if (workoutData.sessionMesgs[0].avgPower) {
    powerAvg = Math.round(workoutData.sessionMesgs[0].avgPower);
  }
  let powerDistanceArray = [];
  let powerMin = 2000;
  let powerMax = 0;
  let avgPowerSmoothing = 0;

  let heartRateAvg = 0;
  if (workoutData.sessionMesgs[0].avgHeartRate) {
    heartRateAvg = Math.round(workoutData.sessionMesgs[0].avgHeartRate);
  }
  let heartRateDistanceArray = [];
  let heartRateMin = 250;
  let heartRateMax = 0;
  let avgHeartRateSmoothing = 0;

  let k = 1;
  if (workoutData.sessionMesgs[0].sport == 'running') {
    k = 2;
  };

  let cadenceAvg = 0;
  if (workoutData.sessionMesgs[0].avgCadence) {
    cadenceAvg = Math.round(workoutData.sessionMesgs[0].avgCadence) * k;
  }
  let cadenceDistanceArray = [];
  let cadenceMin = 500;
  let cadenceMax = 0;
  let avgCadenceSmoothing = 0;

  let altitudeAvg = 0;
  let altitudeDistanceArray = [];
  let altitudeMin = 8000;
  let altitudeMax = 0;
  let avgAltitudeSmoothing = 0;

  let paceAvg = 0;
  if (workoutData.sessionMesgs[0].enhancedAvgSpeed) {
    paceAvg = convertPaceInMinute(workoutData.sessionMesgs[0].enhancedAvgSpeed);
  }
  let paceDistanceArray = [];
  let avgPaceSmoothing = 0;

  for (let i = 0; i < recordMesgs.length; i++) {
    if (isNaN(recordMesgs[i].distance )) continue;
    step++;

    let distance = +(recordMesgs[i].distance / 1000).toFixed(2); // км
    let speed = +(recordMesgs[i].speed * 3.6).toFixed(1); // км/ч
    let pace = 0;
    let power = recordMesgs[i].power; // Вт
    let heartRate = recordMesgs[i].heartRate;
    let cadence = recordMesgs[i].cadence * k;
    let altitude = Math.round(recordMesgs[i].enhancedAltitude); // м

    if (isNaN(speed)) speed = 0;
    if (isNaN(power)) power = 0;
    if (isNaN(heartRate)) heartRate = 0;
    if (isNaN(cadence)) cadence = 0;

    avgSpeedSmoothing += speed;
    speedMin = Math.min(speedMin, speed);
    speedMax = Math.max(speedMax, speed);

    avgPowerSmoothing += power;
    powerMin = Math.min(powerMin, power);
    powerMax = Math.max(powerMax, power);

    avgHeartRateSmoothing += heartRate;
    heartRateMin = Math.min(heartRateMin, heartRate);
    heartRateMax = Math.max(heartRateMax, heartRate);

    if (k === 2 && cadence === 0) cadence = cadenceAvg // при беге каденс не может быть равен 0
    avgCadenceSmoothing += cadence;
    cadenceMin = Math.min(cadenceMin, cadence);
    cadenceMax = Math.max(cadenceMax, cadence);

    if(isNaN(altitude) || altitude > 6000 || altitude < -300) altitude = altitudeAvg/step; // отсеиваем брак в данных
    avgAltitudeSmoothing += altitude;
    altitudeMin = Math.min(altitudeMin, altitude);
    altitudeMax = Math.max(altitudeMax, altitude);
    altitudeAvg += altitude;

    if (recordMesgs[i].enhancedSpeed) {
      pace = convertPaceInMinute(recordMesgs[i].enhancedSpeed)
    } // получаем мин/км
    if (isNaN(pace) || pace > 12 || pace < 1.5) pace = paceAvg; // отсеиваем брак в данных
    avgPaceSmoothing += pace;

    if (i > 0) {
      let stepTime = (recordMesgs[i].timestamp - recordMesgs[i - 1].timestamp) / 1000;  // получаем время в секундах между соседними элементами массива
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
  altitudeAvg = Math.round(altitudeAvg/step);
  distanceMax = +(recordMesgs[recordMesgs.length - 1].distance / 1000).toFixed(2);
  while (Highcharts.charts.length > 0) Highcharts.charts.pop(); //очищаем глобальную переменную Highcharts от старых графиков

// важен порядок запуска функций для правильного формирования порядка Highcharts.charts для ф-ии addAxesLabel
  if (k == 2) addChartByValue(configPace, 2, paceAvg, paceDistanceArray, stepTimeArray);
  else addChartByValue(configSpeed, speedMin, speedAvg, speedDistanceArray, stepTimeArray)
  addChartByValue(configPower, powerMin, powerAvg, powerDistanceArray, stepTimeArray);
  addChartByValue(configHeartRate, heartRateMin, heartRateAvg, heartRateDistanceArray, stepTimeArray);
  if (k == 2) addChartByValue(configCadenceCycl, cadenceMin, cadenceAvg, cadenceDistanceArray, stepTimeArray);
  else addChartByValue(configCadenceRun, cadenceMin, cadenceAvg, cadenceDistanceArray, stepTimeArray);
  addChartByValue(configAltitude, altitudeMin, altitudeAvg, altitudeDistanceArray, stepTimeArray);

  if (polylinePoints.length*smoothing/step > 0.8 && map) marker = L.marker(polylinePoints[0]).addTo(map);
  addStatsLive();
  synchronizeMouseOut();
  addAxesLabel ();
}

function addChartByValue (config, valueMin, valueAvg, data, time) {
  if (valueAvg === 0 || isNaN(valueAvg)) return;
  let avgText = valueAvg;
  { if (config.type) avgText = getMinSec(valueAvg);
    Highcharts.chart(config.id, {
      chart: {
        height: 200,
        spacingTop: 0,
        type: 'areaspline',
        // styledMode: true,
        zoomType: 'x',
        resetZoomButton: {
          position: {
            x: 0,
            y: -40,
          },
          theme: {
            fill: themeLightBG,
            stroke: 'silver',
            states: {
              hover: {
                fill: themeColor,
                style: {
                  color: themeLightBG,
                }
              }
            }
          }
        },
        panning: true,
        panKey: 'shift',
        events: {
          selection : zooming,
        }
      },
      title: {
        text: '&#9900' + ' ' + config.title,
        align: 'left',
        x: - 10,
        y: 30,
        style: {
          color: config.colorLine,
          fontSize: '1rem',
        },
      },
      legend: {
        enabled: false,
      },
      xAxis: [{
        tickWidth: 0,
        labels: {
          enabled: false,
        },
        min: 0,
        max: distanceMax,
      }],
      yAxis: [{
        title: {
          enabled: false,
        },
        min: valueMin,
        labels: {
          align: 'left',
          x: 0,
          y: 12,
          zIndex: 5,
          style: {
            color: '#383838',
            textShadow: 'white 0 0 10px',
          }
        },
        reversed: config.reversed,
        plotLines: [{
          color: '#383838',
          width: 1,
          value: valueAvg,
          dashStyle: 'shortdash',
          label: {
            text: `${config.plotLinesText} ${avgText} ${config.plotLinesTextValue}`,
            align: 'right',
            x: - 5,
            y: 15,
            style:{
              fontWeight: 'bold',
              color: '#383838',
              textShadow: 'white 0 0 10px',
            }
          },
          zIndex: 4
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
        enabled: false,
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

function addAxesLabel (){
  let topChart = Highcharts.charts[0];
  let topChartName = topChart.series[0].name;
  let topChartOptions = {
    opposite: true,
    tickWidth: 0,
    minorTickPosition: 'inside',
    showFirstLabel: false,
    labels: {
      formatter: function () {
        return this.value + dict.units.km[userLang];
      },
      enabled: true,
      y: 25,
    },
    min: 0,
    max: distanceMax,
  }
  let bottomChart = Highcharts.charts[Highcharts.charts.length - 1];
  let bottomChartName = bottomChart.series[0].name;
  let bottomChartOptions = {
    tickWidth: 0,
    showFirstLabel: false,
    labels: {
      formatter: function () {
        return this.value + dict.units.km[userLang];
      },
      enabled: true,
      y: 12,
    },
    min: 0,
    max: distanceMax,
  };
  switch (topChartName) {
    case 'pace':
    case 'speed':
      topChart.xAxis[0].update(topChartOptions);
      break;
    case 'power':
      topChart.xAxis[0].update(topChartOptions);
      break;
    case 'hr':
      topChart.xAxis[0].update(topChartOptions);
      break;
  }
  if (Highcharts.charts.length < 4) return;
    switch (bottomChartName) {
      case 'altitude':
        bottomChart.xAxis[0].update(bottomChartOptions);
        break;
      case 'cadenceCycl':
      case 'cadenceRun':
        bottomChart.xAxis[0].update(bottomChartOptions);
        break;
    }
}

function synchronizeMouseOut() {
  if (active) return;
  let div = document.getElementById('charts-container');
  let width = (+document.querySelector('.highcharts-plot-border').getAttribute('width'))
  let rect = div.getBoundingClientRect();
  div.addEventListener('mousemove', (e) => {
    if (active) return;
    let charts = Highcharts.charts;
    let padding = charts[0].plotLeft; // необходимо вычислить
    let x = (e.clientX - rect.x - padding);
    if (x < 0) x = 0;
    if (x > width) x = width;
    let indexProcessedXData = Math.round(charts[0].series[0].processedXData.length * (x / 732));
    let value = charts[0].series[0].processedXData[indexProcessedXData]
    let indexSeries0 = charts[0].series[0].xData.findIndex(item => item == value)

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
        zIndex: 1,
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
      zIndex: 3,
    }).add()
    // chart.tooltip.refresh([chart.series[0].points[indexSeries0]]);
    fillStatsLive(indexSeries0);
    if (polylinePoints[indexSeries0]) {
      marker.setLatLng(polylinePoints[indexSeries0]);
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
  // let statsLive = document.getElementById('statsLive');
  for (let chart of Highcharts.charts) {
    let name = chart.series[0].name;
    if (name == 'cadenceCycl' || name == 'cadenceRun') name = 'cadence';
    let div = document.getElementById(`${name + 'Live'}`);
    let span = document.createElement('span');
    if (document.querySelector(`.span${name}`)) continue
    div.innerHTML = dict.fields[name][userLang];
    span.classList.add('span' + name);
    span.innerHTML = '--';
    div.append(span);
    div.hidden = false;
  }
  let distanceLive = document.getElementById('distanceLive');
  let timeLive = document.getElementById('timeLive');
  let spanDistance = document.createElement('span');
  let spanTime = document.createElement('span');
  spanDistance.classList.add('spanDistance');
  distanceLive.innerHTML = dict.fields.totalDistance[userLang];
  spanDistance.innerHTML = '--';
  spanTime.classList.add('spanTime');
  timeLive.innerHTML = dict.fields.time[userLang];
  spanTime.innerHTML = '--';
  spanDistance.style.borderColor = 'orange';
  spanDistance.style.color = 'orange';
  spanTime.style.borderColor = 'grey';
  spanTime.style.color = 'grey';
  distanceLive.append(spanDistance);
  timeLive.append(spanTime);
}

function fillStatsLive (indexSeries0) {
  let spanDistance = document.querySelector('.spanDistance');
  let spanTime = document.querySelector('.spanTime');
  if (Highcharts.charts[0].series[0].xData[indexSeries0]) {
    let value = Highcharts.charts[0].series[0].xData[indexSeries0];
    let sec = Highcharts.charts[0].series[1].xData[indexSeries0];
    spanDistance.innerHTML = value;
    spanTime.innerHTML = getHourMinSec(sec);
  }
  for (let chart of Highcharts.charts) {
    let value = chart.series[0].yData[indexSeries0];
    if (value) {
      let name = chart.series[0].name;
      if (name == 'cadenceCycl' || name == 'cadenceRun') name = 'cadence';
      let color = chart.series[0].color;
      let span = document.querySelector(`.span${name}`);
      // span.style.borderColor = color;
      span.style.color = color;
      if (name == 'pace') value = getMinSec(value);
      span.innerHTML = value;
    }
  }
}
