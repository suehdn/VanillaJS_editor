export const setCaretOffset = () => {
  const selection = window.getSelection();
  console.log(selection.focusNode);
  const range = selection.getRangeAt(0);
  return range.startOffset;
};

export const setCaretAtEnd = (element) => {
  const range = document.createRange();
  const selection = window.getSelection();

  // 텍스트가 있는 경우 마지막 텍스트 노드를 선택
  const textNode = element.lastChild;

  if (textNode) {
    range.setStart(textNode, textNode.length);
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);
  }
};

export const saveCursor = (targetDiv, caretOffset) => {
  const newSelection = window.getSelection();
  const newRange = document.createRange();
  newRange.selectNodeContents(targetDiv);
  newRange.setStart(
    targetDiv.firstChild || targetDiv,
    Math.min(caretOffset, targetDiv.textContent.length)
  );
  newRange.collapse(true);
  newSelection.removeAllRanges();
  newSelection.addRange(newRange);
};

export const lastCursor = (targetDiv) => {
  const newSelection = window.getSelection();
  const newRange = document.createRange();
  newRange.selectNodeContents(targetDiv);
  newRange.collapse(false);
  newSelection.removeAllRanges();
  newSelection.addRange(newRange);
};
