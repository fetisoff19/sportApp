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
    console.log(dict.units['bpm'][userLang], dict.units['cadenceRun'][userLang],
      dict.units['cadenceCycl'][userLang] ,dict.units['w'][userLang],dict.units['kmph'][userLang],
      dict.units['pace'][userLang],dict.units['m'][userLang],dict.units['degreeCelsius'][userLang],)
    let statBlock = document.createElement('div');
    let h3 = document.createElement('h4');
    let value = '';
    statBlock.append(h3);
    statBlock.classList.add('statBlock');
    h3.innerHTML = dict.fields[name][userLang];
    for (let field of fields) {
      if ((obj.sport.toLowerCase() === "бег"
        || obj.sport.toLowerCase() === "run"
        || obj.sport.toLowerCase() === "running") && (name == 'speed')) continue;
      if ((obj.sport.toLowerCase() === "велоспорт"
        || obj.sport.toLowerCase() === "шоссейный велоспорт"
        || obj.sport.toLowerCase() === "cycling") && name == 'pace') continue;
      if ((obj.sport.toLowerCase() === "бег"
        || obj.sport.toLowerCase() === "run"
        || obj.sport.toLowerCase() === "running") && unit == 'cadenceCycl') continue;
      if ((obj.sport.toLowerCase() === "велоспорт"
        || obj.sport.toLowerCase() === "шоссейный велоспорт"
        || obj.sport.toLowerCase() === "cycling") && unit == 'cadenceRun') continue;


      // else unit = dict.units[unit][userLang];
      if (obj[field]) {
        value = obj[field];
        if (f) value = f(value);
        console.log(value, unit, name );
        if (!unit || dict.units[unit][userLang]) unit = '';
        let div = document.createElement('div');
        let span = document.createElement('span');
        div.innerHTML = value + ' ' + unit;
        span.innerHTML = dict.fields[field][userLang];
        h3.after(div);
        div.append(span)
      };
    }

    this.statBlock = statBlock;
    this.value = value;
    this.h3 = h3;

  }

  removeEmptyElem(){
    if (!this.h3.nextSibling) {
      this.h3.parentElement.remove()
    }
  }
}

