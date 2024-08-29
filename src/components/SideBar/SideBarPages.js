import Data from "../../data.js";
import { push } from "../../router.js";
import { setItem, getItem } from "@stores";
import { Component } from "@core";

export default class SideBarPages extends Component {
  setup() {
    this.state = {
      pages: this.props,
      openedDetail: new Set(getItem("openedDetail", [])),
      hoveredId: null,
    };
    this.data = new Data();
    this.hoveredElementId = null;
  }
  template() {
    return `${printPage(
      this.state.pages,
      this.state.openedDetail,
      0,
      this.hoveredElementId
    )}`;
  }
  mounted() {}
  setEvent() {
    this.addEvent("scroll", ".sidebar__pages", (e) => {
      const scrollPositon = this.$target.scrollTop;
      const eventArea = document.querySelector(".sidebar__pages");
      if (scrollPositon > 0) {
        if (!eventArea.classList.contains("scrolled")) {
          eventArea.classList.add("scrolled");
        }
      } else {
        eventArea.classList.remove("scrolled");
      }
    });

    this.addEvent("click", ".sidebar__pages--detail-click", async (e) => {
      const action = e.target.closest(".sidebar__pages--detail-click").dataset
        .action;
      const id = e.target.closest(".sidebar__pages--detail").dataset.id;
      const setOpenedDetail = (action, id) => {
        const tempOpenedDetail = new Set(this.state.openedDetail);
        if (action === "add" || !tempOpenedDetail.has(id)) {
          tempOpenedDetail.add(id);
        } else if (action === "delete" || tempOpenedDetail.has(id)) {
          tempOpenedDetail.delete(id);
        }
        return tempOpenedDetail;
      };
      const getPages = (action, id) => {
        const tempOpenedDetail = setOpenedDetail(action, id);
        if (action === "select") {
          // this.setState({ openedDetail: tempOpenedDetail });
        } else {
          this.data.getDocumentStructure().then((pages) => {
            this.setState({ pages, openedDetail: tempOpenedDetail });
          });
        }
      };
      switch (action) {
        case "toggle":
          const tempOpenedDetail = setOpenedDetail(action, id);
          setItem("openedDetail", tempOpenedDetail);
          this.setState({ openedDetail: tempOpenedDetail });
          break;
        case "remove":
          await this.data.deleteDocumentStructure(id).then(() => {
            push(`/`);
            getPages("remove", id);
          });
          break;
        case "add":
          await this.data.addDocumentStructure(id).then((x) => {
            push(`/${x.id}`);
            getPages("add", id);
          });
          break;
        case "select":
          console.log("Select action triggered");
          // push(`/${this.state.id}`);
          // this.$beforeSelected = getItem("selected");
          // setItem("selected", this.state.id);
          // this.render();
          break;
      }
    });

    this.addEvent(
      "mouseover",
      ".sidebar__pages--detail-button[data-action=toggle]",
      async (e) => {
        const icon = e.target.closest(
          ".sidebar__pages--detail-button .material-symbols-rounded"
        );
        this.hoveredElementId = e.target.closest(
          ".sidebar__pages--detail"
        ).dataset.id;
        if (this.state.openedDetail.has(this.hoveredElementId)) {
          icon.textContent = "keyboard_arrow_down";
        } else icon.textContent = "keyboard_arrow_right";
      }
    );

    this.addEvent(
      "mouseout",
      ".sidebar__pages--detail-button[data-action=toggle]",
      async (e) => {
        const icon = e.target
          .closest(".sidebar__pages--detail-button")
          .querySelector(".material-symbols-rounded");
        icon.textContent = "description";
        this.hoveredElementId = null;
      }
    );
  }
}

/**
 * 페이지들을 사이드바에 출력하는 함수
 * @param {*} pageList 출력해야하는 페이지들의 List
 * @param {*} openedDetail 출력해야하는 페이지의 열림, 닫힘 여부
 * @param {*} depth 페이지의 깊이 (들여쓰기 깊이)
 */
