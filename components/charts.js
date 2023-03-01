import {Chart} from './node_modules/highcharts/es-modules/Core/Chart/Chart.js';
// import LineSeries from '/node_modules/highcharts/es-modules/Series/Line/LineSeries.js';
import {db} from "../db.js";

export function addChart(id) {
  let distanceHeartRateArray = [];
  db.get('workoutsData', +id).then(r => {
    let recordMesgs = r.recordMesgs;
    for (let message of recordMesgs) {
      distanceHeartRateArray.push([
        +(message.distance / 1000).toFixed(1),
        message.heartRate
      ])
    }

  }).then(() => {
    console.log(distanceHeartRateArray);
    const myChart = new Chart('container', {
      title: {
        text: 'My chart'
      },
      xAxis: {
        title: {
          text: 'distance, km'
        }
      },
      yAxis: {
        title: {
          text: 'hrm'
        }
      },
      series: [{
        data: distanceHeartRateArray,
        // pointInterval: 3600
      }]
    })
  })
}