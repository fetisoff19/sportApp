import { Screen } from './Screen.js';
import {parseFit, sha256File } from '../utils.js';
import {db, addWorkout, deleteWorkout, setIndexedDbUsageInfo} from '../db.js';
import {copyKeyInObj} from "../makeWorkout.js";
import {ButtonComponent} from "../components/buttonComponent.js";
import {otherWord, } from "../language.js";
import {openView} from "../viewTraining.js";
import {openCreateForm, openEditForm} from "../formFunction.js";
import {dict as dist, userLang} from "../config.js";

let workouts = {}; // вынесено в отдельный файл

const workoutsScreenHtml = `
  <label for="fit-to-json-file-inp">FIT TO JSON</label>
  <input type="file" id="fit-to-json-file-inp" accept=".fit">
  </br>
  <label for="create-workout-fit-inp">CREATE WORKOUT FROM FIT</label>
  <input type="file" id="create-workout-fit-inp" accept=".fit" multiple>
  </br>
  <label id="addManual">CREATE MANUAL </label>
  </br>
  <h1></h1>
  <table id="workoutsTable">
    <tr>
        <td class="id">Id</td>
        <td class="name">Name</td>
        <td class="type">Type</td>
        <td class="timeCreated">Created</td>
        <td class="dateAdded">Added</td>
        <td class="note">Note</td>
        <td class="view"></td>
        <td class="log"></td>
        <td class="del"></td>
    </tr>
  </table>
`;

export const workoutsScreen = new Screen({
  name: 'workoutsScreen',
  navName: dist.title.trainings[userLang],
  title: dist.title.trainings[userLang],
  start: workoutsStart,
  html: workoutsScreenHtml
});

function workoutsStart(startOptions) {
  fillWorkoutsTable(startOptions);

  document.querySelector('h1').innerHTML = dist.title.trainings[userLang];
  let addManual = document.getElementById('addManual');
  let createBtn = new ButtonComponent(otherWord.add, openCreateForm);
  createBtn.addAppend(addManual);

  //создание тренировки(-ок) из файла
  document.querySelector('#create-workout-fit-inp').addEventListener('change', async (event) => {
    for (let file of event.target.files) {
      const filename = file.name.replace('.fit','');
      const newWorkoutData = await parseFit(file);
      const sha256 = await sha256File(file);
      newWorkoutData.sha256 = sha256;
      //добавляем параметры из newWorkoutData
      const newWorkout = {name: filename};
      copyKeyInObj(newWorkoutData, newWorkout);
      //создаем объект тренировки
      const newRecId = await addWorkout(newWorkout, newWorkoutData);
      db.get('workouts', newRecId).then(rec=>{
        addRowToWorkoutsTable(rec);
        setIndexedDbUsageInfo();
      });
    }
  });

  document.querySelector('#fit-to-json-file-inp')
    .addEventListener('change', (e)=> {
      saveJsonFileFromFit(e.target.files[0]);
    });
}

async function fillWorkoutsTable(startOptions) {
  workouts = await db.getAll('workouts');
  workouts.forEach(rec=> addRowToWorkoutsTable(rec, startOptions));
}

function addRowToWorkoutsTable(rec, startOptions) {
  let tr = document.createElement('tr');
  tr.dataset.id = rec.id;
  let tdId = document.createElement('td');
  let tdName = document.createElement('td');
  let tdType = document.createElement('td');
  let tdTimeCreated = document.createElement('td');
  let tdDateAdded = document.createElement('td');
  let tdNote = document.createElement('td');
  let tdView = document.createElement('td');
  let thHc = document.createElement('td');
  let tdEdit = document.createElement('td');
  let tdLog = document.createElement('td');
  let tdDel = document.createElement('td');

  // объявление кнопок
  let viewBtn = new ButtonComponent(otherWord.view, openView, true);
  viewBtn.addAppend(tdView);
  let openHcBtn = new ButtonComponent('HC', (e)=>openHighcharts(e, startOptions));
  openHcBtn.addAppend(thHc);
  let editBtn = new ButtonComponent(otherWord.edit,  openEditForm, true, rec.id);
  editBtn.addAppend(tdEdit);
  let logBtn = new ButtonComponent(otherWord.log, log);
  logBtn.addAppend(tdLog);
  let delBtn = new ButtonComponent(otherWord.delete, del);
  delBtn.addAppend(tdDel);

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
    tdDateAdded, tdNote, tdEdit, tdView, thHc, tdLog, tdDel);
}

//функции, которые пока что некуда по смыслу распределить
function log(e) {
  let id = parseInt(e.target.parentElement.parentElement.dataset.id);
  //в idb у db есть методы для быстрых одиночных операций (не нужно создавать транзакцию вручную)
  // https://github.com/jakearchibald/idb#shortcuts-to-getset-from-an-object-store
  db.get('workoutsData', id).then(result=> {
      if (!result) {
          db.get('workouts', id).then(result=> {
              console.log(result);
          })
      } else console.log(result);
  });
}

function del(e) {
  let id = parseInt(e.target.parentElement.parentElement.dataset.id);
  deleteWorkout(id).then(()=>{
      document.querySelector(`tr[data-id="${id}"]`).remove();
      setTimeout(() => {
          setIndexedDbUsageInfo();       // в будущем доработать бзе таймаута
      },100);
      if (document.getElementById(`${id}`)) {
          document.getElementById(`${id}`).remove()
      }
  });
}

function openHighcharts(e, startOptions) {
  let workoutId = parseInt(e.target.parentElement.parentElement.dataset.id);
  let hcOptions = {
    ...startOptions,
    urlParams: {workoutId}
  };
  startOptions.app.switchToScreen('highChartsScreen', hcOptions);
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
