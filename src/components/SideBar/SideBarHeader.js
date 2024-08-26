import { push } from "@/router";
import Data from "@/data";
import { setItem, getItem } from "@stores";

export default class SideBarHeader {
  constructor({ $target }) {
    this.$target = $target;
    this.$sideBarHeader = document.createElement("section");
    this.$sideBarHeader.className = "sidebar__header";
    this.data = new Data();
    this.$beforeSelected = 0;

    this.initialize();
    this.eventAdd();
  }

  initialize = () => {
    this.$sideBarHeader.innerHTML = `
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
                </div>`;
    this.$target.appendChild(this.$sideBarHeader);
  };

  render = () => {
    const selected = getItem("selected");

    document
      .querySelector(
        `.sidebar__pages--detail[data-id="${this.$beforeSelected}"]`
      )
      ?.classList.remove("highlight");

    document
      .querySelector(`.sidebar__pages--detail[data-id="${selected}"]`)
      ?.classList.add("highlight");
  };

  eventAdd = () => {
    this.$sideBarHeader.addEventListener("click", this.clickEventAdd);
  };

  clickEventAdd = async (e) => {
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
            this.$beforeSelected = getItem("selected");
            setItem("selected", x.id);
            this.render();
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
  };
}
