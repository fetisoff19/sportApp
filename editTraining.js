import {db} from "./db.js";
import {filterKey} from "./viewTraining.js";

let inputKey = ['name', 'sport', 'note',]

export class DivInput {
    //obj - объект с данными, elem - элемент для привязки кнопки
    constructor(obj, elem) {
        let td = document.createElement('td');
        let div = document.createElement('div')
        let h3 = document.createElement('h3');
        // let form = document.createElement('form');
        // let table = document.createElement('table');
        // let tr = document.createElement('tr');
        h3.innerHTML = 'Изменение тренировки ' + obj.name;
        //`${'td' + obj.id}` понадобится для удаления элемента со страницы
        td.classList.add("inputTd", `${'td' + obj.id}`);
        div.classList.add("inputDiv");

        for (let key of inputKey) {
            let elemDiv = document.createElement('div');
            let label = document.createElement('label');
            let input = document.createElement('input');

            elemDiv.classList.add('inputLabel')
            label.innerHTML = filterKey[key]
            input.type = 'text';
            input.value = obj[key];
            input.classList.add(key, obj.id);

            div.append(elemDiv);
            elemDiv.append(label, input);

            input.addEventListener('change', () =>
                changeValues(input))
         }

        this.obj = obj;
        this.elem = elem;

        this.td = td;
        this.div = div;
        this.h3 = h3;
        // this.label = label;
        // this.input = input;
    }
    addAfter() {
        this.elem.after(this.td);
        this.td.append(this.h3)
        this.h3.append(this.div);
    }
}

function changeValues (input) {
    let key = input.classList[0]
    let id = +input.classList[1]
    db.get('workouts', id).then((r) => {
       r[key] = input.value;
       r.editDate = (new Date).toLocaleString("en-GB");
       db.put('workouts', r)
    });
}
