type OverlayTone = "light" | "dark";

class Overlay extends Component {
  private color: string = "white";

  private tone: OverlayTone = "light";

  constructor(parentId: string, private containerId: string) {
    super(parentId);
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
   * @param parentId id of the parent element
   */
  create(parentId: string) {
    const overlay = document.createElement("div");
    overlay.classList.add("overlay");
    overlay.classList.add(`overlay-${this.tone}`);
    overlay.hidden = true;

    overlay.style.backgroundColor = this.color;

    const parent = document.getElementById(parentId);
    if (!parent) {
      throw new Error(`missing overlay parent: #${parentId}`);
    }

    parent.append(overlay);
    return overlay;
  }

  /**
   * @summary adjusts overlay size to cover the app body
   */
  cover() {
    const { containerId, element } = this;

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
