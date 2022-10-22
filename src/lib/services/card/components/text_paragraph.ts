import { RenderableComponent } from "../../../../component";
import { parseHTMLWidgetContent } from "../../../../utils/html";

/**
 * @see https://developers.google.com/apps-script/reference/card-service/text-paragraph
 */
export class TextParagraph extends RenderableComponent {
  private text?: string;

  /**
   * @see https://developers.google.com/apps-script/reference/card-service/text-paragraph#settexttext
   *
   * @summary Sets the text of the paragraph. Required.
   * @param text The text to display.
   */
  setText(text: string) {
    this.text = text;
    return this;
  }

  create(): HTMLElement {
    const { text } = this;

    if (!text) {
      throw new Error("TextParagraph must have text set");
    }

    const wrapper = document.createElement("div");
    wrapper.classList.add("row");

    const contentText = document.createElement("span");
    contentText.classList.add("ms-font-m-plus");
    wrapper.append(contentText);

    parseHTMLWidgetContent(contentText, text);

    return wrapper;
  }
}
