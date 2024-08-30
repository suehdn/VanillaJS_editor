import Data from "./data.js";
import { Component } from "@core";
import { push } from "./router.js";
import { SideBarHeader, SideBarPages } from "@components";
import { getItem } from "./stores/localStorage.js";

export default class SideBar extends Component {
  setup() {
    this.data = new Data();
    this.sideBarPages = null;
    this.sideBarPagesRender = () => {
      this.data.getDocumentStructure().then((x) => {
        this.sideBarPages.setState({ pages: x, selected: getItem("selected") });
      });
    };
  }
  template() {
    return `<aside class="sidebar__aside--flex">
      <section class="sidebar__header"></section>
      <section class="sidebar__pages"></section>
    </aside>`;
  }

  mounted() {
    const $sidebarHeader = this.$target.querySelector(".sidebar__header");
    const $sidebarPages = this.$target.querySelector(".sidebar__pages");

    new SideBarHeader({
      $target: $sidebarHeader,
      props: {
        sideBarPagesRender: this.sideBarPagesRender,
      },
    });
    this.data.getDocumentStructure().then((x) => {
      this.sideBarPages = new SideBarPages({
        $target: $sidebarPages,
        props: x,
      });
    });
  }
}
