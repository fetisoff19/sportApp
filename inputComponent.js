import {formatDateForInput} from "./functionsDate.js";
import {otherWord} from "./language.js";

export class DivLabelInput {
        constructor(...classes) {
        let div = document.createElement('div');
        let label = document.createElement('label');
        let input = document.createElement('input');

        div.classList.add('input', ...classes)

        div.append(label,input)
        this.div = div;
        this.label = label;
        this.input = input;
    }

    setLabelText(text) {
       this.label.innerHTML = text;
    }
    setInputText(obj, f) {
        this.input.type = 'text';
        if (obj) {
            for (let key in obj) {
                this.input[key] = obj[key];
            }
        }
        if (f) {
            this.input.addEventListener('input',
                () => this.input.value = f(this.input.value))
        }
    }
    setInputDate(max, value, f) {
        this.input.type = 'date';
        this.input.max = f(max);
        this.input.value = f(value);
    }

  setInputTime(max, value) {
    this.input.type = 'time';
    this.input.value = value;
  }


  setInputList(id, values, defaultSport) {
        this.input.type = 'list';

        this.input.setAttribute('list', id)
        let datalist = document.createElement('datalist');
        datalist.id = id;
        if(values) {
            for (let value of values) {
                let option = document.createElement('option');
                option.value = value;
                datalist.append(option)
            }
        if(defaultSport){
          this.input.placeholder = defaultSport;
        }
        }
        this.input.after(datalist);
    }

    addAppend(elem) {
        elem.append(this.div)
    }

    //временное решение
    setTextArea(obj){
      let textArea = document.createElement('textarea');
      this.label.append(textArea);
      this.input.remove();
      if (obj) {
        for (let key in obj) {
         textArea[key] = obj[key];
        }
      }
   }
}


export function changeTextToDistance (value) {
  if (value > 9999) return value = 9999;
  return value.replace(/[^\d\,. ]/g, '');
}
