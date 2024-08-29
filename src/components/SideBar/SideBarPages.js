import Data from "../../data.js";
import { push } from "../../router.js";
import { setItem, getItem } from "@stores";
import { Component } from "@core";

export default class SideBarPages extends Component {
  setup() {
    this.state = {
      pages: this.props,
      openedDetail: new Set(getItem("openedDetail", [])),
      selected: getItem("selected") || null,
    };
    this.data = new Data();
    this.hoveredElementId = null;
  }
  template() {
    return `${printPage(
      this.state.pages,
      this.state.openedDetail,
      0,
      this.state.selected,
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
      const getPages = (action, id, selected) => {
        const tempOpenedDetail = setOpenedDetail(action, id);
        if (action === "add") {
          this.data.getDocumentStructure().then((pages) => {
            this.setState({ pages, openedDetail: tempOpenedDetail, selected });
          });
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
            setItem("selected", x.id);
            getPages("add", id, x.id);
          });
          break;
        case "select":
          push(`/${id}`);
          setItem("selected", id);
          this.setState({ selected: id });
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
        if (icon)
          this.state.openedDetail.has(this.hoveredElementId)
            ? (icon.textContent = "keyboard_arrow_down")
            : (icon.textContent = "keyboard_arrow_right");
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
 * @param {*} selected 선택된 노드 id -> highlight처리
 * @param {*} hoveredElementId 리렌더링 되었을 때 이전에 hover한 노드 id
 */
// prettier-ignore
const printPage = (pageList, openedDetail, depth = 0, selected, hoveredElementId) => {
  let content = '<ul class="sidebar__pages--container">';
  let icon = null;
  pageList.forEach((list, index) => {
    if(list.id != hoveredElementId){
      icon =  "description";
    }else{
      if(openedDetail.has(String(list.id))) icon = "keyboard_arrow_down";
      else icon =  "keyboard_arrow_right";
    }
    content += `
      <li class="sidebar__pages--detail sidebar__pages--detail-click ${list.id == selected?"highlight":""}" data-id="${list.id}" data-action="select" style="--depth:${depth}">
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
        content += printPage(list.documents, openedDetail, depth + 1, selected, hoveredElementId);
      } else {
        content += `<div class="sidebar__pages--empty" style="--depth:${depth + 1}">하위 페이지 없음</div>`;
      }
    }
  });
  content += '</ul>';
  return content;
};
