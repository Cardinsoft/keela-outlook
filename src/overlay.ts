import { RenderableComponent } from "./component";
import { parsePixelLength } from "./utils/html";

export type OverlayTone = "light" | "dark";

export class Overlay extends RenderableComponent {
  private color: string = "white";

  private tone: OverlayTone = "light";

  constructor(private containerId: string) {
    super();
  }

  /**
   * @summary sets overlay color
   * @param color new overlay color
   */
  setColor(color: string) {
    this.color = color;
    return this;
  }

  /**
   * @summary sets overlay tone
   * @param tone new overlay tone
   */
  setTone(tone: OverlayTone) {
    this.tone = tone;
    return this;
  }

  /**
   * @summary creates the component element
   */
  create() {
    const { tone, color } = this;

    const overlay = document.createElement("div");
    overlay.classList.add("overlay");
    overlay.classList.add(`overlay-${tone}`);
    overlay.hidden = true;

    overlay.style.backgroundColor = color;
    return overlay;
  }

  /**
   * @summary adjusts overlay size to cover the app body
   */
  cover() {
    const { containerId } = this;

    const element = (this.element ||= this.create());

    const appContainer = document.getElementById(containerId);
    if (!appContainer) {
      throw new Error(`missing app container: #${containerId}`);
    }

    const bodyStyle = window.getComputedStyle(appContainer);
    const bodyHeight = parsePixelLength(bodyStyle.height) + 35;
    element.style.height = `${bodyHeight}px`;
    return this;
  }

  /**
   * @summary shows the overlay
   */
  hide() {
    this.cover();
    return super.hide();
  }

  /**
   * @summary shows the overlay
   */
  show() {
    this.cover();
    return super.show();
  }
}
