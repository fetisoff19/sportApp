export class ButtonComponent {
    //status (string) используем для изменения состояния кнопки
    //elem - элемент для привязки кнопки
    constructor(text, f, status, options) {
        let btn = document.createElement('button')
        btn.classList.add('button', text, status);
        btn.innerText = text;
        btn.addEventListener('click', (e) => f(e, options))

        this.options = status;
        this.btn = btn;
        this.text = text;
     }

    addAppend(elem) {
        elem.append(this.btn);
    }
}
