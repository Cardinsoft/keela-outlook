import { ImageCropType } from "../enums";

/**
 * @see https://developers.google.com/apps-script/reference/card-service/image-crop-style
 */
export class ImageCropStyle {
  ratio?: number;
  type: ImageCropType = ImageCropType.SQUARE;

  /**
   * @see https://developers.google.com/apps-script/reference/card-service/image-crop-style#setaspectratioratio
   *
   * @summary Sets the aspect ratio to use if the crop type is {@link ImageCropType.RECTANGLE_CUSTOM}.
   * @param ratio
   */
  setAspectRatio(ratio: number) {
    const { type } = this;

    if (type !== ImageCropType.RECTANGLE_CUSTOM) {
      return this;
    }

    if (ratio < 0) {
      throw new Error("aspect ratio must be a positive value");
    }

    this.ratio = ratio;
    return this;
  }

  /**
   * @see https://developers.google.com/apps-script/reference/card-service/image-crop-style#setimagecroptypetype
   *
   * @summary Sets the crop type for the image. Default is {@link ImageCropType.SQUARE}.
   * @param type The crop type.
   */
  setImageCropType(type: ImageCropType) {
    this.type = type;
    return this;
  }
}
