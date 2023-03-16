import { App } from './components/app.js';

import { startScreen } from "./screens/start.js";
import { workoutsScreen } from "./screens/workouts.js";
import {highChartsScreen} from "./screens/highChartsScreen.js";
import {statsScreen} from "./screens/stats.js";
// Проверяется, активирован ли интерфейс горячей замены модулей

//window.addEventListener('DOMContentLoaded', ()=> { //не работает из-за кода, вставленного live
{
  const app = new App({
    appTitle: 'sportsApp',
    screens: [
      startScreen,
      workoutsScreen,
      highChartsScreen,
      statsScreen,
    ],
    startScreenName: 'startScreen'
  });
  app.start();
}
