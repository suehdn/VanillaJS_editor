export default class SideBarPagesDetails {
  constructor({ $target, pageObject, depth }) {
    this.state = pageObject;
    this.$target = $target;
    this.$depth = depth;
    this.$sideBarPagesDetails = document.createElement("li");
    this.$sideBarPagesDetails.className = "sidebar__pages--detail";

    this.render();
  }

  render() {
    this.$sideBarPagesDetails.innerHTML = `
      <div class = 'sidebar__pages--detail-container' style = '--depth: ${
        this.$depth
      }'>
        <button data-action='toggle'>
          <i class = "sidebar"> > </i>
        </button>
        <div class = 'sidebar__pages--detail-title'>
          ${this.state.title || "제목 없음"}
        </div>
      </div>
    `;
    this.$target.appendChild(this.$sideBarPagesDetails);
  }
}
