import { setIndexedDbUsageInfo } from '../db.js';
import { htmlToNodeList, htmlFileUrlToNodeList } from '../utils.js';

export class App {

  appTitle;
  screens; //array of Screens
  startScreenName;

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
    if (!options?.startScreenName || !options?.appTitle) throw 'missing options';
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
    let currentPath = this.#getCurrentPath();
    
    if (currentPath==='') {
      this.#switchScreen(this.startScreenName);
      window.history.replaceState(this.startScreenName, '', currentPath);
      return;
    }
    
    let urlParams = new URLSearchParams(currentPath.split('?')[1]);
    let curScreenName = urlParams.get('screen');
    let screen = this.screens.find(s=>s.name===curScreenName);

    let options = this.#addUrlParamsToScrStartOptions(currentPath);

    this.#switchScreen(screen, options);
    window.history.replaceState(curScreenName, '', currentPath);
  }

  #getCurrentPath = ()=>window.location.href.split('/')[3];

  #addUrlParamsToScrStartOptions(currentPath) {
    let urlParams = new URLSearchParams(currentPath.split('?')[1]);
    let options = Object.assign(
      {urlParams: Object.fromEntries(urlParams)},
      this.screenStartOptions
    );
    return options;
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

    let currentPath = this.#getCurrentPath();
    let options = this.#addUrlParamsToScrStartOptions(currentPath);

    this.#switchScreen(screen, options);
  }

  navSwitchScreen = (e)=> {
    let curScrName = e.target.dataset.screen;
    let prevScrName = window.history.state;
    if (curScrName===prevScrName) return;
    let screen = this.screens.find(s=>s.name===curScrName);
    this.#switchScreen(screen);
    let path = curScrName===this.startScreenName ? '/' : this.#getScreenBasePath(curScrName);
    window.history.pushState(curScrName, '', path);
  }

  switchToScreen = (screenNameOrObj, startOptions)=> {
    this.#switchScreen(screenNameOrObj, startOptions).then(scr=>{
      let path;
      if (startOptions?.urlParams) {
        let fullParams = Object.assign({screen: scr.name}, startOptions.urlParams);
        path = '?'+new URLSearchParams(fullParams).toString();
      }
      else {
        path = this.#getScreenBasePath(scr.name);
      }
      window.history.pushState(scr.name, '', path);
    });
  }

  #getScreenBasePath = (screenName)=>`?screen=${screenName}`;

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
  
    if (screen.name!==this.startScreenName && curItem!=null) curItem.classList.add('app-nav-item-selected');
  }

  #setAppNav() {
    let logo = document.querySelector('#app-logo');
    logo.innerHTML = this.appTitle;
    logo.dataset.screen = this.startScreenName;
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
