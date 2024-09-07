import Data from "./data.js";
import { Component } from "@core";
import { SideBarHeader, SideBarPages } from "@components";
import { getItem } from "./stores/localStorage.js";
import { executeWithTryCatch } from "@utils";

export default class SideBar extends Component {
  setup() {
    this.data = new Data();
    this.sideBarPages = null;
  }
  async mounted() {
    const $sidebarHeader = this.$target.querySelector(".sidebar__header");
    const $sidebarPages = this.$target.querySelector(".sidebar__pages");

    new SideBarHeader({
      $target: $sidebarHeader,
    });

    await executeWithTryCatch(async () => {
      const pages = await this.data.getDocumentStructure();
      this.sideBarPages = new SideBarPages({
        $target: $sidebarPages,
        props: pages.data,
      });
    }, "Error get document structure SideBar");
  }
}
