import {dict, userLang} from "../config.js";

export class FormComponent {
  constructor(...classes) {
    let form = document.createElement('form');
    let label = document.createElement('label');
    let div = document.createElement('div');

    form.classList.add('form',...classes);
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

  addAfter(elem) {
    elem.after(this.form);
  }
}

export class BlockStatsComponent {
  constructor(obj, name, fields, unit, f) {
    let sport = obj.sport;
    let statBlock = document.createElement('div');
    let h3 = document.createElement('h4');
    let value = '';
    let measure = '';
    if (!unit || !dict.units[unit]) measure = '';
    else measure = dict.units[unit][userLang];
    statBlock.append(h3);
    statBlock.classList.add('statBlock');
    h3.innerHTML = dict.fields[name][userLang];
    for (let field of fields) {
      if (obj[field]) {
        value = obj[field];
        if (f) value = f(value);
        let div = document.createElement('div');
        let span = document.createElement('span');
        div.innerHTML = value + ' ' + measure;
        span.innerHTML = dict.fields[field][userLang];
        h3.after(div);
        div.append(span);
      }
    }

    this.statBlock = statBlock;
    this.h3 = h3;
    this.sport = sport;
  }
  // если элемент пуст или конфликтует с другим, удаляем его
  removeEmptyOrConflictElem(sport) {
    if (!this.h3.nextSibling || this.sport == sport) {
      this.statBlock.remove()
    }
  }

}

