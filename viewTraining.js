import {filterKey, otherWord} from "./language.js";
import {db, getObjectStore} from "./db.js";
import {createMapWithWorkoutRoute} from "./components.js";


export function makeTable(obj) {
    let tr1 = document.createElement('tr');
    let tr2 = document.createElement('tr');
    tr1.dataset.id = tr2.dataset.id = obj.id;
    let elem = document.getElementById(`${obj.id}`)
    elem.append(tr1, tr2);
    //добавляем ключи в верхнюю строку таблицы
    for (let key in obj) {
        let td = document.createElement('td');
        td.innerHTML = filterKey[key];
        tr1.append(td)
    }
    //добавляем значения ключей в нижнюю строку таблицы
    for (let key in obj) {
        let td = document.createElement('td');
        td.innerHTML = obj[key];
        tr2.append(td)
    }
}

export async function openView(e){
    let btn = e.target;
    let status = btn.classList;
    let id = parseInt(e.target.parentElement.parentElement.dataset.id)
    let viewTable = document.createElement('div');
    viewTable.setAttribute('class', 'viewTable')
    viewTable.setAttribute('id',`${id}`)
    viewTable.innerHTML = 'Тренировка: ' + id;
    if (status[2] === 'true') {
        status.replace('true', 'false')
        btn.innerText = otherWord.close;
        btn.parentElement.parentElement.after(viewTable);
        getObjectStore('workouts', id, makeTable);
        const workoutData = await db.get('workoutsData', +id);
        if(workoutData) createMapWithWorkoutRoute(workoutData, viewTable);
    } else {
        status.replace('false', 'true')
        btn.innerText = otherWord.view;
        document.getElementById(`${id}`).remove()
    }
}




