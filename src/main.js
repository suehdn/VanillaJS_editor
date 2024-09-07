import App from "./App.js";
import Toolbar from "./components/Toolbar.js";

const $appTarget = document.querySelector("#app");
const $toolbarTarget = document.querySelector("#toolbar");

new App({ $target: $appTarget });
new Toolbar({ $target: $toolbarTarget });
