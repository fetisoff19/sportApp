import { parseFit } from './utils.js';
import {db, addWorkout, deleteWorkout, changeWorkout} from './db.js';

fillWorkoutsTable();
setIndexedDbUsageInfo();

async function fillWorkoutsTable() {
  let workouts = await db.getAll('workouts');
  workouts.forEach(rec=>addRowToWorkoutsTable(rec));
}

function addRowToWorkoutsTable(rec) {
  let tr = document.createElement('tr');
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
      setIndexedDbUsageInfo();
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

function setIndexedDbUsageInfo() {
  navigator.storage.estimate().then(result=>{
    document.querySelector('#indexedDbUsage').innerHTML = 'indexedDb: '+(result.usageDetails.indexedDB/(10**6)).toFixed(2)+'MB';
  });
}

async function saveJsonFileFromFit(file) {
  const workoutDataObj = await parseFit(file);
  const workoutDataJSON = JSON.stringify(workoutDataObj);
  const filename = file.name.replace('.fit','');

  const fileHandle = await window.showSaveFilePicker({
    suggestedName: `${filename}.json`,
    types: [{
      accept: {'text/javascript': ['.json']},
    }],
  });
  const fileStream = await fileHandle.createWritable();
  await fileStream.write(new Blob([workoutDataJSON], {type: "text/javascript"}));
  await fileStream.close();
}

//создание тренировки(-ок) из файла
document.querySelector('#create-workout-fit-inp').addEventListener('change', async (event) => {
  for (let file of event.target.files) {

    const filename = file.name.replace('.fit','');
    const newWorkoutData = await parseFit(file);
    //добавляем параметры из newWorkoutData
    let timeCreated = '-';
    if (newWorkoutData.fileIdMesgs[0].timeCreated && 'fileIdMesgs' in newWorkoutData)
          timeCreated = newWorkoutData.fileIdMesgs[0].timeCreated;

    let type = '-';
    if ('deviceSettingsMesgs' in newWorkoutData
        && newWorkoutData.deviceSettingsMesgs[0].autoActivityDetect)
          type = newWorkoutData.deviceSettingsMesgs[0].autoActivityDetect;

      //создаем объект тренировки
    const newWorkout = {name: filename, type: type, timeCreated: timeCreated, dateAdded: new Date()};
    const newRecId = await addWorkout(newWorkout, newWorkoutData);

    db.get('workouts', newRecId).then(rec=>{
      addRowToWorkoutsTable(rec);
      setIndexedDbUsageInfo();
    });
  }
});


document.querySelector('#fit-to-json-file-inp').addEventListener('change', (e)=>saveJsonFileFromFit(e.target.files[0]));

changeBtn.addEventListener('click', () =>
  changeWorkout(78, 'type', 'cycling'));
