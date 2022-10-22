import { BorderType } from "../enums.js";

/**
 * @see https://developers.google.com/apps-script/reference/card-service/border-style
 */
export class BorderStyle {
  color: string = "#000";
  radius?: number;
  type: BorderType = BorderType.NO_BORDER;

  /**
   * @see https://developers.google.com/apps-script/reference/card-service/border-style#setcornerradiusradius
   *
   * @summary Sets the corner radius of the border, for example 8.
   * @param radius The corner radius to be applied to the border.
   */
  setCornerRadius(radius: number) {
    this.radius = radius;
    return this;
  }

  /**
   * @see https://developers.google.com/apps-script/reference/card-service/border-style#setstrokecolorcolor
   *
   * @summary Sets the color of the border.
   * @param color The color in #RGB format to be applied to the border.
   */
  setStrokeColor(color: string) {
    this.color = color;
    return this;
  }

  /**
   * @see https://developers.google.com/apps-script/reference/card-service/border-style#settypetype
   *
   * @summary Sets the type of the border.
   * @param type The border type.
   */
  setType(type: BorderType) {
    this.type = type;
    return this;
  }
}
