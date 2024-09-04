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
