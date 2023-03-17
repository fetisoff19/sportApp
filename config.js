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
    startTime: {ru: 'Начало занятия', en: 'Date'},
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
    maxPower: {ru: 'Макс. мощность', en: 'Maximum power'},
    normalizedPower:  {ru: 'Нормализованная мощность', en: 'Normalized power',},
    hr: {ru: 'Пульс', en: 'Heart rate'},
    minHeartRate: {ru: 'Мин. пульс', en: 'Minimum HR'},
    avgHeartRate: {ru: 'Средний пульс', en: 'Average HR'},
    maxHeartRate: {ru: 'Макс. пульс', en: 'Maximum HR'},
    cadence: {ru: 'Каденс', en: 'Cadence'},
    avgCadence: {ru: 'Средний каденс', en: 'Average cadence'},
    maxCadence: {ru: 'Макс. каденс', en: 'Average cadence'},
    avgRunningCadence: {ru: 'Средний каденс', en: 'Average cadence'},
    maxRunningCadence: {ru: 'Макс. каденс', en: 'Maximum cadence'},
    pace: {ru: 'Темп', en: 'Pace',},
    avgPace: {ru: 'Средний темп', en: 'Average pace',},
    enhancedMaxSpeed: {ru: 'Макс. темп', en: 'Maximum pace',},
    enhancedAvgSpeed: {ru: 'Средний темп', en: 'Average pace',},
    time: {ru: 'Время', en: 'Time',},
    trainingStressScore: {ru: 'TSS®', en: 'TSS®',},
    leftRightBalance: {ru: 'Баланс', en: 'Balance',},
    maxTemperature: {ru: 'Макс. температура', en: 'Maximum temperature',},
    avgTemperature: {ru: 'Средняя температура', en: 'Average temperature',},
    temperature: {ru: 'Температура', en: 'Temperature',},
    other: {ru: 'Другое', en: 'Other',},
  },
  units: {
    seconds: {ru: 'Секунды', en: 'Seconds'},
    s: {ru: 'с', en: 's'},
    m: {ru: 'м', en: 'm'},
    km: {ru: 'км', en: 'km'},
    mps: {ru: 'Метры в секунду', en: 'Meters per second'},
    kmph: {ru: 'км/ч', en: 'km/h'},
    bpm: {ru: 'уд/мин', en: 'Beats per minute'},
    w: {ru: 'Вт', en: 'W'},
    cadenceCycl: {ru: 'об/мин', en: 'rpm'},
    cadenceRun: {ru: 'шаг/мин', en: 'spm'},
    pace: {ru: '/км', en: '/km'},
    degreeCelsius: {ru: '°C', en: '°C'},
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
    stats: {ru: 'Статистика', en: 'stats'},
    powerCurve: {ru: 'Кривая мощности', en: 'Power curve'},
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
  plotLinesText: dict.fields.avgHeartRate[userLang],
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

export let configPowerCurve = {
  id: 'powerCurve',
  title: dict.title.powerCurve[userLang],
  plotLinesText: '',
  plotLinesTextValue: dict.units.w[userLang],
  colorLine: '#02afaf',
  reversed: false,
}

export let configPowerCurveAllTime = {
  id: 'allTimePowerCurve',
  title: dict.title.powerCurve[userLang],
  plotLinesText: '',
  plotLinesTextValue: dict.units.w[userLang],
  colorLine: '#2fa65a',
  reversed: false,
}

export let fieldsTimeArray = [
  'totalTimerTime',
  'totalElapsedTime',
  'timestamp',
  'startTime',
];

export let fieldsCadenceCyclArray = [
  'maxCadence',
  'avgCadence',
];

export let fieldsCadenceRunArray = [
  'maxRunningCadence',
  'avgRunningCadence',
];

export let fieldsSpeedArray = [
  'maxSpeed',
  'avgSpeed',
];

export let fieldsPaceArray = [
  'enhancedMaxSpeed',
  'enhancedAvgSpeed',
];

export let fieldsHRArray = [
  'maxHeartRate',
  'avgHeartRate',
  'minHeartRate',
];

export let fieldsTemperatureArray = [
  'maxTemperature',
  'avgTemperature',
];

export let fieldsAltitudeArray = [
  'totalAscent',
  'totalDescent',
  'maxAltitude',
  'minAltitude',
];

export let fieldsPowerArray = [
  'maxPower',
  'normalizedPower',
  'avgPower',
];

export let fieldsOtherArray = [
  'totalStrides',
  'trainingStressScore',
  'totalCalories',
  // 'leftRightBalance',
];

let fieldsArray = [
  'startTime',
  'timestamp',
  'totalElapsedTime',
  'totalTimerTime',

  'totalStrides',
  'totalDistance',

  'totalCalories',
  'trainingStressScore',

  'avgSpeed',
  'maxSpeed',

  'avgPower',
  'maxPower',
  'normalizedPower',

  'leftRightBalance',

  'totalAscent',
  'totalDescent',
  'maxAltitude',
  'minAltitude',

  'avgRunningCadence',
  'maxRunningCadence',
  'avgCadence',
  'maxCadence',

  'avgTemperature',
  'maxTemperature',

  'minHeartRate',
  'avgHeartRate',
  'maxHeartRate',

  // 'sport',
  // 'firstLapIndex',
  // 'numLaps',
  // 'trigger',
  // 'subSport',
  // 'avgLeftTorqueEffectiveness',
  // 'avgRightTorqueEffectiveness',
  // 'avgLeftPedalSmoothness',
  // 'avgRightPedalSmoothness',
  // 'enhancedAvgSpeed',
  // 'enhancedMaxSpeed',
  // 'enhancedMaxAltitude',
  // 'enhancedMinAltitude',
  // 'startPositionLat',
  // 'startPositionLong',
  // 'totalWork',
  // 'timeInHrZone',
  // 'timeInPowerZone',
]