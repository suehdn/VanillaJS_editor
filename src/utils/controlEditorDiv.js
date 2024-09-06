import { lastCursor } from "./Cursor";

/**
 * 엔터를 입력했을 때 Div를 분리하는 함수
 * @param {*} currentDiv 현재 입력 받고 있는 Div
 * @param {*} caretOffset 커서의 위치
 * @param {*} target ".editor__content"를 가져올 목표 노드
 * @param {*} parentNode currentDiv의 부모 노드
 */
export const separateDiv = (currentDiv, caretOffset, $target, parentNode) => {
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
export const appendDiv = (
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
