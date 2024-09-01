import { push } from "@/router";
import Data from "@/data";
import { setItem, getItem } from "@stores";
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
            push(`/`);
            break;
          case "add":
            await this.data.addDocumentStructure().then((x) => {
              push(`/${x.id}`);
              setItem("selected", x.id);
              this.props.sideBarPagesRender();
            });
            break;
          case "quick_start":
            push(`/quick_start`);
            break;
          case "guestbook":
            push(`/guestbook`);
            break;
        }
      }
    });
  }
}
