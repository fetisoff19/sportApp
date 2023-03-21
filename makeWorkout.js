let filterArrForWorkouts = [
    'timestamp',
    'startTime',
    'totalElapsedTime',
    'totalTimerTime',
    'totalDistance',
    'totalStrides',
    'totalCalories',
    'avgSpeed',
    'avgPower',
    'maxPower',
    'maxSpeed',
    'minAltitude',
    'avgAltitude',
    'maxAltitude',
    'avgGrade',
    'maxPosGrade',
    'totalAscent',
    'totalDescent',
    'sport',
    'avgHeartRate',
    'minHeartRate',
    'maxHeartRate',
    'avgCadence',
    'maxCadence',
    'avgRunningCadence',
    'note',
    'editDate',
];

export function copyKeyInObj(origObj, newObj) {
    newObj.dateAdded = new Date();
    newObj.note = '';

    if ('sessionMesgs' in origObj
        && origObj.sessionMesgs[0]) {
        let targetObj = origObj.sessionMesgs[0];
        for (let key in targetObj) {
            if (filterArrForWorkouts.includes(key))
                newObj[key] = targetObj[key]
        }
        filterValuesWorkout(newObj)
    }
    console.time('1')
    if (newObj.sport == 'cycling') {
        newObj.powerCurve = searchMaxValue(timePeriod, origObj, 'cycling', 'power');
    }
    console.timeEnd('1')
}

function filterValuesWorkout (workout) {
    for (let key in workout) {
        if
        // (typeof workout[key] === 'object') {
        //     workout[key] = workout[key].toLocaleString("en-GB");
        // } else if
        (typeof workout[key] === 'number'
            && workout[key].toString().length > 12) {
            workout[key] = workout[key].toFixed(0);
        }
    }
}

let timePeriod = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, //+1     10s
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

function searchMaxValue(arr, obj, sport, unit) {
    if (obj.sessionMesgs[0].sport === sport && obj.recordMesgs[0][unit]) {
        let data = obj.recordMesgs;
        let timestamp = 1;
        if (data[0].timestamp)
            timestamp = Math.round((data[1].timestamp - data[0].timestamp) / 1000);
        arr.forEach(item => item * timestamp);
        // let periodBetweenStep = 1;
        let result = new Map(); // здесь будем хранить сумму наибольших значений за промежуток времени
        let partialSum = {} // здесь будем хранить сумму значений на данном этапе итерации
        let indexObj = {};
        for (let item of arr) {
            if (Number.isInteger(item) && item > 0)
                if (item > data.length) continue;
            result.set(item, 0);
            partialSum[item] = 0;
            indexObj[item] = '';
        }
        for (let i = 0; i < data.length; i++) {
            if (isNaN(data[i][unit])) continue;
            // if (i > 0)
            // periodBetweenStep = Math.round((data[i].timestamp - data[i - 1].timestamp) / 1000);// обнуляем счётчик partialSum
            for (let item of arr) {
                if (item <= data.length) {
                    // if ((periodBetweenStep - timestamp) / item > 0.2) { // если пауза была больше 20%, то сбрасываем partialSum[item]
                    //     console.log (periodBetweenStep, item, i)
                    //     partialSum[item] = 0;
                    // }
                    let previousValue = 0;
                    if (i < item) {
                        partialSum[item] = partialSum[item] + data[i][unit];
                        if (partialSum[item] > result.get(item)) {
                            result.set(item, partialSum[item]);
                            indexObj[item] = 0;
                        }
                    } else if (i >= item && Number.isInteger(data[i - item][unit])) {
                        previousValue = data[i - item][unit];
                        partialSum[item] = partialSum[item] + data[i][unit] - previousValue;
                        if (partialSum[item] > result.get(item)) {
                            result.set(item, partialSum[item]);
                            indexObj[item] = i - item;
                        }
                    }
                }
            }
        }
        for (let key of result.keys()) {
            result.set(key, {value: Math.round(result.get(key) / key), index: +indexObj[key]});
        }
        return result;
    }
}