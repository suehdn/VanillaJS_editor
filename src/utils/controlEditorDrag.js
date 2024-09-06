/**
 * 드래그 하는 노드에서 가장 가까운 노드를 찾는 함수
 * @param {*} container 드래그할 수 있는 요소들이 모여있는 노드
 * @param {*} y 드래그하는 노드의 y 좌표
 */
export const getDragAfterElement = (container, y) => {
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
