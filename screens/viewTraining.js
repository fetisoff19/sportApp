import { Screen } from './Screen.js';

const viewTrainingScreenHtml = `
  <h1>Просмотр занятия `&{}`</h1>
    <div id="viewCharts"></div>
`;

export const viewTrainingScreen = new Screen({
  name: 'viewTrainingScreen',
  title: "WORKOUTS",
  start: viewTraining,
  html: viewTrainingScreenHtml
});

function viewTraining() {

}