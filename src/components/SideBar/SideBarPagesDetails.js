export default class SideBarPagesDetails {
  constructor({ $target, pageObject, depth }) {
    this.state = pageObject;
    this.$target = $target;
    this.$depth = depth;
    this.$sideBarPagesDetails = document.createElement("li");
    this.$sideBarPagesDetails.className = "sidebar__pages--detail";

    this.render();
    this.eventAdd();
  }

  render() {
    this.$sideBarPagesDetails.innerHTML = `
      <div class = 'sidebar__pages--detail-container' style = '--depth: ${
        this.$depth
      }'>
        <button class = "sidebar__pages--detail-button" data-action='toggle'>
          <span class = "material-symbols-rounded"> description </span>
        </button>
        <div class = 'sidebar__pages--detail-title'>
          ${this.state.title || "제목 없음"}
        </div>
      </div>
    `;
    this.$target.appendChild(this.$sideBarPagesDetails);
  }

  eventAdd() {
    const button = this.$sideBarPagesDetails.querySelector(
      ".sidebar__pages--detail-button"
    );
    const icon = button.querySelector(".material-symbols-rounded");
    let isHovered = false;

    this.$sideBarPagesDetails.addEventListener("mouseover", () => {
      if (!isHovered) {
        icon.textContent = "keyboard_arrow_right";
        isHovered = true;
      }
    });

    this.$sideBarPagesDetails.addEventListener("mouseleave", () => {
      icon.textContent = "description";
      isHovered = false;
    });
  }
}
