import Component from "@core/Component";
import { updateNode } from "@core/Component";

describe("Component Unit Test", () => {
  let $target;
  let component;

  beforeEach(() => {
    $target = document.createElement("div");
    document.body.appendChild($target);

    component = new Component({ $target, props: {} });
  });

  afterEach(() => {
    document.body.innerHTML = "";
  });

  test("Component 인스턴스를 만들 수 있는지 테스트", () => {
    expect(component).toBeInstanceOf(Component);
    expect(component.$target).toBe($target);
    expect(component.props).toEqual({});
  });
  test("초기화 단계에서 setup, render, setEvent가 호출 되는지 테스트", () => {
    const setupSpy = jest.spyOn(Component.prototype, "setup");
    const renderSpy = jest.spyOn(Component.prototype, "render");
    const setEventSpy = jest.spyOn(Component.prototype, "setEvent");

    new Component({ $target, props: {} });

    expect(setupSpy).toHaveBeenCalledTimes(1);
    expect(renderSpy).toHaveBeenCalledTimes(1);
    expect(setEventSpy).toHaveBeenCalledTimes(1);
  });
  test("template 메소드가 반환하는 HTML 테스트", () => {
    component.template = () => "<div>template HTML test</div>";
    component.render();
    expect($target.innerHTML).toBe("<div>template HTML test</div>");
  });
  test("state가 업데이트 될 때 re-render가 되는지 테스트", () => {
    component.template = () => `<div>${component.state.text || ""}</div>`;
    component.setState({ text: "Updated" });
    expect($target.innerHTML).toBe("<div>Updated</div>");
  });

  describe("eventHandler Unit Test", () => {
    let button;
    let callback;
    beforeEach(() => {
      button = document.createElement("button");
      $target.appendChild(button);
      callback = jest.fn();
      component.addEvent("click", "button", callback);
    });

    afterEach(() => {
      document.body.innerHTML = "";
    });

    test("선택자가 일치할 때 이벤트 핸들러가 올바르게 호출되는지 테스트", () => {
      button.click();
      expect(callback).toHaveBeenCalledTimes(1);
    });
    test("선택자가 일치하지 않을 때 이벤트 핸들러가 호출되지 않는지 테스트", () => {
      const unrelatedElement = document.createElement("div");
      document.body.appendChild(unrelatedElement);

      unrelatedElement.click();
      expect(callback).not.toHaveBeenCalled();
    });
  });

  describe("updateNode Unit Test", () => {
    let realNode = document.createElement("div");
    let virtualNode = document.createElement("div");

    beforeEach(() => {
      realNode = document.createElement("div");
      virtualNode = document.createElement("div");
      $target.appendChild(realNode);
    });

    afterEach(() => {
      document.body.innerHTML = "";
    });

    test("가상 DOM 요소의 Attribute가 그대로일 때 업데이트 되는지 테스트", () => {
      virtualNode.setAttribute("data", "data");
      realNode.setAttribute("data", "data");

      updateNode($target, realNode, virtualNode);

      expect(realNode.getAttribute("data")).toBe("data");
    });
    test("가상 DOM 요소의 Attribute가 추가되었을 때 업데이트 되는지 테스트", () => {
      virtualNode.setAttribute("data-test", "value");

      updateNode($target, realNode, virtualNode);

      expect(realNode.getAttribute("data-test")).toBe("value");
    });
    test("실제 DOM 요소의 Attribute가 삭제 되는지 테스트", () => {
      realNode.setAttribute("data-test", "value");
      expect(realNode.getAttribute("data-test")).toBe("value");
      expect(virtualNode.getAttribute("data-test")).toBe(null);

      updateNode($target, realNode, virtualNode);

      expect(realNode.getAttribute("data-test")).toBe(null);
    });
    test("실제 DOM 요소의 Node가 추가 되는지 테스트", () => {
      const virtualChildNode = document.createElement("div");
      virtualNode.appendChild(virtualChildNode);

      updateNode($target, realNode, virtualNode);

      const findDiv = [...realNode.childNodes].find(
        (child) => child.nodeName === "DIV"
      );
      expect(findDiv).not.toBe(undefined);
    });
    test("실제 DOM 요소의 Node가 삭제 되는지 테스트", () => {
      const realChildNode = document.createElement("div");
      realNode.appendChild(realChildNode);

      updateNode($target, realNode, virtualNode);

      const findDiv = [...realNode.childNodes].find(
        (child) => child.nodeName === "DIV"
      );
      expect(findDiv).toBe(undefined);
    });
    test("실제 DOM 요소의 Text가 다를 때 변경되는지 테스트", () => {
      const realTextNode = document.createTextNode("real");
      const virtualTextNode = document.createTextNode("virtual");
      realNode.appendChild(realTextNode);
      virtualNode.appendChild(virtualTextNode);

      updateNode($target, realNode, virtualNode);

      expect(realNode.textContent).toBe("virtual");
    });
    test("실제 DOM 요소의 Text가 같을 때 변경되지 않는지 테스트", () => {
      const realTextNode = document.createTextNode("real");
      const virtualTextNode = document.createTextNode("real");
      realNode.appendChild(realTextNode);
      virtualNode.appendChild(virtualTextNode);

      updateNode($target, realNode, virtualNode);

      expect(realNode.textContent).toBe("real");
    });
    test("실제 DOM 요소의 nodeName이 virtualNode와 다를 때 변경되는지 테스트", () => {
      const virtualAnotherNode = document.createElement("p");

      updateNode($target, realNode, virtualAnotherNode);

      const updatedNode = $target.firstChild;
      expect(updatedNode.nodeName).toBe("P");
    });
  });
});
