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
      this.printFile(this.$sideBarPages, this.state.list)
    );
    this.$target.appendChild(this.$sideBarPages);
  }
  /**
   * 파일을 토글 버튼으로 하위항목까지 보여주도록 만들어주는 DOM을 생성하는 함수
   * @param {*} parent 상위 파일 객체
   * @param {*} detail 파일 토글버튼 생성 HTML
   */
  printFile = ($target, pageList, parentId = "", depth = 0) => {
    if (pageList.length) {
      let $sideBarPagesContainer = document.createElement("ul");
      $sideBarPagesContainer.className = "sidebar__pages--container";
      $sideBarPagesContainer.setAttribute("data-id", parentId);
      pageList.map((pageObject) => {
        new SideBarPagesDetails({
          $target: $sideBarPagesContainer,
          pageObject,
          setOpenedDetail: this.setOpenedDetail,
          setAddDetail: this.setAddDetail,
          openedDetail: this.openedDetail,
          depth,
        });
        if (this.openedDetail.has(pageObject.id)) {
          $sideBarPagesContainer.appendChild(
            this.printFile(
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
   * 파일을 생성할 때 해당 페이지가 보이도록 노드를 렌더링하는 함수
   * @param {*} id 생성하는 페이지의 부모 id
   */
  setOpenedDetail = (id) => {
    const updatedFileContainer = this.$sideBarPages.querySelector(
      `.sidebar__pages--container [data-id="${id}"]`
    );
    const updatedFileContainerNextSibling =
      updatedFileContainer?.nextElementSibling;
    const [selectedList, depth] = this.findClickedById(this.state.list, id);

    if (updatedFileContainer) {
      if (!this.openedDetail.has(id)) {
        this.openedDetail.add(id);
      } else {
        this.openedDetail.delete(id);

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
        this.printFile(
          this.$sideBarPages,
          [selectedList],
          selectedList.id,
          depth
        )
      );
      setItem("openedDetail", this.openedDetail);
    }
  };
  /**
   * 파일을 생성할 때 해당 페이지가 보이도록 노드를 렌더링하는 함수
   * @param {*} id 생성하는 페이지의 부모 id
   */
  setAddDetail = async (id) => {
    const updatedFileContainer = this.$sideBarPages.querySelector(
      `.sidebar__pages--container [data-id="${id}"]`
    );
    const pageList = await this.data.getDocumentStructure();
    const [selectedList, depth] = this.findClickedById(pageList, id);

    if (updatedFileContainer) {
      if (!this.openedDetail.has(id)) {
        this.openedDetail.add(id);
      }

      updatedFileContainer.replaceWith(
        this.printFile(
          this.$sideBarPages,
          [selectedList],
          selectedList.id,
          depth
        )
      );
      setItem("openedDetail", this.openedDetail);
    }
    console.log(updatedFileContainer);
  };

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
