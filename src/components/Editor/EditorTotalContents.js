import Data from "@/data";
import { Component } from "@core";
import { debounce, executeWithTryCatch } from "@utils";

export default class EditorTotalContents extends Component {
  setup() {
    this.data = new Data();
    this.state = { ...this.props };
    this.currentTitle = this.props.totalContents.title;
    this.currentContents = this.props.totalContents.content;
    this.setInput = async (newState) => {
      const prevTitle = this.props.title;
      const prevContent = this.props.content;

      if (newState.title !== prevTitle || newState.content !== prevContent) {
        await executeWithTryCatch(async () => {
          const pages = this.data.editDocument(
            this.state.current_documentId,
            newState.title || prevTitle,
            newState.content || prevContent
          );
          console.log("문서 업데이트됨:", {
            title: newState.title || prevTitle,
            content: newState.content || prevContent,
          });
        }, "Error get document structure EditorTotalContents");
      }
    };
    this.debounceSetInput = debounce(this.setInput, 1000);
  }

  template() {
    return `
      <input name="title" type="text" placeholder = "제목 없음" class = "editor__input-title" value = "${this.state.totalContents.title}"/>
      `;
  }

  setEvent() {
    this.addEvent("keyup", "[name=title]", (e) => {
      if (this.currentTitle !== e.target.value) {
        this.currentTitle = e.target.value;
        this.debounceSetInput({ title: e.target.value });
      }
    });
  }

  mounted() {
    const inputTitle = this.$target.querySelector("[name=title]");
    inputTitle.value = this.state.totalContents.title;
  }
}
