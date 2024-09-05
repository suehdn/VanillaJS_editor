export const setCaretOffset = () => {
  const selection = window.getSelection();
  const range = selection.getRangeAt(0);
  return range.startOffset;
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
