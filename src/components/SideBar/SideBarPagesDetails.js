import { push } from "@/router";
import { setItem, getItem } from "@/store/localStorage";
import Data from "@/data";

export default class SideBarPagesDetails {
  constructor({
    $target,
    pageObject,
    setOpenedDetail,
    setAddDetail,
    openedDetail,
    depth,
  }) {
    this.state = pageObject;
    this.$target = $target;
    this.data = new Data();
    this.setOpenedDetail = setOpenedDetail;
    this.setAddDetail = setAddDetail;
    this.openedDetail = openedDetail;
    this.$depth = depth;
    this.$beforeSelected = 0;

    this.$sideBarPagesDetails = document.createElement("li");
    this.$sideBarPagesDetails.className = "sidebar__pages--detail";
    this.$sideBarPagesDetails.setAttribute("data-id", this.state.id);
    this.$sideBarPagesDetails.setAttribute("data-action", "select");
    this.$sideBarPagesDetails.style.setProperty("--depth", this.$depth);

    this.initialize();
    this.render();
    this.eventAdd();
  }

  initialize() {
    this.$sideBarPagesDetails.innerHTML = `
      <div class = "sidebar__pages--detail-contents">
        <button class = "sidebar__pages--detail-button" data-action='toggle'>
          <span class = "material-symbols-rounded"> description </span>
        </button>
        <span class = 'sidebar__pages--detail-title'>
          ${this.state.id || "제목 없음"}
        </span>
      </div>
      <div class = "sidebar__pages--detail-toolkit">
        <button class = "sidebar__pages--detail-button" data-action='remove'>
          <span class = "material-symbols-rounded"> remove </span>
        </button>
        <button class = "sidebar__pages--detail-button" data-action='add'>
          <span class = "material-symbols-rounded"> add </span>
        </button>
      </div>
    `;
    this.$target.appendChild(this.$sideBarPagesDetails);
  }

  render() {
    const selected = getItem("selected");
    // const titleElement = this.$sideBarPagesDetails.querySelector(
    //   ".sidebar__pages--detail-title"
    // );
    // titleElement.textContent = this.state.title || "제목 없음";
    if (this.state.id !== this.$beforeSelected) {
      document
        .querySelector(
          `.sidebar__pages--detail[data-id="${this.$beforeSelected}"]`
        )
        ?.classList.remove("highlight");
    }
    if (this.state.id === selected) {
      this.$sideBarPagesDetails.classList.add("highlight");
    }
  }

  eventAdd() {
    const $sideBarPagesDetailsToolkit = document.createElement("div");
    const $targetContainer = this.$sideBarPagesDetails.querySelector(
      ".sidebar__pages--detail-container"
    );
    const icon = this.$sideBarPagesDetails.querySelector(
      ".sidebar__pages--detail-button .material-symbols-rounded"
    );
    let isHovered = false;

    this.$sideBarPagesDetails.addEventListener("click", this.clickEventAdd);
    this.$sideBarPagesDetails.addEventListener("mouseover", () => {
      if (!isHovered) {
        if (this.openedDetail.has(this.state.id)) {
          icon.textContent = "keyboard_arrow_down";
        } else icon.textContent = "keyboard_arrow_right";
        isHovered = true;
      }
    });
    this.$sideBarPagesDetails.addEventListener("mouseleave", () => {
      icon.textContent = "description";
      isHovered = false;
    });
  }

  clickEventAdd = async (e) => {
    if (e.target.closest(".sidebar__pages--detail-button")) {
      const action = e.target.closest(".sidebar__pages--detail-button").dataset
        .action;
      switch (action) {
        case "toggle":
          this.setOpenedDetail(this.state.id);
          console.log("Toggle action triggered");
          break;
        case "remove":
          await this.data.deleteDocumentStructure(this.state.id).then(() => {
            push(`/`);
          });
          console.log("Remove action triggered");
          break;
        case "add":
          await this.data.addDocumentStructure(this.state.id).then((x) => {
            push(`/${x.id}`);
            this.setAddDetail(this.state.id);
            this.$beforeSelected = getItem("selected");
            setItem("selected", x.id);
            this.render();
          });
          console.log("Add action triggered");
          break;
      }
    } else {
      const action = e.target.closest(".sidebar__pages--detail").dataset.action;
      if (action === "select") {
        console.log("Select action triggered");
        push(`/${this.state.id}`);
        this.$beforeSelected = getItem("selected");
        setItem("selected", this.state.id);
        this.render();
      }
    }
  };
}
