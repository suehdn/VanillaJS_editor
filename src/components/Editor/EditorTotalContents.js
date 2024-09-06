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
            (newState.content || prevContent)?.replace(
              /data-placeholder=".*?"/,
              ""
            )
          );
          store_pages.dispatch(setPAGES({ pages }));
          console.log("문서 업데이트됨:", {
            title: newState.title,
            content: (newState.content || prevContent)?.replace(
              /data-placeholder=".*?"/,
              ""
            ),
          });
        }, "Error get document structure EditorTotalContents");
        this.currentTitle = newState.title || prevTitle;
        this.currentContents = newState.content || prevContent;
        // console.log("currentTitle", this.currentTitle);
        // console.log("currentContents", this.currentContents);
      }
    };
    this.debounceSetInput = debounce(this.setInput, this.debounceTime);
    this.toolbar = setToolbar();
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
  newDiv.setAttribute("draggable", "true");
  newDiv.innerHTML = `<span class="material-symbols-rounded editor__content--drag"> drag_indicator </span>
      <div name="content" contentEditable="true" class = "editor__input--content">${textAfter}</div>`;

  const selection = $target.querySelector(".editor__content");
  const index = [...selection.childNodes].indexOf(parentNode);
  selection.insertBefore(newDiv, selection.children[index + 1] || null);

  const newContent = newDiv.querySelector(".editor__input--content");
  newContent.focus();
  return currentDiv.classList.contains("editor__input--title") && textBefore;
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
    newDiv.setAttribute("draggable", "true");
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
    title: prevDiv.classList.contains("editor__input--title")
      ? prevDiv.textContent
      : currentTitle,
    content: newContent,
  });
  return [
    prevDiv.classList.contains("editor__input--title")
      ? prevDiv.textContent
      : currentTitle,
    newContent,
  ];
};

const getDragAfterElement = (container, y) => {
  const draggableElements = [
    ...container.querySelectorAll(".editor__content--container:not(.dragging)"),
  ];
  return draggableElements.reduce(
    (closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;
      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child };
      } else {
        return closest;
      }
    },
    { offset: Number.NEGATIVE_INFINITY }
  ).element;
};

const setToolbar = () => {
  const toolbar = document.createElement("div");
  toolbar.className = "editor__toolbar";
  toolbar.innerHTML = `
      <button class="editor__toolbar--button" id="boldBtn">
        <span class="material-symbols-rounded">format_bold</span>
      </button>
      <button class="editor__toolbar--button" id="italicBtn">
        <span class="material-symbols-rounded">format_italic</span>
      </button>
      <button class="editor__toolbar--button" id="underlineBtn">
        <span class="material-symbols-rounded">format_underlined</span>
      </button>
      <button class="editor__toolbar--button" id="strikethroughBtn">
        <span class="material-symbols-rounded">format_strikethrough</span>
      </button>
    `;
  document.body.appendChild(toolbar);

  document.getElementById("boldBtn").addEventListener("click", (e) => {
    e.preventDefault();
    formatText("bold");
  });
  document.getElementById("italicBtn").addEventListener("click", (e) => {
    e.preventDefault();
    formatText("italic");
  });
  document.getElementById("underlineBtn").addEventListener("click", (e) => {
    e.preventDefault();
    formatText("underline");
  });
  document.getElementById("strikethroughBtn").addEventListener("click", (e) => {
    e.preventDefault();
    formatText("strikethrough");
  });

  const formatText = (tagName) => {
    const selection = window.getSelection();
    console.log("selection", selection);
    if (!selection.isCollapsed) {
      const range = selection.getRangeAt(0);
      const selectedText = range.toString();

      const startNode = range.startContainer;
      const endNode = range.endContainer;

      const alreadySpan = startNode.nodeName.toLowerCase() === "span";

      // 각각의 부모 노드를 확인합니다.
      const startParent = startNode.parentNode;
      const endParent = endNode.parentNode;

      // console.log(
      //   startNode.parentNode.querySelector(".editor__input--content")
      // );
      console.log("startNode:", startNode.nodeName, startNode); // 선택 시작 노드
      console.log("endNode:", endNode); // 선택 끝 노드
      console.log("startParent:", startParent.nodeName, startParent); // 선택 끝 노드
      console.log("endParent:", endParent);
      console.log("selectedText:", selectedText);
      console.log("---------");

      const newNode = alreadySpan ? startNode : document.createElement("span");

      console.log("span?:", startNode.nodeName.toLowerCase() === "span");

      switch (tagName) {
        case "bold":
          if (newNode.style.fontWeight === "bold") {
            newNode.style.fontWeight = "";
          } else {
            newNode.style.fontWeight = "bold";
          }

          break;
        case "italic":
          if (newNode.style.fontStyle === "italic") {
            newNode.style.fontStyle = "";
          } else {
            newNode.style.fontStyle = "italic";
          }
          break;
        case "underline":
          if (newNode.style.textDecorationLine === "underline") {
            newNode.style.textDecorationLine = "";
          } else if (
            newNode.style.textDecorationLine === "underline line-through"
          ) {
            newNode.style.textDecorationLine = "line-through";
          } else {
            if (newNode.style.textDecorationLine === "line-through") {
              newNode.style.textDecorationLine = "underline line-through"; // 둘 다
            } else {
              newNode.style.textDecorationLine = "underline"; // 밑줄
            }
          }
          break;
        case "strikethrough":
          if (newNode.style.textDecorationLine === "line-through") {
            newNode.style.textDecorationLine = "";
          } else if (
            newNode.style.textDecorationLine === "underline line-through"
          ) {
            newNode.style.textDecorationLine = "underline";
          } else {
            if (newNode.style.textDecorationLine === "underline") {
              newNode.style.textDecorationLine = "underline line-through"; // 둘 다
            } else {
              newNode.style.textDecorationLine = "line-through"; // 취소선
            }
          }
          break;
        default:
          break;
      }

      if (!alreadySpan) {
        newNode.textContent = selectedText;

        range.deleteContents(); // 선택된 텍스트 삭제
        range.insertNode(newNode); // 새 노드 삽입

        //기존에 선택되었던 드래그 범위가 재정의 되는 문제 해결
        const selectionRange = document.createRange();
        selectionRange.selectNodeContents(newNode); // 새 노드를 선택
        selection.removeAllRanges(); // 기존 선택 범위 제거
        selection.addRange(selectionRange); // 새 범위를 추가
      }
      newNode.focus();
    }
  };
  return toolbar;
};
