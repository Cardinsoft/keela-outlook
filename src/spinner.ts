import { Component } from "./component.js";

export type SpinnerSize = "large" | "small";

export class Spinner extends Component {
  private size: SpinnerSize = "small";

  setSize(size: SpinnerSize) {
    const { element, size: oldSize } = this;

    this.size = size;

    element.classList.remove(`spinner-${oldSize}`);
    element.classList.add(`spinner-${size}`);

    return this;
  }

  create(parentId: string) {
    const { size } = this;

    const spinner = document.createElement("div");
    spinner.classList.add("spinner", `spinner-${size}`);

    const parent = document.getElementById(parentId);
    if (!parent) {
      throw new Error(`missing spinner parent: #${parentId}`);
    }

    parent.append(spinner);
    return spinner;
  }
}
