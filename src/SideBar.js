import { push } from "./router.js";
import Data from "./data.js";
import { setItem, getItem } from "./storage.js";
import { SideBarHeader } from "@components";
/**
 * SideBar를 만들어주는 컴포넌트
 */
export default class SideBar {
  constructor({ $target, initialState, editorsetState }) {
    this.$page = document.createElement("aside");
    this.$filePage = document.createElement("section");
    this.sideBarHeader = new SideBarHeader({ $target: this.$page });
    this.$filePage.className = "sidebar__section--file";
    this.$target = $target;
    this.data = new Data();
    this.postLocalSavekey = "";
    this.editorsetState = editorsetState;
    this.selectedFileId = getItem("highlight", { id: "" }).id;
    this.timer = null;
    this.state = initialState;
    this.render();
    this.eventAdd();
    this.detailMap = new Map();
    this.detail = getItem("detail", this.setDetail()).detail;
    if (this.detail) {
      if (this.detail.length) {
        this.detail.map((x) => {
          this.detailMap.set(x.id, x.opend);
        });
      } else {
        this.detailMap.set(this.detail.id, this.detail.opend);
      }
    }
  }
  setDetail() {
    return window.detail
      ? window.detail.length
        ? {
            detail: [...window.detail].map((x) => ({
              id: x.dataset.id,
              opend: x.open,
            })),
          }
        : {
            detail: { id: window.detail.dataset.id, opend: window.detail.open },
          }
      : { detail: null };
  }

  setState = (nextState) => {
    if (nextState.postId) {
      this.data.getDocumentContent(nextState.postId).then((x) => {
        this.state = {
          ...this.state,
          postId: nextState.postId,
        };
        this.postLocalSavekey = `temp-post-${this.state.postId}`;
        this.editorsetState(x);
      });
    } else {
      this.state = {
        ...this.state,
        ...nextState,
      };
    }
    this.render();
  };
  render() {
    // console.log("사이드바 렌더링");
    this.$page.className = "sidebar__aside--flex";
    this.$page.appendChild(this.$filePage);
    this.$target.appendChild(this.$page);
    this.$filePage.innerHTML = `
            <div class = "filePage__page">
                ${this.printFile(this.state.list)}
            </div>
        `;
    // console.log("Rendered SideBar:", this.$target.innerHTML); // append 후 확인
  }
  /**
   * 파일을 토글 버튼으로 하위항목까지 보여주도록 만들어주는 DOM을 생성하는 함수
   * @param {*} parent 상위 파일 객체
   * @param {*} detail 파일 토글버튼 생성 HTML
   */
  printFile(parent, detail = "") {
    let opend = false;
    if (parent.length) {
      parent.map((child) => {
        if (this.detailMap !== undefined) {
          opend = this.detailMap.get(String(child.id));
        }
        detail += `
                    <details id = "detail" class = "detail" data-id=${
                      child.id
                    } ${opend ? "open" : ""}>
                        <summary>
                            <div class = ${
                              this.selectedFileId == child.id
                                ? "filePage__summary--highlight"
                                : "filePage__summary"
                            }>
                                <img src="../png/file_text_icon.png">
                                <span class = "filePage__text--page-summary" data-id=${
                                  child.id
                                }>&nbsp;${child.title}</span>
                                <div class = "filePage__button">
                                    <button class = "filePage__button--delete" data-id=${
                                      child.id
                                    }><img src="../png/trash_2_icon.png"></button>
                                    <button class = "filePage__button--add" data-id=${
                                      child.id
                                    }><img src="../png/plus_add_icon.png"></button>
                                </div>
                            </div>
                        </summary>
                `;
        detail = this.printFile(child.documents, detail);
        detail += `
                    </details></br>`;
      });
    } else {
      detail += `<span class = "filePage__text--empty">  하위 항목 없음</span>`;
    }
    return detail;
  }
  /**
   *  클릭했을때 동작을 add 해주는 함수
   */
  eventAdd() {
    this.$filePage.onclick = async (e) => {
      const $detail = e.target.closest(".detail");
      const $summary = e.target.closest(".filePage__text--page-summary");
      const $delete = e.target.closest(".filePage__button--delete");
      const $add = e.target.closest(".filePage__button--add");
      if ($summary) {
        const { id } = $summary.dataset;
        this.setState({ postId: id });
        push(`/documents/${id}`);
        this.highlight(id);
        this.setState({});
      } else if ($delete) {
        const { id } = $delete.dataset;
        await this.data.deleteDocumentStructure(id);
        this.data.getDocumentStructure().then((x) => {
          this.setState({ list: x });
          this.detail = this.setDetail().detail;
          this.detailMap.delete(id);
          setItem("detail", {
            detail: this.detail,
          });
        });
      } else if ($add) {
        const { id } = $add.dataset;
        await this.data.addDocumentStructure(id).then((x) => {
          push(`/documents/${x.id}`);
          this.highlight(x.id);
        });
        await this.data.getDocumentStructure().then((x) => {
          this.setState({ list: x });
          this.detail = this.setDetail().detail;
          if (this.detail.length) {
            this.detail.map((x) => {
              this.detailMap.set(x.id, x.opend);
            });
          } else {
            this.detailMap.set(this.detail.id, this.detail.opend);
          }

          setItem("detail", {
            detail: this.detail,
          });
        });
      } else if ($detail) {
        const { id } = $detail.dataset;
        if (this.detail.length) {
          this.detail.map((x, i) => {
            if (x.id === id) {
              if (window.detail[i].open) {
                this.detail[i]["opend"] = false;
              } else {
                this.detail[i]["opend"] = true;
              }
            }
            this.detailMap.set(x.id, x.opend);
          });
        } else {
          if (window.detail.open) {
            this.detail["opend"] = false;
          } else {
            this.detail["opend"] = true;
          }
          this.detailMap.set(this.detail.id, this.detail.opend);
        }
        setItem("detail", {
          detail: this.detail,
        });
      }
    };
  }
  /**
   * 선택한 페이지 highlight해주는 함수
   * @param {*} id
   */
  highlight(id) {
    if (this.selectedFileId) {
      this.selectedFileId = id;
    }
    this.selectedFileId = id;
    setItem("highlight", {
      id: id,
    });
  }
}
