import Chart from '../node_modules/highcharts/es-modules/Core/Chart/Chart.js';
import LineSeries from '../node_modules/highcharts/es-modules/Series/Line/LineSeries.js';
import {db} from "../db.js";
import {otherWord} from "../language.js";

export function addChartHeartRate(id) {
  let distanceHeartRateArray = [];
  let minHeartRate = 250;
  let maxHeartRate = 0;
  let avgHeartRate = 0;
  db.get('workoutsData', +id).then(r => {
    let recordMesgs = r.recordMesgs;
    for (let message of recordMesgs) {
      distanceHeartRateArray.push([
        +(message.distance/1000).toFixed(2),
        message.heartRate,
      ]);
      minHeartRate = Math.min(minHeartRate, message.heartRate);
      maxHeartRate = Math.max(maxHeartRate, message.heartRate);
      avgHeartRate += message.heartRate;
    }
    avgHeartRate = Math.round(avgHeartRate/recordMesgs.length);
  }).then(() => {
    let chart = new Chart('container', {
      title: {
        text: otherWord.hr,
      },
      legend: {
        enabled: false
      },
      xAxis: {
        labels: {
          formatter: function () {
            return this.value + 'km';
          }
        },
        min: 0,
        crosshair: true,
      },
      yAxis: {
        title: {
          text: '',
        },
        min: minHeartRate,
        max: maxHeartRate,
        // plotLines: [{
        //   color: 'grey',
        //   dashStyle: 'longdashdot',
        //   value: 1avgHeartRate,
        //   width: 2
        // }]
      },
      series: [{
        data: distanceHeartRateArray,
        color: '#ff0000',
        lineWidth: 1,
      },{
        data: avgHeartRate,
        color: '#ff0000',
        lineWidth: 1,
      }],
      tooltip: {
        formatter: function() {
          return `${this.y} ${otherWord.hrm}<br/>${this.x.toString().replace('.', ',')} ${otherWord.km}`;
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
    })
  })
}
