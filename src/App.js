import SideBar from "./SideBar.js";
import Editor from "./Editor.js";
import { initRouter } from "./router.js";
import Component from "./core/Component.js";

export default class App extends Component {
  setup() {
    initRouter(() => {});
  }
  mounted() {
    new SideBar({
      $target: this.$target,
    });
  }
}

// export default class App {
//   constructor({ $target }) {
//     this.$target = $target;
//     this.data = new Data();
//     this.data.getDocumentStructure().then((x) => {
//       this.editor = new Editor({
//         $target: this.$target,
//         initialState: {},
//         onEditing: (post) => {
//           if (this.timer !== null) {
//             clearTimeout(this.timer);
//           }
//           if (this.sideBar.state.postId) {
//             this.timer = setTimeout(async () => {
//               this.data
//                 .editDocument(
//                   this.sideBar.state.postId,
//                   post.title,
//                   post.content
//                 )
//                 .then((documentStructure) => {
//                   this.sideBar.setState({ list: documentStructure });
//                   this.data
//                     .getDocumentContent(this.sideBar.state.postId)
//                     .then((content) => {
//                       this.editor.setState(content);
//                     });
//                 });
//             }, 1000);
//           }
//         },
//       });
//       this.sideBar = new SideBar({
//         $target: this.$target,
//         props: x,
//       });
//       // this.route();
//     });
//     initRouter(() => this.route());
//   }

//   route = () => {
//     const { pathname } = window.location;
//     if (pathname === "/") {
//       this.sideBar.setState();
//     }
//     if (pathname.indexOf("/documents/") === 0) {
//       const [, , postId] = pathname.split("/");
//       this.sideBar.setState({ postId: postId });
//     }
//   };
// }
