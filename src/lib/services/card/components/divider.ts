import { RenderableComponent } from "../../../../component";

/**
 * @see https://developers.google.com/apps-script/reference/card-service/divider
 */
export class Divider extends RenderableComponent {
  create(): HTMLElement {
    const element = document.createElement("hr");
    element.classList.add("card-divider");
    return element;
  }
}
