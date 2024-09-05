import Data from "@/data";
import { setPAGES, store_pages } from "@stores";
import { Component } from "@core";
import { debounce, executeWithTryCatch, saveCursor, lastCursor } from "@utils";

export default class EditorTotalContents extends Component {
  setup() {
    this.data = new Data();
    this.state = { ...this.props };
    this.debounceTime = 300;
    console.log("initial", this.state.totalContents);
    this.setInput = async (newState) => {
      console.log("currentTitle", this.currentTitle);
      console.log("currentContents", this.currentContents);
      const prevTitle = this.state.totalContents.title;
      const prevContent = this.state.totalContents.content;
      console.log("this.state.totalContents ::::", prevTitle, prevContent);
      console.log("newState", newState);

      if (newState.title !== prevTitle || newState.content !== prevContent) {
        await executeWithTryCatch(async () => {
          const pages = await this.data.editDocument(
            this.state.current_documentId,
            newState.title,
            newState.content || prevContent
          );
          store_pages.dispatch(setPAGES({ pages }));
          console.log("문서 업데이트됨:", {
            title: newState.title,
            content: newState.content || prevContent,
          });
        }, "Error get document structure EditorTotalContents");
        this.currentTitle = newState.title || prevTitle;
        this.currentContents = newState.content || prevContent;
        console.log("currentTitle", this.currentTitle);
        console.log("currentContents", this.currentContents);
      }
    };
    this.debounceSetInput = debounce(this.setInput, this.debounceTime);
  }
  //prettier-ignore
  template() {
    let editor = `<div name="title" contentEditable="true" data-placeholder = "제목 없음" class = "editor__input--title">${this.state.totalContents.title}</div>`+
                `<div class = "editor__content">`;
    if(this.state.totalContents.content) {
      editor += this.state.totalContents.content + `</div>`;
      return editor;
    }
    return editor +
          `<div class = "editor__content--container">`+
            `<span class="material-symbols-rounded editor__content--drag"> drag_indicator </span>`+
            `<div name="content" contentEditable="true" class = "editor__input--content">${this.state.totalContents.content || ""}</div>`+
          `</div>`+
        `</div>`;
  }

  mounted() {
    this.currentTitle = this.state.totalContents.title;
    this.currentContents = this.state.totalContents.content;
  }

  setEvent() {
    this.currentPlaceholderElement = null;
    this.addEvent("keyup", "[name=title]", (e) => {
      console.log("방향키 인식됨 타이틀:수정요망");
      if (this.currentTitle !== e.target.textContent) {
        this.currentTitle = e.target.textContent;
        this.currentContents = this.state.totalContents.content;
        this.debounceSetInput({
          title: e.target.textContent,
          content: this.currentContents,
        });
      }
    });

    this.addEvent("keyup", ".editor__input--content", (e) => {
      console.log("방향키 인식됨 컨텐츠 :수정요망");
      const contentDivs = this.$target.querySelectorAll(
        ".editor__input--content"
      );
      const newContent = Array.from(contentDivs)
        .map((div) => {
          return `${div.parentNode.outerHTML}`;
        })
        .join("");
      if (this.currentContents !== newContent) {
        this.currentContents = newContent;
        this.debounceSetInput({
          title: this.currentTitle,
          content: newContent,
        });
      }
    });

    this.addEvent("keydown", ".editor__content", (e) => {
      const contentDivs = this.$target.querySelectorAll(
        ".editor__input--content"
      );
      const currentDiv = e.target;
      const index = Array.from(contentDivs).indexOf(currentDiv);

      const selection = window.getSelection();
      const range = selection.getRangeAt(0);
      const caretOffset = range.startOffset;

      switch (e.key) {
        case "Enter":
          if (e.shiftKey) {
            return;
          } else {
            e.preventDefault();
            const newDiv = document.createElement("div");
            newDiv.classList.add("editor__content--container");
            newDiv.innerHTML = `<span class="material-symbols-rounded editor__content--drag"> drag_indicator </span>
            <div name="content" contentEditable="true" class = "editor__input--content"></div>`; // 초기 내용 비우기

            const selection = this.$target.querySelector(".editor__content");
            const index = [...selection.childNodes].indexOf(
              e.target.parentNode
            );
            selection.insertBefore(
              newDiv,
              selection.children[index + 1] || null
            );

            const newContent = newDiv.querySelector(".editor__input--content");
            newContent.focus();
          }
          break;
        case "ArrowUp":
          e.preventDefault();
          if (index > 0) {
            const prevDiv = contentDivs[index - 1];
            prevDiv.focus();
            saveCursor(prevDiv, caretOffset);
          }
          break;
        case "ArrowDown":
          e.preventDefault();
          if (index < contentDivs.length - 1) {
            const nextDiv = contentDivs[index + 1];
            nextDiv.focus();
            saveCursor(nextDiv, caretOffset);
          }
          break;
        case "Backspace":
          if (
            currentDiv.textContent.trim() !== "" &&
            caretOffset === 0 &&
            index > 0
          ) {
            e.preventDefault();
            const prevDiv = contentDivs[index - 1];

            if (prevDiv) {
              prevDiv.innerHTML += `${currentDiv.innerHTML}`;
              const currentContentContainer = currentDiv.parentNode;
              currentContentContainer.parentNode.removeChild(
                currentContentContainer
              );
              lastCursor(prevDiv);
            }
          } else if (currentDiv.textContent.trim() === "" && index > 0) {
            e.preventDefault();
            const currentContentContainer = currentDiv.parentNode;
            currentContentContainer.parentNode.removeChild(
              currentContentContainer
            );

            if (index > 0) {
              const prevDiv = contentDivs[index - 1];
              lastCursor(prevDiv);
            }
          }
          break;
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
    this.addEvent("focusout", ".editor__input--content", (e) => {
      if (this.currentPlaceholderElement === e.target) {
        this.currentPlaceholderElement.removeAttribute("data-placeholder");
      }
      this.currentPlaceholderElement = null;
    });
  }
}
