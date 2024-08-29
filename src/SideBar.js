import { Component } from "@core";
import { push } from "./router.js";
import { SideBarHeader, SideBarPages } from "@components";

export default class SideBar extends Component {
  setup() {
    console.log(this.$target);
  }
  template() {
    return `
      <aside class="sidebar__aside--flex">
        <section class="sidebar__header"></section>
        <section class="sidebar__pages"></section>
      </aside>
    `;
  }

  mounted() {
    const $sidebarHeader = this.$target.querySelector(".sidebar__header");
    const $sidebarPages = this.$target.querySelector(".sidebar__pages");
    new SideBarHeader({ $target: $sidebarHeader });
    new SideBarPages({ $target: $sidebarPages, props: this.props });
  }
}
