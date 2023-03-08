// import { setIndexedDbUsageInfo } from './db.js';
// import { htmlToNodeList, htmlFileUrlToNodeList } from './utils.js';

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
    ]
  });
  app.start();
}
//});

// const appScreens = {
//   startScreen,
//   workoutsScreen,
//   highChartsScreen,
// };

// const appTitle = 'sportsApp';

// const screenStartOptions = {container: document.querySelector('#appScreenContainer'), switchToScreen};

// //window.addEventListener('DOMContentLoaded', ()=> { //не работает из-за кода, вставленного live server
// {
//   // добавить применение польз. настроек
//   window.addEventListener('popstate', browserNavSwitchScreen);
//   setAppNav();
//   setIndexedDbUsageInfo();
//   let currentPath = window.location.href.split('/')[3];
//   if (currentPath==='') currentPath = '/';
//   for (let screenName in appScreens) {
//     if (appScreens[screenName].path!==currentPath) continue;
//     switchScreen(screenName, screenStartOptions);
//     window.history.replaceState(screenName,'',appScreens[screenName].path);
//     // break;
//   }
// }
// //});

// function setAppNav() {
//   let logo = document.querySelector('#app-logo');
//   logo.innerHTML = appTitle;
//   logo.dataset.screen = 'startScreen';
//   logo.addEventListener('click', appNavSwitchScreen);
//   let nav = document.querySelector('#app-nav');
//   for (let screenName in appScreens) {
//     if (!appScreens[screenName].hasOwnProperty('navName')) continue;
//     let menuItem = document.createElement('button');
//     menuItem.innerHTML = appScreens[screenName].navName;
//     menuItem.dataset.screen = screenName;
//     menuItem.className = 'app-nav-item';
//     menuItem.addEventListener('click', appNavSwitchScreen);
//     nav.appendChild(menuItem);
//   }
// }

// async function switchScreen(screenName, startOptions) {
//   setScreenTitle(appScreens[screenName]);
//   setAppNavItemAsSelected(screenName);
//   startOptions.container.replaceChildren();
//   startOptions.container.className='';
//   await addHtmlToScreen(appScreens[screenName], startOptions.container);
//   appScreens[screenName].start(startOptions);
// }

// async function addHtmlToScreen(screen, container) {
//   let nodeList;
//   if ('html' in screen) {
//     nodeList = htmlToNodeList(screen.html);
//   } else 
//   if ('htmlUrl' in screen) {
//     nodeList =  await htmlFileUrlToNodeList(screen.htmlUrl);
//   } else return;
//   container.replaceChildren(...nodeList);
// }

// function browserNavSwitchScreen() {
//   let curScrName = window.history.state;
//   switchScreen(curScrName, screenStartOptions);
// }

// function switchToScreen(screenName, options) {
//   switchScreen(screenName, options);
//   window.history.pushState(screenName, '', appScreens[screenName].path);
// }

// function appNavSwitchScreen() {
//   let curScrName = this.dataset.screen;
//   let prevScrName = window.history.state;
//   if (curScrName===prevScrName) return;
//   switchScreen(curScrName, screenStartOptions);
//   window.history.pushState(curScrName, '', appScreens[curScrName].path);
// }

// function setScreenTitle(appScreen) {
//   document.title = appScreen.title ? appScreen.title+' - '+appTitle : appTitle;
// }

// function setAppNavItemAsSelected(screenName) {
//   let screen = appScreens[screenName];
//   let items = document.querySelectorAll('.app-nav-item');
//   for (let item of items) {
//     if (item.classList.contains('app-nav-item-selected')) item.classList.remove('app-nav-item-selected');
//   }
//   let curItem = document.querySelector(`[data-screen="${screenName}"]`);

//   if (screen.path!=='/' && curItem!=null) curItem.classList.add('app-nav-item-selected');
// }
