import {ButtonComponent} from "./buttonComponent.js";
import {changeTextToDistance, DivLabelInput} from "./inputComponent.js";
import {filterKey, otherWord, sportType} from "./language.js";
import {formatDateForInput} from "./functionsDate.js";

export class FormComponent {
  constructor(...classes) {
    let form = document.createElement('form');
    let label = document.createElement('label');
    let div = document.createElement('div');

    form.classList.add(...classes);
    div.classList.add('form-container');

    form.append(label, div);

    this.div = div;
    this.label = label;
    this.form = form;
  }

  addBtn(...buttons) {
    this.label.append(...buttons);
  }

  addElements(...elements) {
    this.div.append(...elements);
  }

  setLabelText(text) {
    this.label.innerHTML = text;
  }

  addAppend(elem) {
    elem.append(this.form);
  }
}


export function openCreateForm () {
  if (document.querySelector('.form')) return

  let h1 = document.querySelector('h1');
  let manualForm = new FormComponent('form');

  let saveBtn = new ButtonComponent('save', saveTraining)
  let closeBtn = new ButtonComponent('close', closeForm)

  //в будущем, возможно, будем итерировать по массиву с названиями занятий
  let name = new DivLabelInput('name')
  name.setLabelText(filterKey.name);
  name.setInputText({size: 30, placeholder: otherWord.placeholderText});

  let sport = new DivLabelInput('sport')
  sport.setLabelText(filterKey.sport);
  sport.setInputList(12, Object.values(sportType), sportType.cycling);

  let totalDistance = new DivLabelInput('totalDistance')
  totalDistance.setLabelText(filterKey.totalDistance);
  totalDistance.setInputText(
    {size: 10, placeholder: otherWord.placeholderDistance},
    changeTextToDistance)

  let totalElapsedTime = new DivLabelInput('totalElapsedTime')
  totalElapsedTime.setLabelText(filterKey.totalElapsedTime);
  totalElapsedTime.setInputTime(20, '01:00');

  let startTime = new DivLabelInput('totalElapsedTime')
  startTime.setLabelText(filterKey.startTime);
  startTime.setInputDate(new Date, new Date, formatDateForInput);

  let note = new DivLabelInput('note')
  note.setLabelText(filterKey.note);
  note.setTextArea({rows: 5, cols: 30, placeholder: otherWord.placeholderNote})

  manualForm.addAppend(h1);
  manualForm.setLabelText(otherWord.createTraining);
  manualForm.addBtn(saveBtn.btn, closeBtn.btn);
  manualForm.addElements(name.div, sport.div, totalDistance.div,
    totalElapsedTime.div, startTime.div, note.div);
}

function saveTraining(){
  console.log('h1');

}


function closeForm(e) {
  let elem = e.target.parentNode.parentNode;
  elem.remove()
}

