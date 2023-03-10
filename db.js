import { openDB, deleteDB } from './node_modules/idb/build/index.js';

export const db = await initDb();

async function initDb() {
  if (!('indexedDB' in window)) {
    console.log("This browser doesn't support IndexedDB.");
    return null;
  }
  return await openDB('sportsApp', 1, {

    upgrade(db, oldVersion, newVersion, transaction) {
      if (!db.objectStoreNames.contains('workouts')) {
        const workoutsOS = db.createObjectStore('workouts', { keyPath: 'id', autoIncrement: true });
        //workoutsOS.createIndex('date','date', {unique: false});
      }
      if (!db.objectStoreNames.contains('workoutsData')) {
        const workoutsDataOS = db.createObjectStore('workoutsData', { keyPath: 'id_workouts'});
        workoutsDataOS.createIndex('sha256','sha256', {unique: true});
      }
    }

  });
}

export function handleDbError(err) {
  console.error(err);
}

export async function addWorkout(newWorkout, newWorkoutData) {
  //создаем транзакцию с перечислением OSов, с которыми будем в ней работать
  const tx = db.transaction(['workouts', 'workoutsData'], 'readwrite');
  //получаем OSы для дальнейшей работы
  const workoutsOS = tx.objectStore('workouts');
  const workoutsDataOS = tx.objectStore('workoutsData');
  //добавляем тренировку, сохраняем id добавленной записи
  const newWorkoutId = await workoutsOS.add(newWorkout).catch(handleDbError);
  //записываем id в данные тренировки
  newWorkoutData.id_workouts = newWorkoutId;
  //добавляем данные тренировки
  await workoutsDataOS.add(newWorkoutData).catch(handleDbError);
  return newWorkoutId;
}

export async function deleteWorkout(id) {
  const tx = db.transaction(['workouts', 'workoutsData'], 'readwrite');
  const workoutsOS = tx.objectStore('workouts');
  const workoutsDataOS = tx.objectStore('workoutsData');
  await workoutsOS.delete(id).catch(handleDbError);
  //удаляем связанные с тренировкой данные
  await workoutsDataOS.delete(id).catch(handleDbError);
}


//ф-я отображения размера локального хранилища
export function setIndexedDbUsageInfo() {
  navigator.storage.estimate().then(result=>{
    document.querySelector('#indexedDbUsage').innerHTML = 'indexedDb: '+(result.usageDetails.indexedDB/(10**6)).toFixed(2)+'MB';
  });
}

export function getObjectStore (os ,id, f) {
  db.get(os, id).then((r) => f(r));
}