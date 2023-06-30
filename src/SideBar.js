import { push } from './router.js';

/**
 * SideBar를 만들어주는 컴포넌트
 */
export default class SideBar {
    constructor({ $target, initialState }) {
        this.$target = $target;
        this.state = initialState;
        this.makeSideBar();
    }

    makeSideBar() {
        const $page = document.createElement('aside');
        $page.className = 'sidebar__aside--flex'
        const $filePage = document.createElement('section');
        $page.appendChild($filePage);
        this.$target.appendChild($page);

        $filePage.insertAdjacentHTML('beforeend', this.printFile(this.state));
        $filePage.addEventListener('click', (e) => {
            const $summary = e.target.closest('.filePage__text--page-summary');
            if ($summary) {
                const { id } = $summary.dataset;
                push(`/posts/${id}`);
            }
        })
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
                <span class = "filePage__text--white-space">  </span>
                <details>
                    <summary>
                        <span class = "filePage__text--page-summary" data-id=${child.id}>${child.title}</span>
                        <div class = "filePage__button">
                            <button class = "filePage__button--delete">🗑️</button>
                            <button class = "filePage__button--add">➕</button>
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

}