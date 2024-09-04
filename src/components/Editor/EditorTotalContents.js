import Data from "@/data";
import { setPAGES, store_pages } from "@stores";
import { Component } from "@core";
import { debounce, executeWithTryCatch } from "@utils";

export default class EditorTotalContents extends Component {
  setup() {
    this.data = new Data();
    this.state = { ...this.props };
    this.currentTitle = this.props.totalContents.title;
    this.currentContents = this.props.totalContents.content;
    this.setInput = async (newState) => {
      const prevTitle = this.props.title;
      const prevContent = this.props.content;

      if (newState.title !== prevTitle || newState.content !== prevContent) {
        await executeWithTryCatch(async () => {
          const pages = await this.data.editDocument(
            this.state.current_documentId,
            newState.title || prevTitle,
            newState.content || prevContent
          );
          store_pages.dispatch(setPAGES({ pages }));
          console.log("문서 업데이트됨:", {
            title: newState.title || prevTitle,
            content: newState.content || prevContent,
          });
        }, "Error get document structure EditorTotalContents");
      }
    };
    this.debounceSetInput = debounce(this.setInput, 1000);
    console.log(this.state.totalContents);
  }

  template() {
    return `
      <input name="title" type="text" placeholder = "제목 없음" class = "editor__input--title" value = "${
        this.state.totalContents.title
      }"/>
      <div class = "editor__content">
        <div class = "editor__content--container">
          <span class="material-symbols-rounded editor__content--drag"> drag_indicator </span>
          <div name="content" contentEditable="true" data-placeholder = "글을 자유롭게 작성하세요. 명령어를 사용하려면 '/' 키를 누르세요." class = "editor__input--content">${
            this.state.totalContents.content || ""
          }</div>
        </div>
      </div>
      `;
  }

  setEvent() {
    this.currentPlaceholderElement = null;

    this.addEvent("keyup", "[name=title]", (e) => {
      if (this.currentTitle !== e.target.value) {
        this.currentTitle = e.target.value;
        this.debounceSetInput({ title: e.target.value });
      }
    });

    this.addEvent("keydown", ".editor__content", (e) => {
      console.log(e.key);
      if (e.key === "Enter") {
        if (e.shiftKey) {
          return;
        } else {
          e.preventDefault();
          const newDiv = document.createElement("div");
          newDiv.classList.add("editor__content--container");
          newDiv.innerHTML = `<span class="material-symbols-rounded editor__content--drag"> drag_indicator </span>
          <div name="content" contentEditable="true" class = "editor__input--content"></div>`; // 초기 내용 비우기

          const selection = this.$target.querySelector(".editor__content");
          selection.appendChild(newDiv);

          const newContent = newDiv.querySelector(".editor__input--content");
          newContent.focus();
        }
      }
    });

    this.addEvent("focusin", ".editor__input--content", (e) => {
      if (this.currentPlaceholderElement === e.target) return;
      if (this.currentPlaceholderElement) {
        this.currentPlaceholderElement.removeAttribute("data-placeholder");
      }
      e.target.setAttribute(
        "data-placeholder",
        "글을 자유롭게 작성하세요. 명령어를 사용하려면 '/' 키를 누르세요."
      );
      this.currentPlaceholderElement = e.target;
    });
  }

  mounted() {
    const inputTitle = this.$target.querySelector("[name=title]");
    inputTitle.value = this.state.totalContents.title;
  }
}
