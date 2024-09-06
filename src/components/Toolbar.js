import { Component } from "@core";

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
