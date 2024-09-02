import { Component } from "@core";
import { push, getDocumentId } from "./router.js";
import { EditorTitle } from "@components";
import Data from "./data.js";
import { store_documentId, setID } from "@stores";

export default class Editor extends Component {
  setup() {
    this.data = new Data();
    this.state = {
      title: "",
      content: "",
    };
    store_documentId.subscribe(() => {
      console.log("구독");
      this.render();
    });
    store_documentId.dispatch(setID(getDocumentId()));
  }
  mounted() {
    const $editorTitle = this.$target.querySelector(".editor__title");
    const $editorContent = this.$target.querySelector(".editor__content");
    const current_documentId = store_documentId.getState().documentId;

    if (current_documentId * 1) {
      this.data.getDocumentContent(current_documentId).then((x) => {
        new EditorTitle({
          $target: $editorTitle,
          props: {
            title: x.title,
            setTitle: (title) => {
              this.setState({ title });
            },
          },
        });
        console.log(x);
      });
    } else {
      console.log("다른 페이지");
    }

    console.log("에디터 타이틀 렌더링");
    console.log(store_documentId.getState().documentId);
    console.log("this.state", this.state);
  }
}
// export default class Editor {
//   constructor({
//     $target,
//     initialstate = { title: null, content: null },
//     onEditing,
//   }) {
//     this.$editor = document.createElement("div");
//     this.$target = $target;
//     this.state = initialstate;
//     this.timer = null;
//     this.postLocalSavekey = "";
//     this.onEditing = onEditing;
//     this.makeEditor();
//     this.eventAdd();
//   }
//   setState = (nextState, render = true) => {
//     this.state = nextState;
//     if (render) {
//       this.render();
//     }
//   };
//   render() {
//     if (this.state.content) {
//       const richContent = this.state.content
//         .replace(/div/g, "p")
//         .split("<p>")
//         .map((line) => {
//           if (line) {
//             if (line.indexOf("<br>") === 0) {
//               return "<br>";
//             } else if (line.indexOf("# ") === 0) {
//               return `<h1>${line.substring(2, line.length - 4)}</h1>`;
//             } else if (line.indexOf("## ") === 0) {
//               return `<h2>${line.substring(3, line.length - 4)}</h2>`;
//             } else if (line.indexOf("### ") === 0) {
//               return `<h3>${line.substring(4, line.length - 4)}</h3>`;
//             } else {
//               if (line.includes("</p>")) {
//                 return `<p>${line}`;
//               } else {
//                 return `<p>${line}</p>`;
//               }
//             }
//           }
//         })
//         .join("");
//       const nextState = {
//         ...this.state,
//         content: richContent,
//       };
//       this.setState(nextState, false);
//     }
//     this.makeEditor();
//   }
//   /**
//    *  문서 편집기를 만드는 함수
//    */
//   makeEditor() {
//     if (this.state.id) {
//       this.$editor.className = "editor__div--flex";
//       this.$target.appendChild(this.$editor);
//       this.$editor.innerHTML = `
//                 <input name="title" type="text" placeholder = "제목 없음" class = "editor__input" value = "${
//                   this.state.title
//                 }"/>
//                 <div class = "editor__input--area">
//                     <div name="content" contentEditable="true" placeholedr = "내용을 입력하세요." class = "editor__content">${
//                       this.state.content
//                     }</div>
//                     ${this.childPage(this.state.documents)}
//                 </div>
//             `;
//       this.eventAdd();
//     } else {
//       this.$editor.className = "editor__div--flex";
//       this.$target.appendChild(this.$editor);
//       this.$editor.innerHTML = `
//                 <input name="title" type="text" class = "editor__input" disabled/>
//                 <div name="content" contentEditable="false" placeholedr = "내용을 입력하세요." class = "editor__main--content">H의 Notion입니다.</br>자유롭게 문서를 작성해보세요!</div>
//             `;
//     }
//   }
//   /**
//    * 문자를 입력했을 때 입력 받은 문자열을 this.state에 넣어주는 함수
//    */
//   eventAdd() {
//     this.$editor.onclick = (e) => {
//       const $childPage = e.target.closest(".childPage");
//       if ($childPage) {
//         const { id } = $childPage.dataset;
//         push(`/documents/${id}`);
//       }
//     };
//     this.$editor
//       .querySelector("[name=title]")
//       .addEventListener("keyup", (e) => {
//         const nextState = {
//           ...this.state,
//           title: e.target.value,
//         };
//         this.setState(nextState, false);
//         this.onEditing(this.state);
//       });
//     this.$editor
//       .querySelector("[name=content]")
//       .addEventListener("keyup", (e) => {
//         const nextState = {
//           ...this.state,
//           content: e.target.innerHTML,
//         };
//         this.setState(nextState, false);
//         this.onEditing(this.state);
//       });
//   }
//   /**
//    * 하위 문서 링크 추가하는 함수
//    */
//   childPage(child) {
//     let pageLink = "";
//     child.forEach((element) => {
//       pageLink += `<p class = "childPage"  data-id=${element.id}>
//             <img src="../png/file_text_icon.png">
//             <span class = "filePage__text--page-summary">&nbsp;${element.title}</span>
//             <p>`;
//     });
//     return pageLink;
//   }
// }
