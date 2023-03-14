export let userLang = 'ru'

let fields = {
  timestamp: {
    type: 'object',
    input: 'datetime-local',
  },
  startTime: {
    type: 'object',
    input: 'datetime-local',
    required: true,
  },
  totalElapsedTime: {
    type: 'number',
    input: 'duration',
    required: true,
    units: 's',
  },
  totalTimerTime: {
    type: 'number',
    input: 'duration',
    units: 's',
  },
  totalDistance: {
    type: 'number',
    input: 'number',
    min: 0,
    units: 'm',
  },
  totalStrides: {
    type: 'number',
    input: 'number',
    min: 0,
  },
  totalCalories: {
    type: 'number',
    input: 'number',
    min: 0,
  },
  avgSpeed: {
    type: 'number',
    input: 'number',
    units: 'mps',
    min: 0,
  },
  maxSpeed: {
    type: 'number',
    input: 'number',
    units: 'mps',
    min: 0,
  },
  minAltitude: {
    type: 'number',
    input: 'number',
    units: 'm',
  },
  avgAltitude: {
    type: 'number',
    input: 'number',
    units: 'm',
  },
  maxAltitude: {
    type: 'number',
    input: 'number',
    units: 'm',
  },
  avgGrade: {
    type: 'number',
    input: 'number',
    units: '%',
  },
  maxPosGrade: {
    type: 'number',
    input: 'number',
    units: '%',
  },
  totalAscent: {
    type: 'number',
    input: 'number',
    units: 'm',
  },
  totalDescent: {
    type: 'number',
    input: 'number',
    units: 'm',
  },
  sport: {
    type: 'string',
    input: 'select',
    selectOptions: ['cycling','running'],
  },
  // avgHeartRate: "Средний пульс",
  // minHeartRate: "Мин. пульс",
  // maxHeartRate: "Макс. пульс",
  // avgCadence: "Средний каденс",
  // maxCadence: "Макс. каденс",
  // avgRunningCadence: "Средний каденс",
  // avgPower: "Средняя мощность",
  // name: "Название занятия",
  // dateAdded: "Занятие загружено",
  // note: "Описание",
  // id: "id",
  // dateEdit: "Занятие изменено",
  // manual: "Добавлено вручную?",
  // editDate:'',
};

