export default class SideBarPagesDetails {
  constructor({ $target, pageObject, setOpenedDetail, openedDetail, depth }) {
    this.state = pageObject;
    this.$target = $target;
    this.setOpenedDetail = setOpenedDetail;
    this.openedDetail = openedDetail;
    this.$depth = depth;

    this.$sideBarPagesDetails = document.createElement("li");
    this.$sideBarPagesDetails.className = "sidebar__pages--detail";
    this.$sideBarPagesDetails.setAttribute("data-id", this.state.id);
    this.render();
    this.eventAdd();
  }

  render() {
    this.$sideBarPagesDetails.innerHTML = `
      <div class = 'sidebar__pages--detail-container' style = '--depth: ${
        this.$depth
      }'>
        <div class = 'sidebar__pages--detail-contents'>
          <button class = "sidebar__pages--detail-button" data-action='toggle'>
            <span class = "material-symbols-rounded"> description </span>
          </button>
          <div class = 'sidebar__pages--detail-title'>
            ${this.state.title || "제목 없음"}
          </div>
        </div>
      </div>
    `;
    this.$target.appendChild(this.$sideBarPagesDetails);
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

    this.$sideBarPagesDetails.addEventListener("mouseover", () => {
      if (!isHovered) {
        if (this.openedDetail.has(this.state.id)) {
          icon.textContent = "keyboard_arrow_down";
        } else icon.textContent = "keyboard_arrow_right";
        isHovered = true;
        $sideBarPagesDetailsToolkit.className =
          "sidebar__pages--detail-toolkit";
        $sideBarPagesDetailsToolkit.innerHTML = `
          <button class = "sidebar__pages--detail-button" data-action='remove'>
            <span class = "material-symbols-rounded"> remove </span>
          </button>
          <button class = "sidebar__pages--detail-button" data-action='add'>
            <span class = "material-symbols-rounded"> add </span>
          </button>
        `;
        $targetContainer.appendChild($sideBarPagesDetailsToolkit);
        this.$sideBarPagesDetails.addEventListener(
          "click",
          this.toolkitEventAdd
        );
      }
    });

    this.$sideBarPagesDetails.addEventListener("mouseleave", () => {
      icon.textContent = "description";
      isHovered = false;
      $targetContainer.removeChild($sideBarPagesDetailsToolkit);
    });
  }

  toolkitEventAdd = (e) => {
    if (e.target.closest(".sidebar__pages--detail-button")) {
      const action = e.target.closest(".sidebar__pages--detail-button").dataset
        .action;
      switch (action) {
        case "toggle":
          this.setOpenedDetail(this.state.id);
          console.log("Toggle action triggered");
          break;
        case "remove":
          console.log("Remove action triggered");
          break;
        case "add":
          console.log("Add action triggered");
          break;
      }
    }
  };
}
