import Data from "@/data";
import { Component } from "@core";
import { debounce } from "@utils";

export default class EditorTotalContents extends Component {
  setup() {
    this.data = new Data();
    this.state = { ...this.props };
    this.currentTitle = this.props.totalContents.title;
    this.currentContents = this.props.totalContents.content;
    this.setInput = (newState) => {
      const prevTitle = this.props.title;
      const prevContent = this.props.content;

      if (newState.title !== prevTitle || newState.content !== prevContent) {
        this.data
          .editDocument(
            this.state.current_documentId,
            newState.title || prevTitle,
            newState.content || prevContent
          )
          .then((x) => {
            console.log("문서 업데이트됨:", {
              title: newState.title || prevTitle,
              content: newState.content || prevContent,
            });
          });
      }
    };
    this.debounceSetInput = debounce(this.setInput, 1000);
  }

  template() {
    // console.log("에디터 템플릿", this.state.totalContents.title);
    return `
      <input name="title" type="text" placeholder = "제목 없음" class = "editor__input-title" value = "${this.state.totalContents.title}"/>
      `;
  }

  setEvent() {
    // console.log("Setting event listener");
    this.addEvent("keyup", "[name=title]", (e) => {
      if (this.currentTitle !== e.target.value) {
        this.currentTitle = e.target.value;
        this.debounceSetInput({ title: e.target.value });
      }
    });
  }

  mounted() {
    // console.log("에디터 마운트", this.state);
    const inputTitle = this.$target.querySelector("[name=title]");
    inputTitle.value = this.state.totalContents.title;
  }
}