export const dict = {
  fields: {
    timestamp: {ru: 'Окончание занятия', en: 'Workout end'},
    startTime: {ru: 'Дата', en: 'Date'},
    totalElapsedTime: {ru: 'Продолжительность', en: 'Duration'},
    totalTimerTime: {ru: 'Время в движении', en: 'Moving time'},
    totalDistance: {ru: 'Дистанция', en: 'Distance'},
    totalStrides: {ru: 'Кол-во шагов', en: 'Strides'},
    totalCalories: {ru: 'Калории', en: 'Calories'},
    speed: {ru: 'Скорость', en: 'Speed'},
    avgSpeed: {ru: 'Средняя скорость', en: 'Average speed'},
    maxSpeed: {ru: 'Макс. скорость', en: 'Maximum speed'},
    minAltitude: {ru: 'Мин. высота', en: 'Minimum altitude'},
    altitude: {ru: 'Высота', en: 'Altitude'},
    avgAltitude: {ru: 'Средняя высота', en: 'Average altitude'},
    maxAltitude: {ru: 'Макс. высота', en: 'Maximum altitude'},
    avgGrade: {ru: 'Средний градиент', en: 'Average grade'},
    maxPosGrade: {ru: 'Макс. градиент', en: 'Maximum grade'},
    totalAscent: {ru: 'Набор высоты', en: 'Ascend'},
    totalDescent: {ru: 'Спуск', en: 'Descend'},
    sport: {ru: 'Вид занятия', en: 'Sport'},
    power: {ru: 'Мощность', en: 'Power'},
    avgPower: {ru: 'Средняя мощность', en: 'Average power'},
    hr: {ru: 'Пульс', en: 'Heart rate'},
    avgHR: {ru: 'Средний пульс', en: 'Average HR'},
    cadence: {ru: 'Каденс', en: 'Cadence'},
    avgCadence: {ru: 'Средний каденс', en: 'Average cadence'},
    pace: {ru: 'Темп', en: 'Pace',},
    avgPace: {ru: 'Средний темп', en: 'Average Pace',},
    time: {ru: 'Время', en: 'Time',},

  },
  units: {
    s: {ru: 'Секунды', en: 'Seconds'},
    m: {ru: 'м', en: 'm'},
    km: {ru: 'км', en: 'km'},
    mps: {ru: 'Метры в секунду', en: 'Meters per second'},
    kmph: {ru: 'км/ч', en: 'km/h'},
    bpm: {ru: 'уд./мин', en: 'Beats per minute'},
    w: {ru: 'Вт', en: 'W'},
    cadenceCycl: {ru: 'об./мин.', en: 'rpm'},
    cadenceRun: {ru: 'шаг./мин.', en: 'spm'},
    pace: {ru: '/км', en: '/km'},

  },
  sports: {
    cycling: {ru: 'Велоспорт', en: 'Cycling'},
    running: {ru: 'Бег', en: 'Running'},
  },
  ui: {
    createTraining: {ru: 'Создание тренировки'},
    editTraining: {ru: 'Изменение тренировки'},
    placeholderText: {ru: 'Необходимо заполнить'},
    placeholderTime: {ru: 'чч:мм'},
    placeholderDistance: {ru: 'км'},
    placeholderNote: {ru: 'О тренировке'},
    close: {ru: 'Закрыть'},
    save: {ru: 'Сохранить'},
    edit: {ru: 'Изменить'},
    add: {ru: 'Добавить'},
    view: {ru: 'Показать'},
    delete: {ru: 'Удалить'},
  },
  title: {
    viewTraining: {ru: 'Просмотр тренировки'},
    trainings: {ru: 'Тренировки'},
  }
};

//конфиги графиков
export let configSpeed = {
  id: 'speed',
  title: dict.fields.speed[userLang],
  plotLinesText: dict.fields.avgSpeed[userLang],
  plotLinesTextValue: dict.units.kmph[userLang],
  colorLine: '#11a9ed',
  reversed: false,
}
export let configPace = {
  id: 'pace',
  title: dict.fields.pace[userLang],
  plotLinesText: dict.fields.avgPace[userLang],
  plotLinesTextValue: dict.units.pace[userLang],
  colorLine: '#11a9ed',
  type: 'pace',
  reversed: true,
}
export let configPower = {
  id: 'power',
  title: dict.fields.power[userLang],
  plotLinesText: dict.fields.avgPower[userLang],
  plotLinesTextValue: dict.units.w[userLang],
  colorLine: '#6bc531',
  reversed: false,
}
export let configHeartRate = {
  id: 'hr',
  title: dict.fields.hr[userLang],
  plotLinesText: dict.fields.avgHR[userLang],
  plotLinesTextValue: dict.units.bpm[userLang],
  colorLine: '#ff0035',
  reversed: false,
}
export let configCadenceCycl = {
  id: 'cadenceCycl',
  title: dict.fields.cadence[userLang],
  plotLinesText: dict.fields.avgCadence[userLang],
  plotLinesTextValue: dict.units.cadenceCycl[userLang],
  colorLine: '#c74cb1',
  reversed: false,
}
export let configCadenceRun = {
  id: 'cadenceRun',
  title: dict.fields.cadence[userLang],
  plotLinesText: dict.fields.avgCadence[userLang],
  plotLinesTextValue: dict.units.cadenceRun[userLang],
  colorLine: '#c74cb1',
  reversed: false,
}
export let configAltitude = {
  id: 'altitude',
  title: dict.fields.altitude[userLang],
  plotLinesText: dict.fields.avgAltitude[userLang],
  plotLinesTextValue: dict.units.m[userLang],
  colorLine: '#750bc4',
  reversed: false,
}