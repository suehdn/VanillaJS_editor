export default class Editor {
    constructor({ $target, initialstate }) {
        this.$target = $target;
        this.state = initialstate;
        this.makeEditor();
    }

    makeEditor() {
        const $editor = document.createElement('div');
        $editor.className = 'editor__div--flex'
        this.$target.appendChild($editor);

        $editor.innerHTML = `<p>jiji</p>`
    }
}