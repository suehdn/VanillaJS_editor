//해야할 작업
// 1. sidebar의 file name과 추가 삭제버튼 위치 css flex로 변경하기 
// 2. 페이지 추가,삭제하면 열려있던 토글이 닫힌채로 전부 렌더링 되는 현상 발생.. -> 어떻게 해결?
// 3. 전부 삭제했을 때 페이지 3000/ 으로 이동
// 4. 뒤로가기 누르면 렌더링 다시...
// 5. 페이지 안에 하위 페이지 넣기
// 6. 검색기능 있으면 좋을듯(이전에 구현했던 자동완성기능 응용하면 될것같다!) ****
// 7. 스타일 지정.. 하면 좋은데...


import { push } from './router.js';
import Data from './data.js';
import { setItem, getItem } from './storage.js';
/**
 * SideBar를 만들어주는 컴포넌트
 */
export default class SideBar {
    constructor({ $target, initialState, editorsetState }) {
        this.$page = document.createElement('aside');
        this.$namePage = document.createElement('section');
        this.$filePage = document.createElement('section');
        this.$namePage.className = 'sidebar__section--name';
        this.$namePage.innerHTML = 'Hyesu님의 Notion🥳'
        this.$filePage.className = 'sidebar__section--file';
        this.$page.appendChild(this.$namePage);
        this.$target = $target;
        this.data = new Data();
        this.postLocalSavekey = '';
        this.editorsetState = editorsetState;
        this.selectedFileId;
        this.timer = null;
        this.state = initialState;
        this.render();
        this.eventAdd();
        this.detailMap = new Map();
        console.log(window.detail)
        this.detail = getItem('detail', (window.detail ?
            window.detail.length ? { detail: [...window.detail].map(x => (({ id: x.dataset.id, opend: x.open }))) } : { detail: ({ id: window.detail.dataset.id, opend: window.detail.open }) }
            : { detail: null })).detail;
        this.detail.map(x => { this.detailMap.set(x.id, x.opend) });
    }

    setState = (nextState) => {
        if (nextState.postId) {
            this.data.getDocumentContent(nextState.postId).then(x => {
                this.state = {
                    ...this.state,
                    postId: nextState.postId
                };
                this.postLocalSavekey = `temp-post-${this.state.postId}`;
                this.editorsetState(x);
            })
        } else {
            this.state = {
                ...this.state,
                ...nextState
            }
        }
        this.render();
    }
    render() {
        this.$page.className = 'sidebar__aside--flex'
        this.$page.appendChild(this.$filePage);
        this.$target.appendChild(this.$page);

        this.$filePage.innerHTML = `
            <div class = 'filePage__root-add--add'>         
                <button class = "filePage__button--add" data-id="null"><span class = 'filePage__root-add--add'>새로운 페이지 추가 <img src="../png/square_plus_icon_24.png"></span></button>
            </div>
            <div class = "filePage__page">
                ${this.printFile(this.state.list)}
            </div>
        `
    }

    /**
     * 파일을 토글 버튼으로 하위항목까지 보여주도록 만들어주는 DOM을 생성하는 함수
     * @param {*} parent 상위 파일 객체 
     * @param {*} detail 파일 토글버튼 생성 HTML
     */
    printFile(parent, detail = '') {
        let opend = false;
        if (parent.length) {
            parent.map((child) => {
                if (this.detailMap !== undefined) {
                    opend = this.detailMap.get(String(child.id));
                }
                detail += `
                    <details id = "detail" class = "detail" data-id=${child.id} ${opend ? 'open' : ''}>
                        <summary>
                            <div class = ${this.selectedFileId == child.id ? "filePage__summary--highlight" : "filePage__summary"}>
                                <img src="../png/file_text_icon.png">
                                <span class = "filePage__text--page-summary" data-id=${child.id}>&nbsp;${child.title}</span>
                                <div class = "filePage__button">
                                    <button class = "filePage__button--delete" data-id=${child.id}><img src="../png/trash_2_icon.png"></button>
                                    <button class = "filePage__button--add" data-id=${child.id}><img src="../png/plus_add_icon.png"></button>
                                </div>
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
            const $detail = e.target.closest('.detail');
            const $summary = e.target.closest('.filePage__text--page-summary');
            const $delete = e.target.closest('.filePage__button--delete');
            const $add = e.target.closest('.filePage__button--add');
            if ($summary) {
                const { id } = $summary.dataset;
                this.setState({ postId: id })
                push(`/posts/${id}`);
                this.highlight(id);
                this.setState({});
            }
            else if ($delete) {
                const { id } = $delete.dataset;
                await this.data.deleteDocumentStructure(id);
                this.data.getDocumentStructure().then(x => {
                    this.setState({ list: x });
                    this.detail = { detail: [...window.detail].map(x => (({ id: x.dataset.id, opend: x.open }))) }.detail;
                    this.detail.map(x => { this.detailMap.set(x.id, x.opend) });
                })
            }
            else if ($add) {
                const { id } = $add.dataset;
                await this.data.addDocumentStructure(id).then(x => {
                    console.log(x)
                    push(`/posts/${x.id}`);
                });
                await this.data.getDocumentStructure().then(x => {
                    this.setState({ list: x });
                    console.log(window.detail)
                    this.detail = { detail: [...window.detail].map(x => (({ id: x.dataset.id, opend: x.open }))) }.detail;
                    console.log(this.detail)
                    this.detail.map(x => { this.detailMap.set(x.id, x.opend) });
                })

            }
            else if ($detail) {
                const { id } = $detail.dataset;
                this.detail.map((x, i) => {
                    if (x.id === id) {
                        if (window.detail[i].open) {
                            this.detail[i]['opend'] = false;
                        } else {
                            this.detail[i]['opend'] = true;
                        }
                    }
                })
                setItem('detail', {
                    detail: this.detail,
                })
                console.log(this.detail)
            }
        }
    }

    highlight(id) {
        if (this.selectedFileId) {
            this.selectedFileId = id;
        }
        this.selectedFileId = id;
    }
}