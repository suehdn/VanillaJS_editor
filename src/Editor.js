import { Component } from "@core";
import { push, getDocumentId } from "./router.js";
import { EditorTotalContents } from "@components";
import Data from "./data.js";
import { store_documentId, setID } from "@stores";
import { executeWithTryCatch } from "@utils";
import { mainText, quickStartText } from "@constants";

export default class Editor extends Component {
  setup() {
    this.data = new Data();
    this.$editorTotalContents = this.$target.querySelector(".editor");
    this.editorTotalContents = null;
    this.current_documentId = null;
    this.state = {
      title: "",
      content: "",
    };
    store_documentId.dispatch(setID(getDocumentId()));
    store_documentId.subscribe(() => {
      this.render();
    });
  }

  async mounted() {
    this.current_documentId = store_documentId.getState().documentId;

    if (!this.editorTotalContents && this.current_documentId * 1) {
      this.editorTotalContents = new EditorTotalContents({
        $target: this.$editorTotalContents,
        props: {
          current_documentId: this.current_documentId,
          totalContents: { ...this.state },
        },
      });
    }
    if (!(this.current_documentId * 1)) {
      switch (this.current_documentId) {
        case "main":
          new EditorTotalContents({
            $target: this.$editorTotalContents,
            props: {
              totalContents: {
                title: mainText.title,
                content: mainText.contents,
              },
            },
          });
          break;
        case "quick_start":
          new EditorTotalContents({
            $target: this.$editorTotalContents,
            props: {
              totalContents: {
                title: quickStartText.title,
                content: quickStartText.contents,
              },
            },
          });
          break;
      }
    } else {
      await executeWithTryCatch(async () => {
        const document = await this.data.getDocumentContent(
          this.current_documentId
        );
        this.editorTotalContents.setState({
          current_documentId: this.current_documentId,
          totalContents: {
            title: document.title,
            content: document.content,
          },
        });
      }, "Error get document structure Editor");
    }
  }
}
