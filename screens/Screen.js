export class Screen {

  name;
  start;

  // navName;
  // title;
  // htmlUrl;
  
  constructor(options) {
    if (!'name' in options || !'start' in options) {
      throw 'missing screen options';
    }
    for (let optName in options) this[optName] = options[optName];
  }
}
