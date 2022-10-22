import { BorderStyle } from "./border_style";
import { Button } from "./button";
import { type GridItem } from "./grid_item";

/**
 * @see https://developers.google.com/apps-script/reference/card-service/grid
 */
export class Grid extends Button {
  private borderStyle: BorderStyle = new BorderStyle();
  private items: GridItem[] = [];
  private numColumns: number = 1;
  private title?: string;

  /**
   * @see https://developers.google.com/apps-script/reference/card-service/grid#additemgriditem
   *
   * @summary Adds a new grid item to the grid.
   * @param gridItem The grid item to add.
   */
  addItem(gridItem: GridItem) {
    this.items.push(gridItem);
    return this;
  }

  /**
   * @see https://developers.google.com/apps-script/reference/card-service/grid#setborderstyleborderstyle
   *
   * @summary Sets the border style applied to each grid item. Default is NO_BORDER.
   * @param borderStyle The border style to apply.
   */
  setBorderStyle(borderStyle: BorderStyle) {
    this.borderStyle = borderStyle;
    return this;
  }

  /**
   * @see https://developers.google.com/apps-script/reference/card-service/grid#setnumcolumnsnumcolumns
   *
   * @summary The number of columns to display in the grid.
   * @param numColumns The number of columns.
   */
  setNumColumns(numColumns: number) {
    this.numColumns = numColumns < 1 ? 1 : numColumns > 3 ? 3 : numColumns;
    return this;
  }

  /**
   * @see https://developers.google.com/apps-script/reference/card-service/grid#settitletitle
   *
   * @summary Sets the title text of the grid. The text must be a plain string with no formatting.
   * @param title The title text.
   */
  setTitle(title: string) {
    this.title = title;
    return this;
  }

  create(): HTMLElement {
    const { numColumns, title, borderStyle } = this;

    if (numColumns || title || borderStyle) {
      // TODO: future releases
    }

    const wrapper = document.createElement("div");
    wrapper.classList.add("ms-Grid");
    return wrapper;
  }
}
