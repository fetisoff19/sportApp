export class FormComponent {
  constructor(...classes) {
    let form = document.createElement('form');
    let label = document.createElement('label');
    let div = document.createElement('div');

    form.classList.add('form',...classes);
    div.classList.add('form-container');

    form.append(label, div);

    this.div = div;
    this.label = label;
    this.form = form;
  }

  addBtn(...buttons) {
    this.label.append(...buttons);
  }

  addElements(...elements) {
    this.div.append(...elements);
  }

  setLabelText(text) {
    this.label.innerHTML = text;
  }

  addAppend(elem) {
    elem.append(this.form);
  }

  addAfter(elem) {
    elem.after(this.form);
  }
}

