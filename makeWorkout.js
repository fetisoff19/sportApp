let filterArrForWorkouts = [
    'timestamp',
    'startTime',
    'totalElapsedTime',
    'totalTimerTime',
    'totalDistance',
    'totalStrides',
    'totalCalories',
    'avgSpeed',
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
]

export function copyKeyInObj(origObj, newObj) {
    origObj.id = newObj.id;
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
}

function filterValuesWorkout (workout) {
    for (let key in workout) {
        if (typeof workout[key] === 'object') {
            workout[key] = workout[key].toLocaleString("en-GB");
        } else if
        (typeof workout[key] === 'number'
            && workout[key].toString().length > 12) {
            workout[key] = workout[key].toFixed(0);
        }
    }
}