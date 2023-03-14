export function formatDateForInput(dateObj) {
     return new Date(dateObj.getTime() - (dateObj.getTimezoneOffset() * 60000 ))
        .toISOString()
        .split("T")[0];
}

function formatDateTimeForInput(dateObj) {
    return new Date(dateObj.getTime() - (dateObj.getTimezoneOffset() * 60000 ))
        .toISOString()
        .split("Z")[0];
}

function getDateOfISOWeek(yearAndWeek) {
    //получает номер и год (2020-W06), возвращает дату начала недели
    let w = yearAndWeek.substring(6,8);
    let y = yearAndWeek.substring(0,4);
    let simple = new Date(y, 0, 1 + (w - 1) * 7);
    let dow = simple.getDay();
    let ISOweekStart = simple;
    if (dow <= 4)
        ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1);
    else
        ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay());
    return ISOweekStart;
}

function getLastDayOfPeriod(firstDay, period) {
    let getLD = plusPeriod(period);
    let LD = getLD((new Date(firstDay)));
    LD.setDate(LD.getDate() - 1);
    return LD;
}

function getFirstDayOfPeriod(date, period) {
    let FD;
    switch (period) {
        case 'День' :
        case 'D' :
            FD = new Date(date);
            break;
        case 'Неделя' :
        case 'W' :
            let weekNum = getWeekNum(date);
            let dayNum = date.getDate();
            let weekBelongsToPreviousYear = (weekNum > 51 && dayNum < 7);
            let year = weekBelongsToPreviousYear ? date.getFullYear()-1 : date.getFullYear();
            FD = getDateOfISOWeek(year + '-W' + weekNum);
            break;
        case 'Месяц' :
        case 'M' :
            FD = new Date(date);
            FD.setDate(1);
            break;
        case 'Квартал' :
        case 'Q' :
            let quarter = Math.floor((date.getMonth() / 3));
            FD = new Date(date.getFullYear(), quarter * 3, 1);
            break;
        case 'Полгода' :
        case 'HY' :
            let fdMonth = date.getMonth()>5 ? 6 : 0;
            FD = new Date(date.getFullYear(), fdMonth, 1);
            break;
        case 'Год' :
        case 'Y' :
            FD = new Date(date.getFullYear(), 0, 1);
    }
    return FD;
}

function getWeekNum(date) {
    let d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    let dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    let yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
    return Math.ceil((((d - yearStart) / 86400000) + 1)/7);
}

export function getMinSec(minuts) {
    let min = Math.floor(minuts);
    let sec = Math.round((minuts - min) * 60);
    if (sec === 0) sec = '00';
    if (sec < 10) sec = '0' + sec;
    return min + ':' + sec
}

export function getHourMinSec(timestamp) {
    if (typeof timestamp == "number" || typeof timestamp == "string") {
        let hours = Math.floor(timestamp / 3600);
        let minutes = Math.floor(timestamp / 60) - (hours * 60);
        let seconds = Math.round(timestamp % 60);

        let formatted = '';
        if (hours)
            formatted = [
                hours.toString().padStart(2, '0'),
                minutes.toString().padStart(2, '0'),
                seconds.toString().padStart(2, '0'),
            ].join(':');

        else formatted = [
            minutes.toString().padStart(2, '0'),
            seconds.toString().padStart(2, '0'),
        ].join(':');
        return formatted;
    }
    if (typeof timestamp == "object") {
        return timestamp.toLocaleTimeString('it-IT');
    }
}

export let convertSpeed = value =>  +(value * 3.6).toFixed(1);
export let convertPace = value => getMinSec((60/(3.6 * value)).toFixed(2));
export let doubleValue = value =>  Math.round(value * 2)