// prettier-ignore
const printPage = (pageList, openedDetail, depth = 0, hoveredElementId) => {
  let content = '<ul class="sidebar__pages--container">';
  let icon = null;
  pageList.forEach((list, index) => {
    if(String(list.id) !== hoveredElementId){
      icon =  "description";
    }else{
      if(openedDetail.has(String(list.id))) icon = "keyboard_arrow_down";
      else icon =  "keyboard_arrow_right";
    }
    content += `
      <li class="sidebar__pages--detail sidebar__pages--detail-click" data-id="${list.id}" data-action="select" style="--depth:${depth}">
        <div class="sidebar__pages--detail-contents">
          <button class="sidebar__pages--detail-button sidebar__pages--detail-click" data-action="toggle">` +
            `<span class="material-symbols-rounded"> ${icon} </span> `+
          `</button>
          <span class="sidebar__pages--detail-title">
            ${list.id || "제목 없음"}
          </span>
        </div>
        <div class="sidebar__pages--detail-toolkit">
          <button class="sidebar__pages--detail-button sidebar__pages--detail-click" data-action="remove">
            <span class="material-symbols-rounded"> remove </span>
          </button>
          <button class="sidebar__pages--detail-button sidebar__pages--detail-click" data-action="add">
            <span class="material-symbols-rounded"> add </span>
          </button>
        </div>
      </li>`;
    if (openedDetail.has(String(list.id))) {
      if (list.documents.length) {
        content += printPage(list.documents, openedDetail, depth + 1,hoveredElementId);
      } else {
        content += `<div class="sidebar__pages--empty" style="--depth:${depth + 1}">하위 페이지 없음</div>`;
      }
    }
  });
  content += '</ul>';
  return content;
};
// `<div class="sidebar__pages--empty" style="--depth:${depth}">하위 페이지 없음</div>`
// export default class SideBarPages {
//   constructor({ $target, initialState }) {
//     this.state = initialState;
//     this.$target = $target;
//     this.data = new Data();
//     this.openedDetail = new Set(getItem("openedDetail", []));
//     // this.editorsetState = editorsetState;

//     this.$sideBarPages = document.createElement("section");
//     this.$sideBarPages.className = "sidebar__pages";

//     this.render();
//     this.eventAdd();
//   }

//   render() {
//     this.$sideBarPages.appendChild(
//       this.printPage(this.$sideBarPages, this.state)
//     );
//     this.$target.appendChild(this.$sideBarPages);
//   }
//   /**
//    * 페이지들을 사이드바에 출력하는 함수
//    * @param {*} $target 출력해야하는 노드
//    * @param {*} pageList 출력해야하는 페이지들의 List
//    * @param {*} parentId 출력해야하는 페이지의 부모 Id
//    * @param {*} depth 페이지의 깊이 (들여쓰기 깊이)
//    */
//   printPage = ($target, pageList, parentId = "", depth = 0) => {
//     if (pageList.length) {
//       let $sideBarPagesContainer = document.createElement("ul");
//       $sideBarPagesContainer.className = "sidebar__pages--container";
//       $sideBarPagesContainer.setAttribute("data-id", parentId);
//       pageList.map((pageObject) => {
//         new SideBarPagesDetails({
//           $target: $sideBarPagesContainer,
//           pageObject,
//           openedDetail: this.openedDetail,
//           setDetail: this.setDetail,
//           depth,
//         });
//         if (this.openedDetail.has(pageObject.id)) {
//           $sideBarPagesContainer.appendChild(
//             this.printPage(
//               $sideBarPagesContainer,
//               pageObject.documents,
//               pageObject.id,
//               depth + 1
//             )
//           );
//         }
//       });
//       return $sideBarPagesContainer;
//     } else {
//       let $sideBarPagesContainerEmpty = document.createElement("div");
//       $sideBarPagesContainerEmpty.className = "sidebar__pages--empty";
//       $sideBarPagesContainerEmpty.textContent = "하위 페이지 없음";
//       $sideBarPagesContainerEmpty.style.setProperty("--depth", depth);
//       return $sideBarPagesContainerEmpty;
//     }
//   };

