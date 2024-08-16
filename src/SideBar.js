import { push } from "./router.js";
import Data from "./data.js";
import { SideBarHeader, SideBarPages } from "@components";
/**
 * SideBar를 만들어주는 컴포넌트
 */
export default class SideBar {
  constructor({ $target, initialState, editorsetState }) {
    this.$target = $target;
    this.$page = document.createElement("aside");
    this.$page.className = "sidebar__aside--flex";
    this.sideBarHeader = new SideBarHeader({ $target: this.$page });
    new SideBarPages({ $target: this.$page, initialState, editorsetState });
    this.$target.appendChild(this.$page);
  }
}
