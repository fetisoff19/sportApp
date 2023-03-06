import {db} from "../db.js";
import {filterKey, otherWord} from "../language.js";
import Highcharts from 'highcharts';
import Exporting from 'highcharts/modules/exporting';
import {dict, userLang} from "../config";
import {training} from "../screens/highChartsScreen";
import {getMinSec} from "../functionsDate";
Exporting(Highcharts);

let distanceMax = 0;
let timestampStart = {};

let configSpeed = {
  id: 'speed',
  title: dict.fields.speed[userLang],
  plotLinesText: dict.fields.avgSpeed[userLang],
  plotLinesTextValue: dict.units.kmph[userLang],
  colorLine: 'blue',
}

let configPace = {
  id: 'pace',
  title: dict.fields.pace[userLang],
  plotLinesText: dict.fields.avgPace[userLang],
  plotLinesTextValue: dict.units.pace[userLang],
  colorLine: 'blue',
  type: 'pace',
}
let configPower = {
  id: 'power',
  title: dict.fields.power[userLang],
  plotLinesText: dict.fields.avgPower[userLang],
  plotLinesTextValue: dict.units.w[userLang],
  colorLine: '#ff6200',
}
let configHeartRate = {
  id: 'hr',
  title: dict.fields.hr[userLang],
  plotLinesText: dict.fields.avgHR[userLang],
  plotLinesTextValue: dict.units.bpm[userLang],
  colorLine: 'red',
}
let configCadenceCycl = {
  id: 'cadenceCycl',
  title: dict.fields.cadence[userLang],
  plotLinesText: dict.fields.avgCadence[userLang],
  plotLinesTextValue: dict.units.cadenceCycl[userLang],
  colorLine: 'violet',
}

let configCadenceRun = {
  id: 'cadenceRun',
  title: dict.fields.cadence[userLang],
  plotLinesText: dict.fields.avgCadence[userLang],
  plotLinesTextValue: dict.units.cadenceRun[userLang],
  colorLine: 'violet',
}
let configAltitude = {
  id: 'altitude',
  title: dict.fields.altitude[userLang],
  plotLinesText: dict.fields.avgAltitude[userLang],
  plotLinesTextValue: dict.units.m[userLang],
  colorLine: 'green',
}


