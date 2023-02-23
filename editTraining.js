import {addWorkout, db} from "./db.js";
import {ButtonComponent, inputCreateKey} from "./buttonComponent.js";
import {filterKey} from "./language.js";

export let inputEditKey = ['name', 'sport', 'note',]
//
// export class DivInput {
//     //obj - объект с данными, elem - элемент для привязки кнопки
//     constructor(elem, arr, obj) {
//         let td = document.createElement('td');
//         let div = document.createElement('div')
//         let h3 = document.createElement('h3');
//
//         if (obj) {
//             h3.innerHTML = 'Изменение тренировки ' + obj.name;
//             //`${'td' + obj.id}` понадобится для удаления элемента со страницы
//             td.classList.add('inputTd',`${'td' + obj.id}`);
//             div.classList.add("inputDiv");
//         } else {
//             h3.innerHTML = 'Создание тренировки';
//             td.classList.add("inputTd", 'createForm');
//             div.classList.add("inputDiv");
//         }
//
//         for (let key of arr) {
//             let elemDiv = document.createElement('div');
//             let label = document.createElement('label');
//             let input = document.createElement('input');
//
//             elemDiv.classList.add('inputLabel');
//             label.innerHTML = filterKey[key];
//
//             if (key === 'startTime') {
//                 input.type = 'datetime-local';
//                 input.setAttribute('required', '')
//             } else input.type = 'text';
//
//             if (obj) {
//                 input.value = obj[key];
//                 input.classList.add(key, obj.id);
//             } else {
//                 input.value = '';
//                 input.classList.add(key);
//             }
//
//             div.append(elemDiv);
//             elemDiv.append(label, input);
//          }
//
//         td.append(h3);
//             let saveBtn = new ButtonComponent('save', saveTraining)
//             saveBtn.addAppend(h3)
//             let closeBtn = new ButtonComponent('close', closeForm)
//             closeBtn.addAppend(h3)
//
//         this.elem = elem;
//         this.obj = obj;
//         this.td = td;
//         this.div = div;
//         this.h3 = h3;
//     }
//     addAfter() {
//         this.elem.after(this.td);
//         this.td.append(this.div)
//     }
// }

// function saveTraining(e) {
    // let parentElem = e.target.parentNode.parentNode;
    // let elem = e.target.parentNode.nextSibling;
    // let inputs = elem.querySelectorAll('input');
    // let obj = {};
    // for (let input of inputs) {
    //     if(!input.value && input.classList[0] !== 'note') {
    //         input.placeholder = 'необходимо заполнить';
    //     } else obj[input.classList[0]] = input.value;
    // }
    // // счётчик длины объекта для (*)
    // let count = 0;
    // for (let key in obj) {
    //     if (key === 'note') continue;
    //     count++;
    // }
    // // если создаём новую тренировку
    // if (parentElem.classList.contains('createForm')) {
    //     // добавляем условие, что все инпуты заполнены за искл. примечания (*)
    //     if (count <= inputCreateKey.length - 2) return
    //     obj.dateAdded = (new Date()).toLocaleString("en-GB")
    //     obj['manual'] = true;
    //     // обновим страницу, в будущем нужно обновлять только строку с элементом
    //     addWorkout(obj, obj).then(() => window.location.reload())
    //     } else {
    //     // если редактируем тренировку
    //     if (count <= inputEditKey.length - 2) return   // (*)
    //     let id = +parentElem.classList[1].slice(2);
    //     db.get('workouts', id).then((r) => {
    //         Object.assign(r, obj)
    //         r.editDate = (new Date).toLocaleString("en-GB");
    //         db.put('workouts', r).then(() => window.location.reload())
    //     });
    // }
// }

