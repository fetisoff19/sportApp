import {Screen} from "./Screen.js";
import {dict as dist, dict, userLang} from "../config.js";
import {db} from "../db.js";

const page = `
<div id="powerStats">
    <div id="powerCurve"></div> 
    <div id="powerTopStats"></div> 
</div>
`

export const statsScreen = new Screen({
  name: 'startStatsScreen',
  // navName: dist.title.stats[userLang],
  title: dict.title.stats[userLang],
  start: startStatsScreen,
  html: page,
});

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

async function startStatsScreen() {
  console.time('db')
  // let workoutsData = await db.getAll('workoutsData');
  let workoutsData1 = await db.get('workoutsData', 346);

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
  console.log(timePeriod.length)
  let result1 = searchMaxValue(timePeriod, workoutsData1, 'cycling',  'power');
  console.log(result1)
  console.timeEnd('db');
}

export function searchMaxValue(arr, obj, sport, unit) {
  if (obj.sessionMesgs[0].sport === sport && obj.recordMesgs[0][unit]) {
    let data = obj.recordMesgs;
    let result = {}; // здесь будем хранить сумму наибольших значений за промежуток времени
    let partialSum = {} // здесь будем хранить сумму значений на данном этапе итерации
    for (let item of arr) {
      if (Number.isInteger(item) && item > 0)
        result[item] = 0;
        partialSum[item] = 0;
    }
    for (let i = 0; i < data.length; i++) {
      if (isNaN(data[i][unit])) continue;
      for (let item of arr) {
        if (item <= data.length) {
          let previousValue = 0;
          if (i < item) {
            partialSum[item] = partialSum[item] + data[i][unit];
            result[item] = Math.max(result[item], partialSum[item]);
          } else if (i >= item && Number.isInteger(data[i - item][unit])) {
            previousValue = data[i - item][unit];
            partialSum[item] = partialSum[item] + data[i][unit] - previousValue;
            result[item] = Math.max(result[item], partialSum[item]);
          }
        }
      }
    } for (let key in result) {
      result[key] = Math.round(result[key] / key); // не забываем разделить временной отрезок
    }
    return result;
  }
  else return {};
}


// function searchMaxValue(arr, obj, sport, unit) {
//   if (obj.sessionMesgs[0].sport === sport && obj.recordMesgs[0][unit]) {
//     let data = obj.recordMesgs;
//     console.log(data.length);
//     // console.log(obj.sessionMesgs[0]['avgPower']);
//     // формируем объект result с ключами из массива arr
//     let result = {};
//     for (let item of arr) {
//       if (Number.isInteger(item) && item > 0)
//       result[item] = 0;
//     }
//     for (let i = 0; i < data.length; i++) {
//       // на каждой шаге итерации data получаем промежуточные значения
//       for (let item of arr) {
//         if (!isNaN(data[i]) || i + item > data.length) continue;
//         let y = 1;
//         if (item >= 300) y = 1;
//         if (item >= 600) y = 2;
//         if (item >= 1200) y = 4;
//         if (item >= 1800) y = 6;
//         if (item >= 3600) y = 8;
//         if (item >= 7200) y = 10;
//         if (item >= 9600) y = 12;
//         let partialSum = 0;
//         for (let j = 0; j < item; j += y) {
//           partialSum += (data[i + j][unit])/y;
//         }
//         // если эти значения больше предыдущих, то обновляем result
//         if (Math.floor(partialSum * y / item) > result[item]) {
//           result[item] = Math.floor(partialSum * y / item)
//         };
//       }
//     } return result;
//   }
//   else return {};
// }
