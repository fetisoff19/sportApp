import {Screen} from "./Screen.js";
import {configPowerCurveAllTime, dict as dist, dict, userLang} from "../config.js";
import {db} from "../db.js";
import Highcharts from '../node_modules/highcharts/es-modules/masters/highcharts.src.js';
import {themeColor, themeLightBG} from "../components/highCharts.js";
import {getHourMinSec} from "../functionsDate.js";
import {openHighcharts} from "./workouts.js";

const page = `
<div id="powerStats">
    <div id="allTimePowerCurve"></div> 
    <div id="powerTopStats"></div> 
</div>
`

export const statsScreen = new Screen({
  name: 'startStatsScreen',
  navName: dist.title.stats[userLang],
  title: dict.title.stats[userLang],
  start: startStatsScreen,
  html: page,
});

async function startStatsScreen(startOptions) {
  console.time('db')
  let workouts = await db.getAll('workouts');
  // console.log(workouts);
  let powerCurveMap = getPointForPowerCurve(workouts);
  addPowerCurveChart (powerCurveMap, configPowerCurveAllTime, startOptions)
  console.timeEnd('db');
}

export function getPointForPowerCurve(allWorkouts){
  let powerCurveMap = new Map();
  allWorkouts.forEach(workout => {
    if ( workout.sport == 'cycling' && workout.powerCurve) {
      workout.powerCurve.forEach((value, key, map) => {
        if (Number.isInteger(key) && Number.isInteger(value.value))
          if (powerCurveMap.has(key)) {
            if (value.value > powerCurveMap.get(key).value) {
              powerCurveMap.set(key, {value: value.value, id: workout.id, timestamp: workout.timestamp,});
            }
          }
          else {
          powerCurveMap.set(key, {value: value.value, id: workout.id, timestamp: workout.timestamp});
        }
      })
    }
  })
  return powerCurveMap;
}

export function addPowerCurveChart (powerCurveMap, config, startOptions) {
  let powerCurveArray = [];
  for (let item of powerCurveMap) {
    if (Number.isInteger(item[0]) && Number.isInteger(item[1].value))
      powerCurveArray.push([item[0], item[1].value])
  }
  // console.log(powerCurveArray)
  let chart = new Highcharts.chart(config.id, {
    chart: {
      height: 600,
      spacingTop: 0,
      type: 'areaspline',
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
      tickWidth: 1,
      // tickPositions: timePeriod,
      // tickPositions: [1, 2, 5, 10, 20, 30, 60, 120, 300, 6000, 1200, 1800, 3600, 7200, 18000,],
      minorTickPosition: 'outside',
      showFirstLabel: true,
      labels: {
        formatter: function () {
          if (this.value < 60) return this.value + dict.units.s[userLang];
          else return getHourMinSec(this.value)
        },
        enabled: true,
        y: 20,
      },
      min: 1,
      max: powerCurveArray[powerCurveArray.length - 1][0],
      crosshair: true,
    }],
    yAxis: [{
      min: 0,
      max: powerCurveArray[0][1],
      showFirstLabel: false,
      title: {
        enabled: false,
      },
      labels: {
        // align: 'left',
        // x: 0,
        // y: 12,
        zIndex: 5,
        style: {
          color: '#383838',
          textShadow: 'white 0 0 10px',
        }
      },
    }],
    series: [{
      data: powerCurveArray,
      name: config.id,
      color: config.colorLine,
      lineWidth: 1,
      marker: { radius: 1 },
      point: {
        events: {
        }
      },
    }],
    plotOptions: {
      areaspline: {
        fillOpacity: 1,
      },
      series: {
        cursor: 'pointer',
        point: {
          events: {
            click: function () {
              let id = powerCurveMap.get(this.x).id;
              openHighcharts(id, startOptions)
            }
          }
        }
      }
    },
    tooltip: {
      event: '',
      enabled: true,
      formatter: function () {
        let date = powerCurveMap.get(this.x).timestamp.toLocaleDateString();
        let x = this.x;
        if (x < 60) return `${x}${dict.units.s[userLang]}
            <br>${this.y} ${dict.units.w[userLang]}<br>${date}`
        else
        {
          x = getHourMinSec(this.x)
          return `${x}<br>${this.y}${dict.units.w[userLang]}<br>${date}`;
        }
      },
      // formatter() {
      //   const {
      //     point
      //   } = this;
      //   return `<span>
      //   <span>Rating = ${point.y}</span>
      //   <button type="button" onclick="showMoreDetails()">More Details</button>
      //  </span>`
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
  chart.xAxis[0].setExtremes(1, 3600);
}

export let timePeriod = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, //+1     10s
  12, 14, 16, 18, 20, 22, 24, 26, 28, 30, //+2     30s
  33, 36, 39, 42, 45, 48 ,51, 54, 57, 60, //+3     1min
  65, 70, 75, 80, 85, 90, 95, 100, 105, 110, 115, 120, //+5     2min
  130, 140, 150, 160, 170, 180, //+10     3min
  200, 220, 240, 260, 280, 300, //+20     5min
  330, 360, 390, 420, 450, 480, 510, 540, 570, 600,  //+30  10min
  660, 720, 780, 840, 900, 960, 1020, 1080, 1140, 1200, //+60  20min
  1320, 1440, 1560, 1680, 1800, 1920, 2040, 2160, 2280, 2400, //+120  40min
  2580, 2760, 2940, 3120, 3300, 3480, 3660, 3840, 4020, 4200, //+180  70min
  4800, 5600, 6200, 6600, 7200, 7800, 8400, 9000, 9600, 10200, 10800, //+600  180min
  11700, 12600, 13500, 14400, 15300, 16200, 17100, 18000, //+900  300min
];

// let timePeriod = [
//   1, 2, 3, 4, 5, 6, 7, 8, 9, 10, //+1     10s
//   13, 16, 19, 22, 25, 28, 31, 34, 37, 40, //+3     40s
//   45, 50, 55, 60, 65, 70, 75, 80, 85, 90, //+5     1.5min
//   100, 110, 120, 130, 140, 150, 160, 170, 180,  //+10     3min
//   210, 240, 270, 300, 330, 360, 390, 420, 450, 480, 510, 540, 570, 600, //+30     10min
//   660, 720, 810, 900, 990, 1080, 1170, 1260, 1350, 1440, 1530, 1620, 1710, 1800, //+90  30min
//   1800, 2100, 2400, 2700, 3000, 3600, 3900, 4200, 4500, 4800, 5100, 5400, 5700, 6000, //+300  100min
//   6600, 7200, 7800, 8400, 9000, 9600, 10200, 10800,  //+600  180min
//   12900, 13800, 14700, 15600, 16500, 17400, 18300, //+900  300min
// ];

// let timePeriod = [1, 2, 5, 10, 20, 30, 60, 120, 300, 6000, 1200, 1800, 3600, 7200, 18000,]