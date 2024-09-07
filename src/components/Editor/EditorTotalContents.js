import Data from "@/data";
import { setPAGES, store_pages, store_currentContents } from "@stores";
import { Component } from "@core";
import {
  debounce,
  executeWithTryCatch,
  setCaretOffset,
  setCaretAtEnd,
  saveCursor,
  lastCursor,
  appendDiv,
  separateDiv,
  getDragAfterElement,
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
            newState.title === undefined ? prevTitle : newState.title,
            (newState.content || prevContent)?.replace(
              /data-placeholder=".*?"/,
              ""
            )
          );
          store_pages.dispatch(setPAGES({ pages: pages.data }));
          // console.log("문서 업데이트됨:", {
          //   title: newState.title === undefined ? prevTitle : newState.title,
          //   content: (newState.content || prevContent)?.replace(
          //     /data-placeholder=".*?"/,
          //     ""
          //   ),
          // });
        }, "Error get document structure EditorTotalContents");
        this.currentTitle = newState.title || prevTitle;
        this.currentContents = newState.content || prevContent;
        // console.log("currentTitle", this.currentTitle);
        // console.log("currentContents", this.currentContents);
      }
    };
    this.debounceSetInput = debounce(this.setInput, this.debounceTime);
    this.toolbar = document.querySelector("#toolbar");

    store_currentContents.subscribe(() => {
      this.debounceSetInput({
        title: this.currentTitle,
        content: store_currentContents.getState().currentContents,
      });
    });
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
          `<div class = "editor__content--container" draggable="true">`+
            `<span class="material-symbols-rounded editor__content--drag"> drag_indicator </span>`+
            `<div name="content" contentEditable="true" class = "editor__input--content">${this.state.totalContents.content || ""}</div>`+
          `</div>`+
        `</div>`;
  }

  mounted() {
    this.currentTitle = this.state.totalContents.title;
    this.currentContents = this.state.totalContents.content;
    this.debounceSetInput({
      title: this.currentTitle,
      content: this.currentContents,
    });
  }

  setEvent() {
    this.currentPlaceholderElement = null;
    this.addEvent("keydown", "[name=title]", (e) => {
      const caretOffset = setCaretOffset();

      if (e.key === "Enter") {
        e.preventDefault();
        const currentDiv = e.target;
        this.currentTitle =
          separateDiv(
            currentDiv,
            caretOffset,
            this.$target,
            e.target.parentNode
          ) || this.currentTitle;
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
            this.currentTitle =
              separateDiv(
                currentDiv,
                caretOffset,
                this.$target,
                e.target.parentNode
              ) || this.currentTitle;
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
            setTimeout(() => {
              prevDiv.focus();
              setCaretAtEnd(prevDiv);
            }, 0);
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
            setTimeout(() => {
              prevDiv.focus();
              setCaretAtEnd(prevDiv);
            }, 0);
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

    this.addEvent("dragstart", ".editor__content--container", (e) => {
      e.target.classList.add("dragging");
    });

    this.addEvent("dragend", ".editor__content--container", (e) => {
      e.target.classList.remove("dragging");
    });

    this.addEvent("dragover", ".editor__content--container", (e) => {
      e.preventDefault();
      e.stopPropagation();
      let parentNode = e.target.parentNode;
      const afterElement = getDragAfterElement(parentNode, e.clientY);
      const dragging = document.querySelector(".dragging");

      if (!dragging) return;

      if (afterElement) {
        parentNode.insertBefore(dragging, afterElement);
      } else {
        const grandparentNode = parentNode.parentNode;
        if (parentNode.classList.contains("editor__content--container")) {
          const parentIndex = [...grandparentNode.childNodes].indexOf(
            parentNode
          );
          const draggingIndex = [...grandparentNode.childNodes].indexOf(
            dragging
          );
          if (parentIndex >= grandparentNode.children.length - 1) {
            grandparentNode.appendChild(
              grandparentNode.children[draggingIndex]
            );
          }
          grandparentNode.insertBefore(
            grandparentNode.children[draggingIndex],
            grandparentNode.children[parentIndex]
          );
        }
        parentNode = grandparentNode;
      }
      const contentDivs = parentNode.querySelectorAll(
        ".editor__input--content"
      );
      const newContent = Array.from(contentDivs)
        .map((div) => {
          return `${div.parentNode.outerHTML}`;
        })
        .join("")
        .replace(/dragging/, "");
      this.debounceSetInput({
        title: this.currentTitle,
        content: newContent,
      });
      this.currentContents = newContent;
    });

    this.addEvent("mouseup", ".editor__content", (e) => {
      const selection = window.getSelection();
      if (!selection.isCollapsed) {
        const box = selection.getRangeAt(0).getBoundingClientRect();
        const toolbarTop = box.top - 45;
        const toolbarLeft = box.left;
        this.toolbar.style.top = `${toolbarTop}px`;
        this.toolbar.style.left = `${toolbarLeft}px`;
        this.toolbar.style.display = "flex";
      } else {
        this.toolbar.style.display = "none";
      }
    });
    document.addEventListener("mousedown", (e) => {
      const isClickInsideEditor = e.target.closest(".editor__content") !== null;
      const isClickInsideToolbar = this.toolbar.contains(e.target);

      if (!isClickInsideEditor && !isClickInsideToolbar) {
        this.toolbar.style.display = "none";
      }
    });
  }
}
