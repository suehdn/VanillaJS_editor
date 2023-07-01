//해야할 작업
// 1. sidebar의 file name과 추가 삭제버튼 위치 css flex로 변경하기 
// 2. 페이지 추가,삭제하면 열려있던 토글이 닫힌채로 전부 렌더링 되는 현상 발생.. -> 어떻게 해결?
// 3. 페이지가 많아지면 스크롤도 넣어야할듯

import { push } from './router.js';
import Data from './data.js';
/**
 * SideBar를 만들어주는 컴포넌트
 */
export default class SideBar {
    constructor({ $target, initialState }) {
        this.$page = document.createElement('aside');
        this.$namePage = document.createElement('section');
        this.$filePage = document.createElement('section');
        this.$target = $target;
        this.state = initialState;
        this.data = new Data();

        this.$namePage.className = 'sidebar__section--name';
        this.$namePage.innerHTML = 'Hyesu님의 Notion🥳'
        this.$page.appendChild(this.$namePage);
        this.render();
        this.eventAdd();
    }

    setState = (nextState) => {
        this.state = nextState;
        this.render();
    }

    render() {
        this.$page.className = 'sidebar__aside--flex'
        this.$page.appendChild(this.$filePage);
        this.$target.appendChild(this.$page);

        this.$filePage.innerHTML = `
            <div class = 'filePage__root-add--add'>         
                <span>새로운 루트 페이지 추가</span>
                <button class = "filePage__button--add" data-id="null">➕</button>
            </div>
            ${this.printFile(this.state)}
        `
    }

    /**
     * 파일을 토글 버튼으로 하위항목까지 보여주도록 만들어주는 DOM을 생성하는 함수
     * @param {*} parent 상위 파일 객체 
     * @param {*} detail 파일 토글버튼 생성 HTML
     */
    printFile(parent, detail = '') {
        if (parent.length) {
            parent.map(child => {
                detail += `
                <details>
                    <summary>
                        <span class = "filePage__text--page-summary" data-id=${child.id}>${child.title}</span>
                        <div class = "filePage__button">
                            <button class = "filePage__button--delete" data-id=${child.id}>🗑️</button>
                            <button class = "filePage__button--add" data-id=${child.id}>➕</button>
                        </div>
                    </summary>
                `
                detail = this.printFile(child.documents, detail)
                detail += `
                    </details></br>`
            })
        } else {
            detail += `<span class = "filePage__text--empty">  하위 항목 없음</span>`
        }
        return detail
    }
    /**
     *  클릭했을때 동작을 add 해주는 함수
     */
    eventAdd() {
        this.$filePage.onclick = async (e) => {
            const $summary = e.target.closest('.filePage__text--page-summary');
            const $delete = e.target.closest('.filePage__button--delete');
            const $add = e.target.closest('.filePage__button--add');
            if ($summary) {
                const { id } = $summary.dataset;
                push(`/posts/${id}`);
            } else {
                if ($delete) {
                    const { id } = $delete.dataset;
                    await this.data.deleteDocumentStructure(id);
                    this.data.getDocumentStructure().then(x => {
                        this.setState(x);
                    })
                }
                else if ($add) {
                    const { id } = $add.dataset;
                    await this.data.addDocumentStructure(id);
                    this.data.getDocumentStructure().then(x => {
                        this.setState(x);
                    })
                }

            }
        }
    }
}