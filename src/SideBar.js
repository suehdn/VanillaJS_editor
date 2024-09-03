import Data from "./data.js";
import { Component } from "@core";
import { SideBarHeader, SideBarPages } from "@components";
import { getItem } from "./stores/localStorage.js";

export default class SideBar extends Component {
  setup() {
    this.data = new Data();
    this.sideBarPages = null;
  }
  mounted() {
    const $sidebarHeader = this.$target.querySelector(".sidebar__header");
    const $sidebarPages = this.$target.querySelector(".sidebar__pages");

    new SideBarHeader({
      $target: $sidebarHeader,
    });
    this.data.getDocumentStructure().then((x) => {
      this.sideBarPages = new SideBarPages({
        $target: $sidebarPages,
        props: x,
      });
    });
  }
}
