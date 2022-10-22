import { RenderableComponent } from "../../../../component.js";
import { EventObject } from "../../../../events.js";
import { handleEvent } from "../../../../handlers/event.js";
import { callFunctionFromGlobalScope } from "../../../../utils/functions.js";
import { ActionStore } from "../../../stores/actions.js";
import { type DisplayCardsAction } from "./display_cards.js";
import { type OpenLink } from "./open_link.js";

/**
 * @summary custom implementation to use in Add-In menus
 */
export class UniversalAction extends RenderableComponent {
  private functionName?: string;
  private text?: string;

  /**
   * @summary gets text of this universal action
   */
  private getText() {
    const { text } = this;
    if (!text) {
      throw new Error("universal actions must have text set");
    }
    return text;
  }

  /**
   * @summary runs the function of this universal action
   */
  run() {
    const { functionName } = this;
    if (!functionName) {
      throw new Error("universal actions must have a function name set");
    }

    return callFunctionFromGlobalScope<OpenLink | DisplayCardsAction>(
      functionName,
      new EventObject()
    );
  }

  /**
   * @summary sets a function to run
   * @param name name of the function
   */
  setRunFunction(name: string) {
    this.functionName = name;
    return this;
  }

  /**
   * @summary sets text to this action
   * @param text action text
   */
  setText(text: string) {
    this.text = text;
    return this;
  }

  create(): HTMLElement {
    const text = this.getText();
    const action = this.run();

    const wrapper = document.createElement("div");
    wrapper.classList.add("menuItem");

    const textElement = document.createElement("p");
    textElement.classList.add("menuText");
    textElement.textContent = text;

    // TODO: handle actions with icons

    ActionStore.set(wrapper, action);
    wrapper.addEventListener("click", () => handleEvent(wrapper));

    wrapper.append(textElement);
    return wrapper;
  }
}
