import { Screen } from './Screen.js';
const page = `
<h1>Добро пожаловать</h1>
<div id="container" style="width:100%; height:400px; margin:0 auto"></div>
`
export const startScreen = new Screen({
  name: 'startScreen',
  start: startStartScreen,
  path: "/",
  html: page,
});

function startStartScreen() {

}

