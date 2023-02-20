import {db, deleteWorkout, getObjectStore, setIndexedDbUsageInfo} from "./db.js";
import {makeTable} from "./viewTraining.js";
import {createMapWithWorkoutRoute} from "./components.js";
import {DivInput} from "./editTraining.js";

export class Button {
    //status (string) используем для изменения состояния кнопки
    //elem - элемент для привязки кнопки
    constructor(text, elem, f, status, obj) {
        let btn = document.createElement('button')
        btn.classList.add('button', text, status);
        btn.innerText = text;
        btn.addEventListener('click', (e) => f(e,obj))

        this.options = status;
        this.btn = btn;
        this.elem = elem;
        this.text = text;
    }

    addAppendChild() {
        this.elem.append(this.btn);
    }
}

export function log(e) {
    let id = parseInt(e.target.parentElement.parentElement.dataset.id);
    //в idb у db есть методы для быстрых одиночных операций (не нужно создавать транзакцию вручную)
    // https://github.com/jakearchibald/idb#shortcuts-to-getset-from-an-object-store
    db.get('workoutsData', id).then(result=>console.log(result));
}

export function del(e) {
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

export async function view(e){
    let btn = e.target;
    let status = btn.classList;
    let id = parseInt(e.target.parentElement.parentElement.dataset.id)
    let viewTable = document.createElement('div');
    viewTable.setAttribute('class', 'viewTable')
    viewTable.setAttribute('id',`${id}`)
    viewTable.innerHTML = 'Тренировка: ' + id;
    if (status[2] === 'true') {
        status.replace('true', 'false')
        btn.innerText = 'close';
        btn.parentElement.parentElement.after(viewTable)
        getObjectStore('workouts', id, makeTable);
        const workoutData = await db.get('workoutsData', +id);
        createMapWithWorkoutRoute(workoutData, viewTable);
    } else {
        status.replace('false', 'true')
        btn.innerText = 'view';
        document.getElementById(`${id}`).remove()
    }
}

export async function edit(e, obj){
    let elem = e.target.parentElement.parentElement
    let btn = e.target;
    let status = btn.classList;
    //добавляем инпуты для изменения тренировки
    let divInput = new DivInput(obj, elem);
    divInput.addAfter()

    if (status[2] === 'true') {
        status.replace('true', 'false')
        btn.innerText = 'save';
    } else {
        status.replace('false', 'true')
        btn.innerText = 'edit';
        //getElementById.remove() удаляет элемент живой коллекции
        //здесь это не работает, значит используем querySelectorAll
        let inputTd = document.querySelectorAll(`.${'td' + obj.id}`)
        for (let elem of inputTd) {
            elem.remove();
            // обновим страницу, в будущем нужно обновлять только строку с элементом
            window.location.reload()
        }
    }
}