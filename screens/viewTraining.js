import { Screen } from './Screen.js';

const viewTrainingScreenHtml = `
  <h1>Просмотр занятия `&{}`</h1>
    <div id="viewCharts"></div>
`;

export const viewTrainingScreen = new Screen({
  name: 'viewTrainingScreen',
  title: "WORKOUTS",
  start: viewTraining,
  path: "?screen=workouts", //костыль чтобы работала перезагрузка страницы
  html: viewTrainingScreenHtml
});

function viewTraining() {

}