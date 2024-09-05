import Data from "@/data";
import { setPAGES, store_pages } from "@stores";
import { Component } from "@core";
import {
  debounce,
  executeWithTryCatch,
  setCaretOffset,
  saveCursor,
  lastCursor,
} from "@utils";

export default class EditorTotalContents extends Component {
  setup() {
    this.data = new Data();
    this.state = { ...this.props };
    this.debounceTime = 300;
    // console.log("initial", this.state.totalContents);
    this.setInput = async (newState) => {
      // console.log("currentTitle", this.currentTitle);
      // console.log("currentContents", this.currentContents);
      const prevTitle = this.state.totalContents.title;
      const prevContent = this.state.totalContents.content;
      // console.log("this.state.totalContents ::::", prevTitle, prevContent);
      // console.log("newState", newState);

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
        // console.log("currentTitle", this.currentTitle);
        // console.log("currentContents", this.currentContents);
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
    this.addEvent("keydown", "[name=title]", (e) => {
      console.log("방향키 인식됨 타이틀:수정요망");
      const caretOffset = setCaretOffset();

      if (e.key === "Enter") {
        e.preventDefault();
        const currentDiv = e.target;
        this.currentTitle = separateDiv(
          currentDiv,
          caretOffset,
          this.$target,
          e.target.parentNode
        );
      }
    });
    this.addEvent("keyup", "[name=title]", (e) => {
      if (e.key !== "Enter" && this.currentTitle !== e.target.textContent) {
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
      const caretOffset = setCaretOffset();

      switch (e.key) {
        case "Enter":
          if (e.shiftKey) {
            return;
          } else {
            e.preventDefault();
            this.currentTitle = separateDiv(
              currentDiv,
              caretOffset,
              this.$target,
              e.target.parentNode
            );
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
          if (caretOffset === 0 && index > 0) {
            e.preventDefault();
            const currentContentContainer = currentDiv.parentNode;
            const prevDiv = contentDivs[index - 1];
            [this.currentTitle, this.currentContents] = appendDiv(
              currentDiv,
              currentContentContainer,
              prevDiv,
              contentDivs.length,
              this.debounceSetInput,
              this.currentTitle
            );
          } else if (caretOffset === 0 && index === 0) {
            e.preventDefault();
            const currentContentContainer = currentDiv.parentNode;
            const prevDiv =
              currentContentContainer.parentNode.previousElementSibling;
            [this.currentTitle, this.currentContents] = appendDiv(
              currentDiv,
              currentContentContainer,
              prevDiv,
              contentDivs.length,
              this.debounceSetInput,
              this.currentTitle
            );
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
/**
 * 엔터를 입력했을 때 Div를 분리하는 함수
 * @param {*} currentDiv 현재 입력 받고 있는 Div
 * @param {*} caretOffset 커서의 위치
 * @param {*} target ".editor__content"를 가져올 목표 노드
 * @param {*} parentNode currentDiv의 부모 노드
 */
const separateDiv = (currentDiv, caretOffset, $target, parentNode) => {
  const currentText = currentDiv.textContent;
  const textBefore = currentText.slice(0, caretOffset);
  const textAfter = currentText.slice(caretOffset);
  currentDiv.textContent = textBefore;

  const newDiv = document.createElement("div");
  newDiv.classList.add("editor__content--container");
  newDiv.innerHTML = `<span class="material-symbols-rounded editor__content--drag"> drag_indicator </span>
      <div name="content" contentEditable="true" class = "editor__input--content">${textAfter}</div>`;

  const selection = $target.querySelector(".editor__content");
  const index = [...selection.childNodes].indexOf(parentNode);
  selection.insertBefore(newDiv, selection.children[index + 1] || null);

  const newContent = newDiv.querySelector(".editor__input--content");
  newContent.focus();
  return textBefore;
};
/**
 * Backspace를 입력했을 때 Div를 합치는 함수
 * @param {*} currentDiv 현재 입력 받고 있는 Div
 * @param {*} currentContentContainer 커서의 위치의 부모 노드
 * @param {*} prevDiv 현재 노드의 이전 노드 (합치기 원하는 노드)
 * @param {*} length 부모 노드 안의 Div의 총 개수
 */
const appendDiv = (
  currentDiv,
  currentContentContainer,
  prevDiv,
  length,
  debounceSetInput,
  currentTitle
) => {
  const editor_content = currentContentContainer.parentNode;
  if (currentDiv.textContent.trim() === "") {
    currentContentContainer.parentNode.removeChild(currentContentContainer);
    lastCursor(prevDiv);
  } else if (currentDiv.textContent.trim() !== "") {
    if (prevDiv) {
      prevDiv.innerHTML += `${currentDiv.innerHTML}`;
      currentContentContainer.parentNode.removeChild(currentContentContainer);
      lastCursor(prevDiv);
    }
  }

  if (!length) {
    const newDiv = document.createElement("div");
    newDiv.classList.add("editor__content--container");
    newDiv.innerHTML = `<span class="material-symbols-rounded editor__content--drag"> drag_indicator </span>
        <div name="content" contentEditable="true" class = "editor__input--content"></div>`;
    editor_content.appendChild(newDiv);
  }
  const contentDivs = editor_content.querySelectorAll(
    ".editor__input--content"
  );
  const newContent = Array.from(contentDivs)
    .map((div) => {
      return `${div.parentNode.outerHTML}`;
    })
    .join("");
  debounceSetInput({
    title: prevDiv.textContent || currentTitle,
    content: newContent,
  });
  return [prevDiv.textContent || currentTitle, newContent];
};
