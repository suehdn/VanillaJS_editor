import { getDocumentId, push } from "@/router";
import Data from "@/data";
import { setItem, getItem, store_documentId, setID } from "@stores";
import { Component } from "@core";

export default class SideBarHeader extends Component {
  setup() {
    this.data = new Data();
  }
  template() {
    return `
      <span class = 'sidebar__header--main sidebar__header--action' data-action = 'main'>H의 Notion</span>
      <div class = 'sidebar__header--container'>         
        <div class = 'sidebar__header--action' data-action = 'quick_start'>  
          <span class = "material-symbols-rounded">bolt</span>
          <span>Quick start</span>
        </div>
        <div class = 'sidebar__header--action' data-action = 'guestbook'>  
          <span class = "material-symbols-rounded">menu_book</span>
          <span>Guestbook</span>
        </div>
        <div class = 'sidebar__header--action' data-action = 'add'>  
          <span class = "material-symbols-rounded">edit_square</span>
          <span>Add a page</span>
        </div>
      </div>
    `;
  }
  setEvent() {
    this.addEvent("click", ".sidebar__header", async (e) => {
      if (e.target.closest(".sidebar__header--action")) {
        const action = e.target.closest(".sidebar__header--action").dataset
          .action;
        switch (action) {
          case "main":
            push(`/main`);
            store_documentId.dispatch(setID(getDocumentId()));
            break;
          case "add":
            await this.data.addDocumentStructure().then((x) => {
              push(`/${x.id}`);
              store_documentId.dispatch(setID(getDocumentId()));
              setItem("selected", x.id);
              this.props.sideBarPagesRender();
            });
            break;
          case "quick_start":
            push(`/quick_start`);
            store_documentId.dispatch(setID(getDocumentId()));
            break;
          case "guestbook":
            push(`/guestbook`);
            store_documentId.dispatch(setID(getDocumentId()));
            break;
        }
      }
    });

    this.addEvent("mousedown", ".sidebar__header--action", (e) => {
      const target = e.target.closest(".sidebar__header--action");
      target.classList.add("mousedown-background");
    });

    this.addEvent("mouseup", ".sidebar__header--action", (e) => {
      const target = e.target.closest(".sidebar__header--action");
      target.classList.remove("mousedown-background");
    });

    this.addEvent("mouseout", ".sidebar__header--action", (e) => {
      const target = e.target.closest(".sidebar__header--action");
      target.classList.remove("mousedown-background");
    });
  }
}
