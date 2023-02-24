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
