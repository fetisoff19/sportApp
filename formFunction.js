import {changeTextToDistance, DivLabelInput, InputSubmit} from "./components/inputComponent.js";
import {filterKey, otherWord, sportType} from "./language.js";
import {ButtonComponent, InputButtonComponent} from "./components/buttonComponent.js";
import {formatDateForInput} from "./functionsDate.js";
import {db} from "./db.js";
import {FormComponent} from "./components/formComponent.js";

export function openCreateForm () {
  if (document.querySelector('.createForm')) return

  let h1 = document.querySelector('h1');
  let manualForm = new FormComponent('createForm');

  let saveInput = new InputSubmit(otherWord.save, saveForm)
  let closeBtn = new InputButtonComponent(otherWord.close, closeForm)

  //в будущем, возможно, будем итерировать по массиву с названиями занятий
  let name = new DivLabelInput('name')
  name.setLabelText(filterKey.name);
  name.setInputText({size: 30, placeholder: otherWord.placeholderText});

  let sport = new DivLabelInput(`sport`)
  sport.setLabelText(filterKey.sport);
  sport.setInputList(12, Object.values(sportType), sportType.cycling);

  let totalDistance = new DivLabelInput('totalDistance')
  totalDistance.setLabelText(filterKey.totalDistance);
  totalDistance.setInputText(
    {size: 10, placeholder: otherWord.placeholderDistance},
    changeTextToDistance)

  let totalElapsedTime = new DivLabelInput('totalTimerTime')
  totalElapsedTime.setLabelText(filterKey.totalElapsedTime);
  totalElapsedTime.setInputTime(20, '01:00');

  let startTime = new DivLabelInput('startTime')
  startTime.setLabelText(filterKey.startTime);
  startTime.setInputDate(new Date, new Date, formatDateForInput);

  let note = new DivLabelInput('note')
  note.setLabelText(filterKey.note);
  note.setTextArea({rows: 5, cols: 30, placeholder: otherWord.placeholderNote}, 'note')

  manualForm.addAppend(h1);
  manualForm.setLabelText(otherWord.createTraining);
  manualForm.addBtn(saveInput.input, closeBtn.btn);
  manualForm.addElements(name.div, sport.div, totalDistance.div,
    totalElapsedTime.div, startTime.div, note.div);
}

export async function openEditForm(e) {
  if (document.querySelector('.editForm')) return
  let elem = e.target.parentElement.parentElement;
  let id = +elem.dataset.id
  let editForm = new FormComponent('editForm');
  let saveInput = new InputSubmit(otherWord.save, saveForm, id)
  let closeBtn = new ButtonComponent(otherWord.close, closeForm);
  // заворачиваем editForm в div чтобы не было конфликта с td
  let div = document.createElement('div');

  db.get('workouts', id).then((r) => {
    let name = new DivLabelInput('name')
    name.setLabelText(filterKey.name);
    name.setInputText({size: 30, value: r.name});

    let sport = new DivLabelInput('sport')
    sport.setLabelText(filterKey.sport);
    sport.setInputList(12, Object.values(sportType), r.sport);

    let note = new DivLabelInput('note')
    note.setLabelText(filterKey.note);
    note.setTextArea({rows: 5, cols: 30, value: r.note}, 'note');
    editForm.addAppend(div);
    editForm.setLabelText(otherWord.editTraining);
    editForm.addBtn(saveInput.input, closeBtn.btn);
    editForm.addElements(name.div, sport.div, note.div);
  })
  elem.after(div)
}

export function saveForm(e, id){
  let obj = {};
  let form = e.target.parentElement.parentElement;
  let inputs = form.querySelectorAll('.input');
  for (let input of inputs) {
    if (!input.checkValidity()) return;
    let key = input.classList[1];
    if (key === 'totalDistance') {
      obj[key] = input.value * 1000
    }
    else if (key === 'totalTimerTime') {
      obj[key] = changeInputTimeToSeconds(input.value)
    } else if (key === 'startTime') {
      obj[key] = new Date(input.value)
    } else obj[key] = input.value
  }
  if (form.classList.contains('createForm')) {
    obj.isManual = true;
    obj.dateAdded = new Date;
    db.add('workouts', obj);
  }
  else {
    db.get('workouts', id).then((r) => {
      Object.assign(r, obj)
      r.dateEdit = new Date;
      db.put('workouts', r)
    })
  }
}

export function closeForm(e) {
  e.preventDefault();
  let elem = e.target.parentNode.parentNode;
  elem.remove();
}

function changeInputTimeToSeconds (value) {
  return ((+value.slice(0, 2)*3600) + (+value.slice(3)*60));
}
