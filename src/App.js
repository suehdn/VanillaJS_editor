import { Component } from "@core";
import SideBar from "./SideBar.js";
import Editor from "./Editor.js";

import { initRouter } from "./router.js";

export default class App extends Component {
  setup() {
    initRouter(() => {});
  }
  template() {
    return `<aside class="sidebar__aside--flex">
      <section class="sidebar__header"></section>
      <section class="sidebar__pages"></section>
    </aside>
    <div class="editor__div--flex">
      <div class="editor"></div>
    </div>`;
  }
  mounted() {
    new SideBar({
      $target: this.$target,
    });
    new Editor({
      $target: this.$target,
    });
  }
}
