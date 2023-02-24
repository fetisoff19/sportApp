import {parseFit, sha256File } from './utils.js';
import {db, addWorkout, setIndexedDbUsageInfo} from './db.js';
import {copyKeyInObj} from "./makeWorkout.js";
import {ButtonComponent, log, del} from "./buttonComponent.js";
import {otherWord, setLanguage, } from "./language.js";
import {openView} from "./viewTraining.js";
import {openCreateForm, openEditForm} from "./formFunction.js";

setLanguage('ru')
fillWorkoutsTable();
setIndexedDbUsageInfo();

export async function fillWorkoutsTable() {
  let workouts = await db.getAll('workouts');
  workouts.forEach(rec=> addRowToWorkoutsTable(rec));
}

function addRowToWorkoutsTable(rec) {
  let tr = document.createElement('tr');
  tr.dataset.id = rec.id;
  let tdId = document.createElement('td');
  let tdName = document.createElement('td');
  let tdType = document.createElement('td');
  let tdTimeCreated = document.createElement('td');
  let tdDateAdded = document.createElement('td');
  let tdNote = document.createElement('td');
  let tdView = document.createElement('td');
  let tdEdit = document.createElement('td');
  let tdLog = document.createElement('td');
  let tdDel = document.createElement('td');

  // объявление кнопок
  let viewBtn = new ButtonComponent(otherWord.view, openView, true)
  viewBtn.addAppend(tdView)
  let editBtn = new ButtonComponent(otherWord.edit,  openEditForm, true, rec.id)
  editBtn.addAppend(tdEdit)
  let logBtn = new ButtonComponent(otherWord.log, log)
  logBtn.addAppend(tdLog)
  let delBtn = new ButtonComponent(otherWord.delete, del)
  delBtn.addAppend(tdDel)

  //наполнение заголовков таблицы
  tdId.innerHTML = rec.id;
  tdName.innerHTML = rec.name;
  tdType.innerHTML = rec.sport;
  tdTimeCreated.innerHTML = rec.startTime;
  tdDateAdded.innerHTML = rec.dateAdded;
  tdNote.innerHTML = rec.note;

  //добавление элементов в DOM
  document.querySelector('#workoutsTable').append(tr);
  tr.append(tdId, tdName, tdType, tdTimeCreated,
    tdDateAdded, tdNote, tdEdit, tdView, tdLog, tdDel);
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
    const sha256 = await sha256File(file);
    newWorkoutData.sha256 = sha256;
    //добавляем параметры из newWorkoutData
    const newWorkout = {name: filename};
    copyKeyInObj(newWorkoutData, newWorkout)
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

let addManual = document.getElementById('addManual');
let createBtn = new ButtonComponent(otherWord.add, openCreateForm)
createBtn.addAppend(addManual)




