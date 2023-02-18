let filterKey = {
    timestamp: "Начало занятия",
    startTime: "Окончание занятия",
    totalElapsedTime: "Общее время тренировки",
    totalTimerTime: "Время в движении",
    totalDistance: "Расстояние",
    totalStrides: "Шаги",
    totalCalories: "Калорий",
    avgSpeed: "Средняя скорость",
    maxSpeed: "Макс. скорость",
    minAltitude: "Мин. высота",
    avgAltitude: "Средняя высота",
    maxAltitude: "Макс. высота",
    avgGrade: "Средний градиент",
    maxPosGrade: "Макс. градиент",
    totalAscent: "Набор",
    totalDescent: "Спуск",
    sport: "Вид занятия",
    avgHeartRate: "Средний пульс",
    minHeartRate: "Минимальный пульс",
    maxHeartRate: "Макс. пульс",
    avgCadence: "Средний каденс",
    maxCadence: "Макс. каденс",
    avgRunningCadence: "Средний каденс",
}

export function filterValuesForView (workout) {
    let object={};
    let filterArrKey = [];
    let filterArrValue = [];
// проверяем наличие массива sessionMesgs и отсеиваем лишние ключи
    if ('sessionMesgs' in workout)
        for (let key in workout.sessionMesgs[0]) {
            if (key in filterKey) {
                filterArrKey.push(filterKey[key]);
                filterArrValue.push(workout.sessionMesgs[0][key])
            } else console.log('Отсутствуют ключи типа keyInSession')
        }
    else console.log('Отсутствует sessionMesgs в workouts')
    // округляем числа и корректируем дату для отображения
    for (let i = 0; i < filterArrKey.length; i++) {
        if (!isNaN(parseFloat(filterArrValue[i]))
            && isFinite(filterArrValue[i])
            && String(filterArrValue[i]).length > 12) {
            object[filterArrKey[i]] = filterArrValue[i].toFixed(0);
        } else if ((typeof filterArrValue[i]) == 'object') {
            object[filterArrKey[i]] = filterArrValue[i].toLocaleString("en-GB");
        } else
            object[filterArrKey[i]] = filterArrValue[i];
    }
    object.id = workout.id
    makeTable(object);
}

function makeTable(obj) {
    let tr1 = document.createElement('tr');
    let tr2 = document.createElement('tr');
    tr1.dataset.id = tr2.dataset.id = obj.id;
    document.getElementById(`${obj.id}`).append(tr1, tr2);
    //добавляем ключи в верхнюю строку таблицы
    for (let key in obj) {
        let td = document.createElement('td');
        td.innerHTML = key
        tr1.append(td)
    }
    //добавляем значения ключей в нижнюю строку таблицы
    for (let key in obj) {
        let td = document.createElement('td');
        td.innerHTML = obj[key];
        tr2.append(td)
    }
}