import {parseFit, sha256File } from './utils.js';
import {db, addWorkout, deleteWorkout, setIndexedDbUsageInfo, getObjectStore} from './db.js';
import {makeTable} from "./viewTraining.js";
import {createMapWithWorkoutRoute } from './components.js';
import {copyKeyInObj} from "./makeWorkout.js";

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
  let tdNote = document.createElement('td');
  let tdLog = document.createElement('td');
  //кнопка вывода workout в консоль-лог
  let logBtn = document.createElement('input');
  logBtn.type = 'button';
  logBtn.value = 'log';
  logBtn.addEventListener('click', (e)=> {
    let id = parseInt(e.target.parentElement.parentElement.dataset.id);
    //в idb у db есть методы для быстрых одиночных операций (не нужно создавать транзакцию вручную) https://github.com/jakearchibald/idb#shortcuts-to-getset-from-an-object-store
    db.get('workoutsData', id).then(result=>console.log(result));
  });
  tdLog.appendChild(logBtn);
  //кнопка удаления тренировки
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
      },100);
      if (document.getElementById(`${id}`)) {
        document.getElementById(`${id}`).remove()
      }
    });
  });
  tdDel.appendChild(delBtn);
  //наполнение заголовков таблицы
  tdId.innerHTML = rec.id;
  tdName.innerHTML = rec.name;
  tdType.innerHTML = rec.sport;
  tdTimeCreated.innerHTML = rec.startTime;
  tdDateAdded.innerHTML = rec.dateAdded;
  tdNote.innerHTML = rec.note;
  //кнопка просмотра тренировки
  let viewStatus = true;
  let tdView = document.createElement('td');
  let viewBtn = document.createElement('input');
  viewBtn.type = 'button';
  viewBtn.value = 'view';
  viewBtn.addEventListener('click', async (e) => {
    let id = parseInt(e.target.parentElement.parentElement.dataset.id)
    let section = document.createElement('section')
    let btnEdit = document.createElement('input');
    section.setAttribute('class', 'viewTable')
    section.setAttribute('id',`${rec.id}`)
    section.innerHTML = 'Тренировка: ' + `${rec.id}`;
    btnEdit.type = 'button';
    btnEdit.value = 'edit';

    if (viewStatus) {
      viewStatus = false;
      viewBtn.value = 'close';
      viewBtn.parentElement.parentElement.after(section)
      // section.append(btnEdit)
      getObjectStore('workouts', id, makeTable);
      const workoutData = await db.get('workoutsData', id);
      createMapWithWorkoutRoute(workoutData, section);
      btnEdit.onclick = function (){}

    } else {
      viewStatus = true;
      viewBtn.value = 'view';
      document.getElementById(`${rec.id}`).remove()
    }
  });
  //добавление элементов в DOM
  document.querySelector('#workoutsTable').append(tr);
  tr.append(tdId);
  tr.append(tdName);
  tr.append(tdType);
  tr.append(tdTimeCreated);
  tr.append(tdDateAdded);
  tr.append(tdNote);
  tr.append(tdView);
  tr.append(tdLog);
  tr.append(tdDel);
  tdView.append(viewBtn);
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

