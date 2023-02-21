export let filterKey = {
    timestamp: "Окончание занятия",
    startTime: "Начало занятия",
    totalElapsedTime: "Общее время тренировки",
    totalTimerTime: "Время в движении",
    totalDistance: "Расстояние",
    totalStrides: "Кол-во шагов",
    totalCalories: "Калории",
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
    minHeartRate: "Мин. пульс",
    maxHeartRate: "Макс. пульс",
    avgCadence: "Средний каденс",
    maxCadence: "Макс. каденс",
    avgRunningCadence: "Средний каденс",
    name: "Название занятия",
    dateAdded: "Занятие загружено",
    note: "Примечание",
    id: "id",
    editDate: "Занятие изменено",
    manual: "Добавлено вручную?",
}

export function makeTable(obj) {
    let tr1 = document.createElement('tr');
    let tr2 = document.createElement('tr');
    tr1.dataset.id = tr2.dataset.id = obj.id;
    let elem = document.getElementById(`${obj.id}`)
    elem.append(tr1, tr2);
    //добавляем ключи в верхнюю строку таблицы
    for (let key in obj) {
        let td = document.createElement('td');
        td.innerHTML = filterKey[key];
        tr1.append(td)
    }
    //добавляем значения ключей в нижнюю строку таблицы
    for (let key in obj) {
        let td = document.createElement('td');
        td.innerHTML = obj[key];
        tr2.append(td)
    }
}




