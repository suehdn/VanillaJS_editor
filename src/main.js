import App from "./App.js";
import Toolbar from "./components/Toolbar.js";
import Toast from "./components/Toast.js";

const $appTarget = document.querySelector("#app");
const $toolbarTarget = document.querySelector("#toolbar");
const $toastTarget = document.querySelector("#toast");

new App({ $target: $appTarget });
new Toolbar({ $target: $toolbarTarget });
new Toast({ $target: $toastTarget });
