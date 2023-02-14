import { Decoder, Stream, Profile, Utils } from './modules/garmin-fit/index.js';
import {db, addWorkout, deleteWorkout, changeWorkout} from './db.js';

fillWorkoutsTable()

async function fillWorkoutsTable() {
  let workouts = await db.getAll('workouts');
  workouts.forEach(rec=>addRowToWorkoutsTable(rec));
}

function addRowToWorkoutsTable(rec) {
  //функция получилась слишком большая, но это для пробы
  let tr = document.createElement('tr');
  //у tr в dataset записываем id для delBtn
  tr.dataset.id = rec.id;
  let tdId = document.createElement('td');
  let tdName = document.createElement('td');
  let tdType = document.createElement('td');
  let tdTimeCreated = document.createElement('td');
  let tdDateAdded = document.createElement('td');
  let tdLog = document.createElement('td');
  let logBtn = document.createElement('input');
  logBtn.type = 'button';
  logBtn.value = 'log';
  logBtn.addEventListener('click', (e)=> {
    //находим id
    let id = parseInt(e.target.parentElement.parentElement.dataset.id);
    //в idb у db есть методы для быстрых одиночных операций (не нужно создавать транзакцию вручную) https://github.com/jakearchibald/idb#shortcuts-to-getset-from-an-object-store
    db.get('workoutsData', id).then(result=>console.log(result));
  });
  tdLog.appendChild(logBtn);
  let tdDel = document.createElement('td');
  let delBtn = document.createElement('input');
  delBtn.type = 'button';
  delBtn.value = 'del';
  delBtn.addEventListener('click', (e)=> {
    let id = parseInt(e.target.parentElement.parentElement.dataset.id);
    deleteWorkout(id).then(()=>{
        document.querySelector(`tr[data-id="${id}"]`).remove();
      });
  });
  tdDel.appendChild(delBtn);

  tdId.innerHTML = rec.id;
  tdName.innerHTML = rec.name;
  tdType.innerHTML = rec.type;
  tdTimeCreated.innerHTML = rec.timeCreated;
  tdDateAdded.innerHTML = rec.dateAdded;

  document.querySelector('#workoutsTable').append(tr);
  tr.append(tdId);
  tr.append(tdName);
  tr.append(tdType);
  tr.append(tdTimeCreated);
  tr.append(tdDateAdded);
  tr.append(tdLog);
  tr.append(tdDel);
}

//создание тренировки(-ок) из файла
document.querySelector('#create-workout-fit-inp').addEventListener('change', async (event) => {
  for (let file of event.target.files) {
    const filename = file.name.replace('.fit','');
    const newWorkoutData = await parseFit(file);
    //добавляем параметры из newWorkoutData
    let timeCreated = '-'

    if (newWorkoutData.fileIdMesgs[0].timeCreated && 'fileIdMesgs' in newWorkoutData)
          timeCreated = newWorkoutData.fileIdMesgs[0].timeCreated;

    let type = '-';
    if ('deviceSettingsMesgs' in newWorkoutData
        && newWorkoutData.deviceSettingsMesgs[0].autoActivityDetect)
          type = newWorkoutData.deviceSettingsMesgs[0].autoActivityDetect;

      //создаем объект тренировки
    const newWorkout = {name: filename, type: type, timeCreated: timeCreated, dateAdded: new Date()};
    const newRecId = await addWorkout(newWorkout, newWorkoutData);
    db.get('workouts', newRecId)
        .then(rec=>addRowToWorkoutsTable(rec));
  }
});


document.querySelector('#fit-to-json-file-inp').addEventListener('change', async (event) => {
  const file = event.target.files[0];
  const workoutDataObj = await parseFit(file);
  const workoutDataJSON = JSON.stringify(workoutDataObj);
  const filename = file.name.replace('.fit','');
  saveJsonFile(workoutDataJSON, filename);
});

async function saveJsonFile(json, name) {
  const fileHandle = await window.showSaveFilePicker({
    suggestedName: `${name}.json`,
    types: [{
      accept: {'text/javascript': ['.json']},
    }],
  });
  const fileStream = await fileHandle.createWritable();
  await fileStream.write(new Blob([json], {type: "text/javascript"}));
  await fileStream.close();
}

async function parseFit(fitFile) {
  //console.time('response in');

  let fitBlob = await fitFile.arrayBuffer();
  
  const stream = Stream.fromByteArray(fitBlob);
  //console.log("isFIT (static method): " + Decoder.isFIT(stream));
  
  const decoder = new Decoder(stream);
  //console.log("isFIT (instance method): " + decoder.isFIT());
  //console.log("checkIntegrity: " + decoder.checkIntegrity());
  
  const { messages, errors } = decoder.read();
  
  if (errors.length>0) console.log(errors);
  //console.log(messages);

  //console.timeEnd('response in');
  return messages;
}

changeBtn.addEventListener('click', () =>
  changeWorkout(78, 'type', 'cycling'));
