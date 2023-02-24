import {db, deleteWorkout, setIndexedDbUsageInfo} from "./db.js";

export class ButtonComponent {
    //status (string) используем для изменения состояния кнопки
    //elem - элемент для привязки кнопки
    constructor(text, f, status, options) {
        let btn = document.createElement('button')
        btn.classList.add('button', text, status);
        btn.innerText = text;
        btn.addEventListener('click', (e) => f(e, options))

        this.options = status;
        this.btn = btn;
        this.text = text;
     }

    addAppend(elem) {
        elem.append(this.btn);
    }
}

//функции, которые пока что некуда по смыслу распределить
export function log(e) {
    let id = parseInt(e.target.parentElement.parentElement.dataset.id);
    //в idb у db есть методы для быстрых одиночных операций (не нужно создавать транзакцию вручную)
    // https://github.com/jakearchibald/idb#shortcuts-to-getset-from-an-object-store
    db.get('workoutsData', id).then(result=> {
        if (!result) {
            db.get('workouts', id).then(result=> {
                console.log(result)
            })
        } else console.log(result)
    })
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