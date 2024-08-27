import { findTargetById } from "@utils";
import { setItem } from "@stores";
/**
 * 파일을 열고 닫을 때 해당 페이지가 보여지거나 숨겨지도록 노드를 렌더링하는 함수
 * @param {*} id
 * 1. action - 'toggle' : 해당하는 페이지의 id
 * 2. action - 'add', 'delete' : 해당하는 페이지의 부모 id
 * @param {*} action
 * 1. 'toggle' : 파일을 열고 닫을 때 해당 페이지가 보여지거나 숨겨지도록 노드를 렌더링
 * 2. 'add' : 파일을 생성할 때 해당 페이지가 보이도록 노드를 렌더링
 * 3. 'delete' : 파일을 제거할 때 해당 페이지가 사라지도록 노드를 렌더링
 */

//this.$sideBarPages, this.state, this.data, this.openedDetail, this.printPage
export const updateSideBarPages = async (id, action) => {
  let updatedFileContainer = this.$sideBarPages.querySelector(
    `.sidebar__pages--container [data-id="${id}"]`
  );
  const updatedFileContainerNextSibling =
    updatedFileContainer?.nextElementSibling;

  if (action === "add" || action === "remove")
    this.state.list = await this.data.getDocumentStructure();

  const [selectedList, depth] = this.findTargetById(this.state.list, id);
  console.log(this.state.list, id);
  console.log(selectedList, depth);
  console.log(updatedFileContainer);

  if (updatedFileContainer) {
    if (!this.openedDetail.has(id)) {
      this.openedDetail.add(id);
    } else if (this.openedDetail.has(id)) {
      if (action !== "add") this.openedDetail.delete(id);

      if (
        updatedFileContainerNextSibling?.className ===
          "sidebar__pages--empty" ||
        updatedFileContainerNextSibling?.querySelector(
          `.sidebar__pages--detail[data-id="${selectedList.documents[0]?.id}"]`
        )
      ) {
        updatedFileContainerNextSibling.remove();
      }
    }
    updatedFileContainer.replaceWith(
      this.printPage(this.$sideBarPages, [selectedList], selectedList.id, depth)
    );
    setItem("openedDetail", this.openedDetail);
  } else {
    //삭제되어 부모를 찾지 못할 경우 전체 렌더링
    updatedFileContainer = document.querySelector(".sidebar__pages--container");
    console.log(updatedFileContainer);
    updatedFileContainer.replaceWith(
      this.printPage(this.$sideBarPages, this.state.list)
    );
  }
};
