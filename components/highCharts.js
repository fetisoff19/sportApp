import {db} from "../db.js";
import {filterKey, otherWord} from "../language.js";
import Highcharts from 'highcharts';
import Exporting from 'highcharts/modules/exporting';
Exporting(Highcharts);

let distanceMax = 0;

let configSpeed = {
  title: otherWord.speed,
  plotLinesText: filterKey.avgSpeed,
  plotLinesTextValue: otherWord.kmph,
  colorLine: 'blue',
}
let configPower = {
  title: otherWord.power,
  plotLinesText: filterKey.avgPower,
  plotLinesTextValue: otherWord.w,
  colorLine: '#ff6200',
}
let configHeartRate = {
  title: otherWord.hr,
  plotLinesText: filterKey.avgHeartRate,
  plotLinesTextValue: otherWord.bpm,
  colorLine: 'red',
}
let configCadence = {
  title: otherWord.cadence,
  plotLinesText: filterKey.avgCadence,
  plotLinesTextValue: otherWord.rpm,
  colorLine: 'violet',
}
let configAltitude = {
  title: otherWord.altitude,
  plotLinesText: filterKey.avgAltitude,
  plotLinesTextValue: otherWord.m,
  colorLine: 'green',
}

export function addCharts(id) {
  let speedDistanceArray = [];
  let speedMin = 200;
  let speedMax = 0;
  let speedAvg = 0;

  let powerDistanceArray = []
  let powerMin = 2000;
  let powerMax = 0;
  let powerAvg = 0;

  // let timestampArray = [];

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

  db.get('workoutsData', +id).then(r => {
    let recordMesgs = r.recordMesgs;
    for (let message of recordMesgs) {
      if (isNaN(message.heartRate) && isNaN(message.speed) && isNaN(message.distance) && isNaN(message.power) && isNaN(message.altitude)) return;
      if (isNaN(message.distance)) continue;
     step++;

      {if (isNaN(message.speed)) message.speed = 0
        speedDistanceArray.push(
          [(+(message.distance / 1000).toFixed(2)), +(message.speed * 3.6).toFixed(1)])
        speedMin = Math.min(speedMin, message.speed * 3.6);
        speedMax = Math.max(speedMax, message.speed * 3.6);
        speedAvg += (message.speed * 3.6);
      }

      {if (isNaN(message.power)) message.power = 0
        powerDistanceArray.push(
          [(+(message.distance / 1000).toFixed(2)), message.power])
        powerMin = Math.min(powerMin, message.power);
        powerMax = Math.max(powerMax, message.power);
        if (message.power === 0) {
          message.power = powerAvg/step
        } else powerAvg += message.power;
      }

      {
        if (isNaN(message.heartRate)) message.heartRate = 0;
        heartRateDistanceArray.push(
          [(+(message.distance / 1000).toFixed(2)), message.heartRate])
        heartRateMin = Math.min(heartRateMin, message.heartRate);
        heartRateMax = Math.max(heartRateMax, message.heartRate);
        if (message.heartRate === 0) {
          message.heartRate = heartRateAvg/step
        } else heartRateAvg += message.heartRate;
      }

      { if (isNaN(message.cadence)) message.cadence = 0
        cadenceDistanceArray.push(
          [(+(message.distance / 1000).toFixed(2)), message.cadence])
        cadenceMin = Math.min(cadenceMin, message.cadence);
        cadenceMax = Math.max(cadenceMax, message.cadence);
        if (message.cadence === 0) {
          message.cadence = cadenceAvg/step
        } else cadenceAvg += message.cadence;
      }

      { if (isNaN(message.altitude)) message.altitude = 0
        if(message.altitude > 6000) {message.altitude = altitudeAvg/step}; // времянка
        altitudeDistanceArray.push(
          [(+(message.distance / 1000).toFixed(2)), message.altitude])
        altitudeMin = Math.min(altitudeMin, message.altitude);
        altitudeMax = Math.max(altitudeMax, message.altitude);
        altitudeAvg += message.altitude;
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
    distanceMax = +(r.recordMesgs[r.recordMesgs.length - 1].distance / 1000).toFixed(2);
  }).then(() => {
      addChartByValue('speed', configSpeed, speedMin, speedMax, speedAvg, speedDistanceArray);
      addChartByValue('power', configPower, powerMin, powerMax, powerAvg, powerDistanceArray);
      addChartByValue('hr',  configHeartRate, heartRateMin, heartRateMax, heartRateAvg, heartRateDistanceArray);
      addChartByValue('cadence', configCadence, cadenceMin, cadenceMax, cadenceAvg, cadenceDistanceArray);
      addChartByValue('altitude', configAltitude, altitudeMin, altitudeMax, altitudeAvg, altitudeDistanceArray);
      // console.log(heartRateMin, heartRateMax, heartRateAvg, heartRateDistanceArray)
  })
}

function addChartByValue (id, config, valueMin, valueMax, valueAvg, data) {
  if (valueAvg === 0) return;
  // console.log(valueMin, valueMax, valueAvg, data)
  {
    Highcharts.chart(id, {
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
            return this.value + otherWord.placeholderDistance;
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
            text: `${config.plotLinesText}<br/>${valueAvg.toString().replace('.', ',')} ${config.plotLinesTextValue}`,
            // `${filterKey.avgHeartRate}` + ': ' + `${otherWord.hrm}`, // Content of the label.
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
        formatter: function() {
          return `${this.y} ${config.plotLinesTextValue}<br/>${this.x.toString().replace('.', ',')} ${otherWord.km}`;
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




