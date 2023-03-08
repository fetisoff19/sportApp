import { App } from './components/app.js';

import { startScreen } from "./screens/start.js";
import { workoutsScreen } from "./screens/workouts.js";
import {highChartsScreen} from "./screens/highChartsScreen.js";
// Проверяется, активирован ли интерфейс горячей замены модулей

//window.addEventListener('DOMContentLoaded', ()=> { //не работает из-за кода, вставленного live
{
  const app = new App({
    appTitle: 'sportsApp',
    screens: [
      startScreen,
      workoutsScreen,
      highChartsScreen,
    ],
    startScreenName: 'startScreen'
  });
  app.start();
}
