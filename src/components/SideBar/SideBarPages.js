import Data from "../../data.js";
import { push } from "../../router.js";
import { setItem, getItem } from "@/store/localStorage";
import SideBarPagesDetails from "./SideBarPagesDetails.js";

export default class SideBarPages {
  constructor({ $target, initialState, editorsetState }) {
    this.state = initialState;
    this.$target = $target;
    this.data = new Data();
    this.openedDetail = new Set(getItem("openedDetail", []));
    this.editorsetState = editorsetState;

    this.$sideBarPages = document.createElement("section");
    this.$sideBarPages.className = "sidebar__pages";

    this.render();
    this.eventAdd();
  }

  setState = (nextState) => {
    if (nextState.postId) {
      this.data.getDocumentContent(nextState.postId).then((x) => {
        this.state = {
          ...this.state,
          postId: nextState.postId,
        };
        this.editorsetState(x);
      });
    } else {
      this.state = {
        ...this.state,
        ...nextState,
      };
    }
    this.render();
  };

  render() {
    this.$sideBarPages.appendChild(
      this.printPage(this.$sideBarPages, this.state.list)
    );
    this.$target.appendChild(this.$sideBarPages);
  }
  /**
   * 페이지들을 사이드바에 출력하는 함수
   * @param {*} $target 출력해야하는 노드
   * @param {*} pageList 출력해야하는 페이지들의 List
   * @param {*} parentId 출력해야하는 페이지의 부모 Id
   * @param {*} depth 페이지의 깊이 (들여쓰기 깊이)
   */
  printPage = ($target, pageList, parentId = "", depth = 0) => {
    if (pageList.length) {
      let $sideBarPagesContainer = document.createElement("ul");
      $sideBarPagesContainer.className = "sidebar__pages--container";
      $sideBarPagesContainer.setAttribute("data-id", parentId);
      pageList.map((pageObject) => {
        new SideBarPagesDetails({
          $target: $sideBarPagesContainer,
          pageObject,
          openedDetail: this.openedDetail,
          setDetail: this.setDetail,
          depth,
        });
        if (this.openedDetail.has(pageObject.id)) {
          $sideBarPagesContainer.appendChild(
            this.printPage(
              $sideBarPagesContainer,
              pageObject.documents,
              pageObject.id,
              depth + 1
            )
          );
        }
      });
      return $sideBarPagesContainer;
    } else {
      let $sideBarPagesContainerEmpty = document.createElement("div");
      $sideBarPagesContainerEmpty.className = "sidebar__pages--empty";
      $sideBarPagesContainerEmpty.textContent = "하위 페이지 없음";
      $sideBarPagesContainerEmpty.style.setProperty("--depth", depth);
      return $sideBarPagesContainerEmpty;
    }
  };

  eventAdd() {
    this.$sideBarPages.addEventListener("scroll", (e) => {
      const scrollPositon = this.$sideBarPages.scrollTop;
      const eventArea = document.querySelector(".sidebar__pages");
      if (scrollPositon > 0) {
        if (!eventArea.classList.contains("scrolled")) {
          eventArea.classList.add("scrolled");
        }
      } else {
        eventArea.classList.remove("scrolled");
      }
    });
  }
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
  setDetail = async (id, action) => {
    let updatedFileContainer = this.$sideBarPages.querySelector(
      `.sidebar__pages--container [data-id="${id}"]`
    );
    const updatedFileContainerNextSibling =
      updatedFileContainer?.nextElementSibling;

    if (action === "add" || action === "remove")
      this.state.list = await this.data.getDocumentStructure();

    const [selectedList, depth] = this.findClickedById(this.state.list, id);
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
        this.printPage(
          this.$sideBarPages,
          [selectedList],
          selectedList.id,
          depth
        )
      );
      setItem("openedDetail", this.openedDetail);
    } else {
      //삭제되어 부모를 찾지 못할 경우 전체 렌더링
      updatedFileContainer = document.querySelector(
        ".sidebar__pages--container"
      );
      console.log(updatedFileContainer);
      updatedFileContainer.replaceWith(
        this.printPage(this.$sideBarPages, this.state.list)
      );
    }
  };
  /**
   * 클릭한 페이지(하위 목록 포함)를 Id로 찾아 depth와 함께 출력해주는 함수
   * @param {*} data 사이드바 전체 페이지 목록
   * @param {*} targetId 클릭한 페이지의 Id
   * @param {*} depth 페이지의 깊이 (들여쓰기 깊이)
   */
  findClickedById(data, targetId, depth = 0) {
    for (const item of data) {
      if (item.id == targetId) {
        return [item, depth];
      } else {
        if (item.documents && item.documents.length) {
          const [clicked, newDepth] = this.findClickedById(
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
  }
}
