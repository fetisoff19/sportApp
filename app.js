import { parseFit } from './utils.js';
import {db, addWorkout, deleteWorkout, setIndexedDbUsageInfo} from './db.js';


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
      setTimeout(() => {
       setIndexedDbUsageInfo();       // в будущем доработать бзе таймаута
      },100)
    });
  });
  tdDel.appendChild(delBtn);

  tdId.innerHTML = rec.id;
  tdName.innerHTML = rec.name;
  tdType.innerHTML = rec.type;
  tdTimeCreated.innerHTML = rec.timeCreated;
  tdDateAdded.innerHTML = rec.dateAdded;

  //кнопка изменения тренировки
  let tdEdit = document.createElement('td');
  let editBtn = document.createElement('input');
  editBtn.type = 'button';
  editBtn.value = 'edit';
  editBtn.addEventListener('click', (e) => {
        let id = parseInt(e.target.parentElement.parentElement.dataset.id)
        editTraining(id)
      }
  );
  tdEdit.appendChild(editBtn);

  document.querySelector('#workoutsTable').append(tr);
  tr.append(tdId);
  tr.append(tdName);
  tr.append(tdType);
  tr.append(tdTimeCreated);
  tr.append(tdDateAdded);
  tr.append(tdEdit);
  tr.append(tdLog);
  tr.append(tdDel);
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

//копирование ключей тренировки
function copyKeyInObj(origObj, newObj) {
  if (!origObj) console.log('пустой объект')
  else
    for (let key in origObj) {
      if (origObj[key].length < 2) {
        newObj[key] = origObj[key]}
    }
}


//создание тренировки(-ок) из файла
document.querySelector('#create-workout-fit-inp').addEventListener('change', async (event) => {
  for (let file of event.target.files) {

    const filename = file.name.replace('.fit','');
    const newWorkoutData = await parseFit(file);
    //добавляем параметры из newWorkoutData

    const newWorkout = {name: filename, type: '-', timeCreated: '-', dateAdded: new Date()};
    copyKeyInObj(newWorkoutData, newWorkout)

    if (newWorkoutData.fileIdMesgs[0].timeCreated && 'fileIdMesgs' in newWorkoutData)
      newWorkout.timeCreated = newWorkoutData.fileIdMesgs[0].timeCreated;

    if ('deviceSettingsMesgs' in newWorkoutData
        && newWorkoutData.deviceSettingsMesgs[0].autoActivityDetect)
      newWorkout.type = newWorkoutData.deviceSettingsMesgs[0].autoActivityDetect;

      //создаем объект тренировки

    const newRecId = await addWorkout(newWorkout, newWorkoutData);

    db.get('workouts', newRecId).then(rec=>{
      addRowToWorkoutsTable(rec);
      setIndexedDbUsageInfo();
    });
  }
});


document.querySelector('#fit-to-json-file-inp')
    .addEventListener('change',
        (e)=>saveJsonFileFromFit(e.target.files[0])
    );


async function editTraining (id) {
  const tx = db.transaction(['workouts', 'workoutsData'], 'readwrite');
  const workoutsOS = tx.objectStore('workouts');
  let workout = await workoutsOS.get(id)
  addEditTrainingToTable(workout)
}

function addEditTrainingToTable(workout) {
  let object={};
  if ('sessionMesgs' in workout)
     for (let key in workout.sessionMesgs[0]) {
       object[key] = workout.sessionMesgs[0][key];
    }
  object.id = workout.id
  makeTd(object)
}

function makeTd(obj) {
  let tr = document.createElement('tr');
  tr.dataset.id = obj.id;
  document.querySelector('#editTable').append(tr);
  for (let key in obj) {
    let td = document.createElement('td');
    if ((typeof obj[key]) == 'object') {
      if(obj[key].length > 0) continue
        td.innerHTML = key + ': ' + obj[key].toLocaleString("en-GB");
   }
   else td.innerHTML = key + ': ' + obj[key];
   tr.append(td)
  }
}
