import { Component } from "@core";
import { store_currentContents, setCONTENTS } from "@stores";
export default class Toolbar extends Component {
  template() {
    return `
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
  }
  setEvent() {
    this.addEvent("click", "#boldBtn", (e) => {
      e.preventDefault();
      formatText("bold");
    });
    this.addEvent("click", "#italicBtn", (e) => {
      e.preventDefault();
      formatText("italic");
    });
    this.addEvent("click", "#underlineBtn", (e) => {
      e.preventDefault();
      formatText("underline");
    });
    this.addEvent("click", "#strikethroughBtn", (e) => {
      e.preventDefault();
      formatText("strikethrough");
    });
  }
}
const formatText = (tagName) => {
  const $toolbar = document.querySelector("#toolbar");
  const selection = window.getSelection();
  if (!selection.isCollapsed) {
    const range = selection.getRangeAt(0);
    const selectedText = range.toString();

    let startNode = range.startContainer;
    let startParentNode = startNode.parentNode;

    let alreadySpan = startNode.nodeName.toLowerCase() === "span";
    let alreadySpanParent =
      startParentNode.nodeName.toLocaleLowerCase() === "span";

    const selectAll = selectedText === startNode.textContent;
    if (selectAll && alreadySpanParent) {
      alreadySpan = true;
      startNode = startParentNode;
      startParentNode = startParentNode.parentNode;
    }

    let newNode = null;
    if (!alreadySpan && !alreadySpanParent) {
      newNode = document.createElement("span");
    } else if (alreadySpan) {
      newNode = startNode;
    } else if (!alreadySpan && alreadySpanParent) {
      newNode = document.createElement(startNode.parentNode.tagName);
      newNode.style.cssText = startNode.parentNode.style.cssText;
    }

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
      if (alreadySpanParent) {
        range.deleteContents(); // 선택된 텍스트 삭제
        range.insertNode(newNode); // 새 노드 삽입

        //부모 노드와 같은 스타일의 노드를 만들어 노드 분리
        for (let i = 0; i < startParentNode.childNodes.length; i++) {
          if (startParentNode.childNodes[i] instanceof Text) {
            const newNode = document.createElement(startParentNode.tagName);
            newNode.style.cssText = startNode.parentNode.style.cssText;
            newNode.textContent = startParentNode.childNodes[i].textContent;
            startParentNode.insertAdjacentElement("beforebegin", newNode);
          } else {
            startParentNode.insertAdjacentElement(
              "beforebegin",
              startParentNode.childNodes[i]
            );
            i--;
          }
        }
        //부모 노드 제거
        startParentNode.parentNode.removeChild(startParentNode);

        //기존에 선택되었던 드래그 범위가 재정의 되는 문제 해결
        const selectionRange = document.createRange();
        selectionRange.selectNodeContents(newNode); // 새 노드를 선택
        selection.removeAllRanges(); // 기존 선택 범위 제거
        selection.addRange(selectionRange); // 새 범위를 추가
      } else {
        range.deleteContents(); // 선택된 텍스트 삭제
        range.insertNode(newNode); // 새 노드 삽입

        //기존에 선택되었던 드래그 범위가 재정의 되는 문제 해결
        const selectionRange = document.createRange();
        selectionRange.selectNodeContents(newNode); // 새 노드를 선택
        selection.removeAllRanges(); // 기존 선택 범위 제거
        selection.addRange(selectionRange); // 새 범위를 추가
      }
    } else {
      const hasStyle = Object.keys(newNode.style).some((property) => {
        return newNode.style[property] !== "";
      });
      if (!hasStyle) {
        const parentNode = newNode.parentNode;
        let indexChildNodes = [...parentNode.childNodes].indexOf(newNode);
        let newText = selectedText;
        if (
          indexChildNodes - 1 >= 0 &&
          parentNode.childNodes[indexChildNodes - 1] instanceof Text
        ) {
          newText =
            parentNode.childNodes[indexChildNodes - 1].textContent + newText;
          parentNode.removeChild(parentNode.childNodes[indexChildNodes - 1]);
          --indexChildNodes;
        }
        if (
          indexChildNodes + 1 < parentNode.childNodes.length &&
          parentNode.childNodes[indexChildNodes + 1] instanceof Text
        ) {
          newText += parentNode.childNodes[indexChildNodes + 1].textContent;
          parentNode.removeChild(parentNode.childNodes[indexChildNodes + 1]);
        }
        const newTextNode = document.createTextNode(newText);

        parentNode.insertBefore(
          newTextNode,
          parentNode.childNodes[indexChildNodes]
        );
        parentNode.removeChild(parentNode.children[indexChildNodes]);
        $toolbar.style.display = "none";
      }
    }
    newNode.focus();

    const contentDivs = document.querySelectorAll(".editor__input--content");
    const newContent = Array.from(contentDivs)
      .map((div) => {
        return `${div.parentNode.outerHTML}`;
      })
      .join("");
    store_currentContents.dispatch(setCONTENTS(newContent));
  }
};
