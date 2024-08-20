import Data from "../../data.js";
import { push } from "../../router.js";
import SideBarPagesDetails from "./SideBarPagesDetails.js";

export default class SideBarPages {
  constructor({ $target, initialState, editorsetState }) {
    this.state = initialState;
    this.$target = $target;
    this.data = new Data();
    this.openedDetail = new Set();
    this.editorsetState = editorsetState;

    this.$sideBarPages = document.createElement("section");
    this.$sideBarPages.className = "sidebar__pages";

    this.render();
    this.eventAdd();
  }

  setOpenedDetail = (id) => {
    const updatedFileContainer = this.$sideBarPages.querySelector(
      `.sidebar__pages--container [data-id="${id}"]`
    );

    if (updatedFileContainer) {
      if (!this.openedDetail.has(id)) {
        this.openedDetail.add(id);
      } else {
        this.openedDetail.delete(id);
      }

      const [selectedList, depth] = this.findClickedById(this.state.list, id);

      console.log(selectedList);
      console.log("대체 전:", updatedFileContainer);
      // console.log(
      //   "대체 후:",
      //   this.printFile(this.$sideBarPages, selectedList, selectedList[0].id)
      // );
      updatedFileContainer.replaceWith(
        this.printFile(
          this.$sideBarPages,
          [selectedList],
          selectedList.id,
          depth
        )
      );
    }
  };

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
    console.log("depth:", depth, "pagelist:", pageList, parentId);
    if (pageList.length) {
      let $sideBarPagesContainer = document.createElement("ul");
      $sideBarPagesContainer.className = "sidebar__pages--container";
      $sideBarPagesContainer.setAttribute("data-id", parentId);
      pageList.map((pageObject) => {
        new SideBarPagesDetails({
          $target: $sideBarPagesContainer,
          pageObject,
          setOpenedDetail: this.setOpenedDetail,
          depth,
        });
        if (this.openedDetail.has(pageObject.id))
          $sideBarPagesContainer.appendChild(
            this.printFile(
              $sideBarPagesContainer,
              pageObject.documents,
              pageObject.id,
              depth + 1
            )
          );
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
  /**
   *  클릭했을때 동작을 add 해주는 함수
   */
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
    // this.$sideBarPages.onclick = async (e) => {
    //   const $detail = e.target.closest(".detail");
    //   const $summary = e.target.closest(".sideBarPages__text--page-summary");
    //   const $delete = e.target.closest(".sideBarPages__button--delete");
    //   const $add = e.target.closest(".sideBarPages__button--add");
    //   if ($summary) {
    //     const { id } = $summary.dataset;
    //     this.setState({ postId: id });
    //     push(`/documents/${id}`);
    //     this.highlight(id);
    //     this.setState({});
    //   } else if ($delete) {
    //     const { id } = $delete.dataset;
    //     await this.data.deleteDocumentStructure(id);
    //     this.data.getDocumentStructure().then((x) => {
    //       this.setState({ list: x });
    //       this.detail = this.setDetail().detail;
    //       this.detailMap.delete(id);
    //     });
    //   } else if ($add) {
    //     const { id } = $add.dataset;
    //     await this.data.addDocumentStructure(id).then((x) => {
    //       push(`/documents/${x.id}`);
    //       this.highlight(x.id);
    //     });
    //     await this.data.getDocumentStructure().then((x) => {
    //       this.setState({ list: x });
    //       this.detail = this.setDetail().detail;
    //       if (this.detail.length) {
    //         this.detail.map((x) => {
    //           this.detailMap.set(x.id, x.opend);
    //         });
    //       } else {
    //         this.detailMap.set(this.detail.id, this.detail.opend);
    //       }
    //     });
    //   } else if ($detail) {
    //     const { id } = $detail.dataset;
    //     if (this.detail.length) {
    //       this.detail.map((x, i) => {
    //         if (x.id === id) {
    //           if (window.detail[i].open) {
    //             this.detail[i]["opend"] = false;
    //           } else {
    //             this.detail[i]["opend"] = true;
    //           }
    //         }
    //         this.detailMap.set(x.id, x.opend);
    //       });
    //     } else {
    //       if (window.detail.open) {
    //         this.detail["opend"] = false;
    //       } else {
    //         this.detail["opend"] = true;
    //       }
    //       this.detailMap.set(this.detail.id, this.detail.opend);
    //     }
    //   }
    // };
  }
  /**
   * 선택한 페이지 highlight해주는 함수
   * @param {*} id
   */
  highlight(id) {
    if (this.selectedFileId) {
      this.selectedFileId = id;
    }
    this.selectedFileId = id;
  }

  findClickedById(data, targetId, depth = 0) {
    for (const item of data) {
      if (item.id == targetId) {
        console.log("내가 누른거:", item, depth);
        return [item, depth];
      } else {
        if (item.documents && item.documents.length) {
          const [clicked, newDepth] = this.findClickedById(
            item.documents,
            targetId,
            depth + 1
          );
          if (clicked !== null) {
            console.log("내가 누른거:", clicked, newDepth);
            return [clicked, newDepth];
          }
        }
      }
    }
    return [null, depth];
  }
}
