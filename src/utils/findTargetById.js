/**
 * 클릭한 페이지(하위 목록 포함)를 Id로 찾아 depth와 함께 출력해주는 함수
 * @param {*} data 사이드바 전체 페이지 목록
 * @param {*} targetId 클릭한 페이지의 Id
 * @param {*} depth 페이지의 깊이 (들여쓰기 깊이)
 */
export const findTargetById = (data, targetId, depth = 0) => {
  for (const item of data) {
    if (item.id == targetId) {
      return [item, depth];
    } else {
      if (item.documents && item.documents.length) {
        const [clicked, newDepth] = this.findTargetById(
          item.documents,
          targetId,
          depth + 1
        );
        if (clicked !== null) {
          return [clicked, newDepth];
        }
      }
    }
  }
  return [null, depth];
};