export function addCharts(training, workoutData) {
  if (training.isManual || !workoutData) return;

  let speedDistanceArray = [];
  let speedMin = 200;
  let speedMax = 0;
  let speedAvg = 0;

  let powerDistanceArray = []
  let powerMin = 2000;
  let powerMax = 0;
  let powerAvg = 0;

  let heartRateDistanceArray = []
  let heartRateMin = 250;
  let heartRateMax = 0;
  let heartRateAvg = 0;

  let cadenceDistanceArray = []
  let cadenceMin = 500;
  let cadenceMax = 0;
  let cadenceAvg = 0;

  let altitudeDistanceArray = []
  let altitudeMin = 8000;
  let altitudeMax = 0;
  let altitudeAvg = 0;

  let step = 0;

  let paceDistanceArray = []
  let paceMin = 100;
  let paceMax = 1;
  let pace = 0;
  let paceAvg = 0;

  let recordMesgs = workoutData.recordMesgs;
  if (isNaN(recordMesgs[recordMesgs.length - 1].heartRate)
    && isNaN(recordMesgs[recordMesgs.length - 1].heartRate)
    && isNaN(recordMesgs[recordMesgs.length - 1].distance)
    && isNaN(recordMesgs[recordMesgs.length - 1].power)
    && isNaN(recordMesgs[recordMesgs.length - 1].enhancedAltitude)) return;

  for (let message of recordMesgs) {
    if (isNaN(message.distance)) continue;
   step++;
   let distance = +(message.distance / 1000).toFixed(2);
    {if (isNaN(message.speed)) message.speed = 0
      speedDistanceArray.push(
        [distance, +(message.speed * 3.6).toFixed(1)])
      speedMin = Math.min(speedMin, message.speed * 3.6);
      speedMax = Math.max(speedMax, message.speed * 3.6);
      speedAvg += (message.speed * 3.6);
    }

    if (step === 1) timestampStart = message.timestamp;
    if (step > 1){
      let stepTime = message.timestamp - recordMesgs[step - 2].timestamp;
      let stepDistance = (message.distance - recordMesgs[step - 2].distance) / 1000;
      // if (stepDistance === 0) pace = paceAvg/step;
      pace = +(stepTime / (stepDistance * 60 * 1000)).toFixed(2); // получаем км/мин
      paceDistanceArray.push([distance, pace]);
      paceMin = Math.min(paceMin, pace);
      // paceMax = Math.max(paceMax, pace);
      // paceAvg += Math.round(pace);
      // console.log(paceAvg);
    }

    {if (isNaN(message.power)) message.power = 0
      powerDistanceArray.push(
        [distance, message.power])
      powerMin = Math.min(powerMin, message.power);
      powerMax = Math.max(powerMax, message.power);
      if (message.power === 0) {
        message.power = powerAvg/step
      } else powerAvg += message.power;
    }

    {
      if (isNaN(message.heartRate)) message.heartRate = 0;
      heartRateDistanceArray.push(
        [distance, message.heartRate])
      heartRateMin = Math.min(heartRateMin, message.heartRate);
      heartRateMax = Math.max(heartRateMax, message.heartRate);
      if (message.heartRate === 0) {
        message.heartRate = heartRateAvg/step
      } else heartRateAvg += message.heartRate;
    }

    { if (isNaN(message.cadence)) message.cadence = 0
      let k = 1;
      if (training.sport.toLowerCase() === "бег" || training.sport.toLowerCase() === "run") k = 2;
      cadenceDistanceArray.push(
        [distance, message.cadence * k])
      cadenceMin = Math.min(cadenceMin, message.cadence * k);
      cadenceMax = Math.max(cadenceMax, message.cadence * k);
      if (message.cadence === 0) {
        message.cadence = cadenceAvg/step
      } else cadenceAvg += message.cadence * k;
    }

    { if (isNaN(message.enhancedAltitude)) message.enhancedAltitude = 0
      if(message.enhancedAltitude > 6000) {message.enhancedAltitude = altitudeAvg/step}; // времянка
      altitudeDistanceArray.push(
        [distance, Math.round(message.enhancedAltitude)])
      altitudeMin = Math.min(altitudeMin, message.enhancedAltitude);
      altitudeMax = Math.max(altitudeMax, message.enhancedAltitude);
      altitudeAvg += message.enhancedAltitude;
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
  let timeTraining = +(recordMesgs[recordMesgs.length - 1].timestamp - timestampStart) / 60000;
  paceAvg = +(timeTraining / distanceMax).toFixed(2);
  paceMax = paceAvg * 1.3;
  // console.log(paceAvg, paceMin, paceMax, timeTraining, distanceMax);
  // console.log(configAltitude, altitudeMin, altitudeMax, altitudeAvg, altitudeDistanceArray)

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
}

function addChartByValue (config, valueMin, valueMax, valueAvg, data) {
  if (valueAvg === 0) return;
  let avgText = '';
  // console.log(valueMin, valueMax, valueAvg, data)
  { if (config.type) avgText = getMinSec(valueAvg);
    else avgText = valueAvg.toString().replace('.', ',')
    Highcharts.chart(config.id, {
      chart: {
        type: 'areaspline'
      },
      title: {
        text: config.title,
      },
      legend: {
        enabled: false
      },
      xAxis: {
        labels: {
          formatter: function () {
            return this.value + dict.units.km[userLang];
          }
        },
        min: 0,
        max: distanceMax,
        crosshair: true,
      },
      yAxis: {
        title: {
          text: '',
        },
        min: valueMin,
        max: valueMax,
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
      },
      series: [{
        data: data,
        color: config.colorLine,
        lineWidth: 1,
        marker: { radius: 1 },
      }],
      plotOptions: {
        areaspline: {
          fillOpacity: 1,
        },
        // series: [{
        //   // specific options for this series instance
        //   type: 'areaspline'
        // }],
      },
      tooltip: {
        formatter:
          function() {
          if(config.type) this.y = getMinSec(this.y);
          return `${this.y.toString().replace('.', ',')} ${config.plotLinesTextValue}<br/>${this.x.toString().replace('.', ',')} ${dict.units.km[userLang]}`;
        },
        outside: true,
        // positioner: function () {
        //   return {x: - 100, y: 100};
        // },
        // distance: 50,
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
    })
  }
}




