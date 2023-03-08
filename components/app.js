import { setIndexedDbUsageInfo } from '../db.js';
import { htmlToNodeList, htmlFileUrlToNodeList } from '../utils.js';

export class App {

  appTitle;
  screens; //array of Screens

  screenContainer;
  screenStartOptions = {};

  static template = `
  <header class="app-header">
    <span class="app-logo" id="app-logo">sportsApp</span>
    <nav id="app-nav" class="app-nav"></nav>
  </header>
  <main id="appScreenContainer">
  </main>
  <footer class="app-footer">
    <span id="indexedDbUsage"></span>
  </footer>
  `;

  constructor(options) {
    for (let optName in options) this[optName] = options[optName];
  }

  start() {
    const templateNodes = htmlToNodeList(App.template);
    document.body.append(...templateNodes);

    this.screenContainer = document.querySelector('#appScreenContainer');
    this.screenStartOptions.container = this.screenContainer;
    this.screenStartOptions.app = this;

    // добавить применение польз. настроек
    window.addEventListener('popstate', this.browserNavSwitchScreen);
    this.#setAppNav();
    setIndexedDbUsageInfo();
    let currentPath = window.location.href.split('/')[3];
    if (currentPath==='') currentPath = '/';
    for (let screen of this.screens) {
      if (screen.path!==currentPath) continue;
      this.#switchScreen(screen);
      window.history.replaceState(screen.name, '', screen.path);
      break;
    }
  }

  async #switchScreen(screen, startOptions=this.screenStartOptions) {
    if (typeof arguments[0] === 'string') {
      screen = this.screens.find(s=>s.name===screen);
    }
    this.#setScreenTitle(screen);
    this.#setAppNavItemAsSelected(screen);
    this.screenContainer.replaceChildren();
    this.screenContainer.className='';
    await this.#addHtmlToScreen(screen);
    screen.start(startOptions);
    return screen;
  }

  async #addHtmlToScreen(screen) {
    let nodeList;
    if ('html' in screen) {
      nodeList = htmlToNodeList(screen.html);
    } else 
    if ('htmlUrl' in screen) {
      nodeList =  await htmlFileUrlToNodeList(screen.htmlUrl);
    } else return;
    this.screenContainer.replaceChildren(...nodeList);
  }

  browserNavSwitchScreen = ()=> {
    let curScrName = window.history.state;
    let screen = this.screens.find(s=>s.name===curScrName);
    this.#switchScreen(screen);
  }

  navSwitchScreen = (e)=> {
    let curScrName = e.target.dataset.screen;
    let prevScrName = window.history.state;
    if (curScrName===prevScrName) return;
    let screen = this.screens.find(s=>s.name===curScrName);
    this.#switchScreen(screen);
    window.history.pushState(curScrName, '', screen.path);
  }

  switchToScreen = (screenNameOrObj, startOptions)=> {
    this.#switchScreen(screenNameOrObj, startOptions).then(scr=>{
      window.history.pushState(scr.name, '', scr.path);
    });
  }

  #setScreenTitle(screen) {
      document.title = screen.title ? 
      screen.title+' - '+this.appTitle : 
      this.appTitle;
    }

  #setAppNavItemAsSelected(screen) {
    let items = document.querySelectorAll('.app-nav-item');
    for (let item of items) {
      if (item.classList.contains('app-nav-item-selected')) item.classList.remove('app-nav-item-selected');
    }
    let curItem = document.querySelector(`[data-screen="${screen.name}"]`);
  
    if (screen.path!=='/' && curItem!=null) curItem.classList.add('app-nav-item-selected');
  }

  #setAppNav() {
    let logo = document.querySelector('#app-logo');
    logo.innerHTML = this.appTitle;
    logo.dataset.screen = 'startScreen';
    logo.addEventListener('click', this.navSwitchScreen);
    let nav = document.querySelector('#app-nav');
    for (let screen of this.screens) {
      if (!('navName' in screen)) continue;
      let menuItem = document.createElement('button');
      menuItem.innerHTML = screen.navName;
      menuItem.dataset.screen = screen.name;
      menuItem.className = 'app-nav-item';
      menuItem.addEventListener('click', this.navSwitchScreen); //pointerdown?
      nav.appendChild(menuItem);
    }
  }

};
