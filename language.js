export let filterKey = {};
export let otherWord = {};
export let sportType = {};

let filterKeyRu = {
  timestamp: "Окончание занятия",
  startTime: "Дата",
  totalElapsedTime: "Продолжительность",
  totalTimerTime: "Время в движении",
  totalDistance: "Дистанция",
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
  avgPower: "Средняя мощность",
  name: "Название занятия",
  dateAdded: "Занятие загружено",
  note: "Описание",
  id: "id",
  dateEdit: "Занятие изменено",
  manual: "Добавлено вручную?",
}

let otherWordRu = {
  createTraining: 'Создание тренировки',
  editTraining: 'Изменение тренировки',
  placeholderText: 'Необходимо заполнить',
  placeholderTime: 'чч:мм',
  placeholderDistance: 'км',
  placeholderNote: 'О тренировке',
  close: 'Закрыть',
  save: 'Сохранить',
  edit: 'Изменить',
  add: 'Добавить',
  view: 'Показать',
  delete: 'Удалить',
  log: 'Log',
  bpm: 'уд./мин',
  hr: 'Пульс',
  speed: 'Скорость',
  kmph: 'км/ч',
  cadence: 'Каденс',
  rpm: 'об/мин',
  km: 'км',
  power: 'Мощность',
  altitude: 'Высота',
  w: 'Вт',
  m: 'м',
}

let sportTypeRu = {
  cycling: 'Велоспорт',
  running: 'Бег'
}

function setLanguage(lang) {
  if (lang.toLowerCase() === 'ru') {
    filterKey = filterKeyRu;
    otherWord = otherWordRu;
    sportType = sportTypeRu;
  }
}

setLanguage('ru') // запускаем здесь, иначе у графиков не будет подписей