//   eventAdd() {
//     this.$sideBarPages.addEventListener("scroll", (e) => {
//       const scrollPositon = this.$sideBarPages.scrollTop;
//       const eventArea = document.querySelector(".sidebar__pages");
//       if (scrollPositon > 0) {
//         if (!eventArea.classList.contains("scrolled")) {
//           eventArea.classList.add("scrolled");
//         }
//       } else {
//         eventArea.classList.remove("scrolled");
//       }
//     });
//   }
//   /**
//    * 파일을 열고 닫을 때 해당 페이지가 보여지거나 숨겨지도록 노드를 렌더링하는 함수
//    * @param {*} id
//    * 1. action - 'toggle' : 해당하는 페이지의 id
//    * 2. action - 'add', 'delete' : 해당하는 페이지의 부모 id
//    * @param {*} action
//    * 1. 'toggle' : 파일을 열고 닫을 때 해당 페이지가 보여지거나 숨겨지도록 노드를 렌더링
//    * 2. 'add' : 파일을 생성할 때 해당 페이지가 보이도록 노드를 렌더링
//    * 3. 'delete' : 파일을 제거할 때 해당 페이지가 사라지도록 노드를 렌더링
//    */
//   setDetail = async (id, action) => {
//     let updatedFileContainer = this.$sideBarPages.querySelector(
//       `.sidebar__pages--container [data-id="${id}"]`
//     );
//     const updatedFileContainerNextSibling =
//       updatedFileContainer?.nextElementSibling;

//     if (action === "add" || action === "remove")
//       this.state = await this.data.getDocumentStructure();

//     const [selectedList, depth] = this.findClickedById(this.state, id);
//     console.log(this.state, id);
//     console.log(selectedList, depth);
//     console.log(updatedFileContainer);

//     if (updatedFileContainer) {
//       if (!this.openedDetail.has(id)) {
//         this.openedDetail.add(id);
//       } else if (this.openedDetail.has(id)) {
//         if (action !== "add") this.openedDetail.delete(id);

//         if (
//           updatedFileContainerNextSibling?.className ===
//             "sidebar__pages--empty" ||
//           updatedFileContainerNextSibling?.querySelector(
//             `.sidebar__pages--detail[data-id="${selectedList.documents[0]?.id}"]`
//           )
//         ) {
//           updatedFileContainerNextSibling.remove();
//         }
//       }
//       updatedFileContainer.replaceWith(
//         this.printPage(
//           this.$sideBarPages,
//           [selectedList],
//           selectedList.id,
//           depth
//         )
//       );
//       setItem("openedDetail", this.openedDetail);
//     } else {
//       //삭제되어 부모를 찾지 못할 경우 전체 렌더링
//       updatedFileContainer = document.querySelector(
//         ".sidebar__pages--container"
//       );
//       console.log(updatedFileContainer);
//       updatedFileContainer.replaceWith(
//         this.printPage(this.$sideBarPages, this.state)
//       );
//     }
//   };
//   /**
//    * 클릭한 페이지(하위 목록 포함)를 Id로 찾아 depth와 함께 출력해주는 함수
//    * @param {*} data 사이드바 전체 페이지 목록
//    * @param {*} targetId 클릭한 페이지의 Id
//    * @param {*} depth 페이지의 깊이 (들여쓰기 깊이)
//    */
//   findClickedById(data, targetId, depth = 0) {
//     for (const item of data) {
//       if (item.id == targetId) {
//         return [item, depth];
//       } else {
//         if (item.documents && item.documents.length) {
//           const [clicked, newDepth] = this.findClickedById(
//             item.documents,
//             targetId,
//             depth + 1
//           );
//           if (clicked !== null) {
//             return [clicked, newDepth];
//           }
//         }
//       }
//     }
//     return [null, depth];
//   }
// }
