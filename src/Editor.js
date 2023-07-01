export default class Editor {
    constructor({ $target, initialstate = { title: '', content: '' } }) {
        this.$editor = document.createElement('div');
        this.$target = $target;
        this.state = initialstate;
        this.makeEditor();
        this.eventAdd();
    }

    setState = (nextState) => {
        this.state = nextState;
        this.render();
    }

    render() {
        console.log(this.$editor.querySelector('[name=title]').value, this.$editor.querySelector('[name=content]').innerHTML)
        // this.$editor.querySelector('[name=title]').value = this.state.title;
        // this.$editor.querySelector('[name=content]').innerHTML = this.state.content;
    }


    /**
     *  문서 편집기를 만드는 함수
     */
    makeEditor() {
        this.$editor.className = 'editor__div--flex'
        this.$target.appendChild(this.$editor);

        this.$editor.innerHTML = `
            <input name="title" type="text" placeholder = "제목 없음" class = "editor__input"/>
            <div name="content" contentEditable="true" placeholedr = "내용을 입력하세요." class = "editor__content"></div>
        `
    }
    /**
     * 문자를 입력했을 때 입력 받은 문자열을 this.state에 넣어주는 함수
     */
    eventAdd() {
        this.$editor.querySelector('[name=title]').addEventListener('keyup', (e) => {
            const nextState = {
                ...this.state,
                title: e.target.value
            }
            console.log(nextState);
            this.setState(nextState);
        })
        this.$editor.querySelector('[name=content]').addEventListener('input', (e) => {
            const nextState = {
                ...this.state,
                content: e.target.innerHTML
            }
            console.log(nextState);
            this.setState(nextState);
        })
    }
}