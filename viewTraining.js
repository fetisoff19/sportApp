import {filterKey} from "./language.js";


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




