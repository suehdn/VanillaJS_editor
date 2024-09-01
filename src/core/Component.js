export default class Component {
  $target;
  props;
  state;
  constructor({ $target, props }) {
    this.$target = $target;
    this.props = props;
    this.setup();
    this.render();
    this.setEvent();
  }

  setup() {}
  mounted() {}
  template() {
    return "";
  }
  render() {
    const { $target } = this;
    const virtualNode = $target.cloneNode(true);

    virtualNode.innerHTML = this.template();

    const realChildNodes = [...$target.childNodes];
    const virtualChildNodes = [...virtualNode.childNodes];
    const max = Math.max(realChildNodes.length, virtualChildNodes.length);
    for (let i = 0; i < max; i++) {
      updateNode($target, realChildNodes[i], virtualChildNodes[i]);
    }
    this.mounted();
  }
  setEvent() {}
  setState(newState) {
    this.state = { ...this.state, ...newState };
    this.render();
  }
  addEvent(eventType, selector, callback) {
    const children = [...this.$target.querySelectorAll(selector)];
    this.$target.addEventListener(eventType, (e) => {
      if (!e.target.closest(selector)) return false;
      callback(e);
    });
  }
}

const updateNode = (parent, realNode, virtualNode) => {
  if (realNode && !virtualNode) {
    return realNode.remove();
  }
  if (!realNode && virtualNode) {
    return parent.appendChild(virtualNode);
  }
  if (realNode instanceof Text && virtualNode instanceof Text) {
    if (realNode.nodeValue === virtualNode.nodeValue) return;
    return (realNode.nodeValue = virtualNode.nodeValue);
  }
  if (realNode.nodeName !== virtualNode.nodeName) {
    const index = [...parent.childNodes].indexOf(realNode);
    return (
      realNode.remove(),
      parent.insertBefore(virtualNode, parent.children[index] || null)
    );
  }
  updateAttributes(realNode, virtualNode);

  const virtualChildren = [...virtualNode.childNodes];
  const realChildren = [...realNode.childNodes];
  const max = Math.max(realChildren.length, virtualChildren.length);
  for (let i = 0; i < max; i++) {
    updateNode(realNode, realChildren[i], virtualChildren[i]);
  }
};

const updateAttributes = (realNode, virtualNode) => {
  for (const { name, value } of [...virtualNode.attributes]) {
    if (value === realNode.getAttribute(name)) continue;
    realNode.setAttribute(name, value);
  }
  for (const { name } of [...realNode.attributes]) {
    if (virtualNode.getAttribute(name) !== undefined) continue;
    realNode.removeAttribute(name);
  }
};
