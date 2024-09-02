import { Component } from "@core";

export default class EditorTitle extends Component {
  setup() {}
  template() {
    return `
      <input name="title" type="text" placeholder = "제목 없음" class = "editor__input-title" value = "${this.props.title}"/>
      `;
  }
  mounted() {}
}
