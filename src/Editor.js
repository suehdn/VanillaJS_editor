export default class Editor {
    constructor({ $target, initialstate }) {
        this.$editor = document.createElement('div');
        this.$target = $target;
        this.state = initialstate;
        this.makeEditor();
    }

    makeEditor() {
        this.$editor.className = 'editor__div--flex'
        this.$target.appendChild(this.$editor);

        this.$editor.innerHTML = `
            <input name="title" type="text" placeholder = "제목 없음" class = "editor__input"/>
            <div name="content" contentEditable="true" placeholedr = "내용을 입력하세요." class = "editor__content"></div>
        `
    }
}