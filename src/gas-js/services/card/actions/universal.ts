import { RenderableComponent } from "../../../../gas-js/components";
import { EventObject } from "../../../../gas-js/events";
import { handleEvent } from "../../../../gas-js/handlers/event";
import { ActionStore } from "../../../../gas-js/stores/actions";
import { callFunctionFromGlobalScope } from "../../../../gas-js/utils/functions";
import { type Card } from "../components/card";
import { DisplayCardsAction } from "./display_cards";
import { type OpenLink } from "./open_link";

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

    // TODO: allow background actions (return type: undefined)

    const maybeAction = callFunctionFromGlobalScope<OpenLink | Card>(
      functionName,
      new EventObject()
    );

    return window.CardServiceConfig.isInstance<typeof Card>(maybeAction, "Card")
      ? new DisplayCardsAction().setCards([maybeAction])
      : maybeAction;
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
    wrapper.classList.add("menu-item");

    const textElement = document.createElement("p");
    textElement.classList.add("menu-item-text");
    textElement.textContent = text;

    // TODO: handle actions with icons

    wrapper.addEventListener("click", () => {
      ActionStore.set(wrapper, action);
      handleEvent(wrapper);
    });

    wrapper.append(textElement);
    return wrapper;
  }
}
