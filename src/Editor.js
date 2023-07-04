

export default class Editor {
    constructor({ $target, initialstate = { title: null, content: null }, onEditing }) {
        console.log(initialstate)
        this.$editor = document.createElement('div');
        this.$target = $target;
        this.state = initialstate;
        this.timer = null;
        this.postLocalSavekey = '';
        this.onEditing = onEditing;
        console.log(typeof this.onEditing)
        console.log(this.state)
        this.makeEditor();
        this.eventAdd();
    }

    setState = (nextState) => {
        this.state = nextState;
        console.log(this.state)
        this.render();
    }

    render() {
        console.log("render")
        this.makeEditor();
        // console.log(this.$editor.querySelector('[name=title]').value, this.$editor.querySelector('[name=content]').innerHTML)
        // this.$editor.querySelector('[name=title]').value = this.state.title;
        // this.$editor.querySelector('[name=content]').innerHTML = this.state.content;
    }


    /**
     *  문서 편집기를 만드는 함수
     */
    makeEditor() {
        if (this.state.title) {
            this.$editor.className = 'editor__div--flex'
            this.$target.appendChild(this.$editor);

            this.$editor.innerHTML = `
                <input name="title" type="text" placeholder = "제목 없음" class = "editor__input" value = "${this.state.title}"/>
                <div name="content" contentEditable="true" placeholedr = "내용을 입력하세요." class = "editor__content">${this.state.content}</div>
            `
            this.eventAdd();
        } else {
            this.$editor.className = 'editor__div--flex';
            this.$target.appendChild(this.$editor);
            this.$editor.innerHTML = `
                <input name="title" type="text" class = "editor__input" disabled/>
                <div name="content" contentEditable="false" placeholedr = "내용을 입력하세요." class = "editor__main--content">Hyesu님의 Notion입니다.</br>자유롭게 문서를 작성해보세요!</div>
            `
        }

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
            this.onEditing(nextState);
        })
        this.$editor.querySelector('[name=content]').addEventListener('input', (e) => {
            const nextState = {
                ...this.state,
                content: e.target.innerHTML
            }
            this.onEditing(nextState);
        })
    }
}
