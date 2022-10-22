import { RenderableComponent } from "../../../../component";
import { TextButtonStyle } from "../enums";
import { type TextButton } from "./text_button";

/**
 * @see https://developers.google.com/apps-script/reference/card-service/fixed-footer
 */
export class FixedFooter extends RenderableComponent {
  private primary?: TextButton;
  private secondary?: TextButton;

  /**
   * @see https://developers.google.com/apps-script/reference/card-service/fixed-footer#setprimarybuttonbutton
   *
   * @summary Set the primary button in the fixed footer.
   * @param button The button to add.
   */
  setPrimaryButton(button: TextButton) {
    if (button.textButtonStyle !== TextButtonStyle.FILLED) {
      throw new Error(
        "The primary button must be a TextButtonStyle.FILLED button"
      );
    }
    this.primary = button;
    return this;
  }

  /**
   * @see https://developers.google.com/apps-script/reference/card-service/fixed-footer#setsecondarybuttonbutton
   *
   * @summary Set the secondary button in the fixed footer.
   * @param button The button to add.
   */
  setSecondaryButton(button: TextButton) {
    if (!this.primary) {
      return this;
    }

    if (button.textButtonStyle !== TextButtonStyle.TEXT) {
      throw new Error(
        "The secondary button must be a TextButtonStyle.TEXT button"
      );
    }

    this.secondary = button;
    return this;
  }

  async create(): Promise<HTMLElement> {
    const { primary, secondary } = this;

    const wrapper = document.createElement("div");
    wrapper.classList.add("ms-Grid", "card-fixed-footer");

    const row = document.createElement("div");
    row.classList.add("ms-Grid-row");
    wrapper.append(row);

    if (primary) {
      const element = await primary.render(row);
      element.classList.add("ms-Grid-col", "ms-sm6", "ms-md6", "ms-lg6");
    }

    if (secondary) {
      const element = await secondary.render(row);
      element.classList.add("ms-Grid-col", "ms-sm6", "ms-md6", "ms-lg6");
    }

    return wrapper;
  }
}
