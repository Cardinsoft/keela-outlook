import { Blob } from "../base/blob.js";

/**
 * @see https://developers.google.com/apps-script/reference/utilities/utilities
 */
export class Utilities {
  /**
   * @see https://developers.google.com/apps-script/reference/utilities/utilities#newblobdata,-contenttype,-name
   *
   * @summary Create a new {@link Blob} object from a byte array, content type, and name.
   * @param data the bytes for the blob
   * @param contentType the content type of the blob - can be null
   * @param name the name of the blob - can be null
   */
  newBlob(data: string | number[], contentType?: string, name?: string) {
    const blob = new Blob();
    if (contentType) blob.setContentType(contentType);
    if (name) blob.setName(name);

    typeof data === "string"
      ? blob.setDataFromString(data)
      : blob.setBytes(data);

    return blob;
  }

  /**
   * @see https://developers.google.com/apps-script/reference/utilities/utilities#sleepmilliseconds
   *
   * @summary Sleeps for specified number of milliseconds.
   * @param milliseconds The number of milliseconds to sleep.
   */
  async sleep(milliseconds: number) {
    if (milliseconds < 0) {
      throw new RangeError(
        `milliseconds to sleep must be a positive integer, got ${milliseconds}`
      );
    }

    const ms = milliseconds > 3e5 ? 3e5 : milliseconds;

    return new Promise<void>((resolve) => {
      setTimeout(resolve, ms);
    });
  }
  /**
   * @see https://developers.google.com/apps-script/reference/utilities/utilities#base64decodeencoded
   *
   * @summary Decodes a base-64 encoded string into a UTF-8 byte array.
   * @param encoded the string of data to decode
   */
  base64Decode(encoded: string) {
    const blob = this.newBlob(atob(encoded));
    return blob.getBytes();
  }

  /**
   * @see https://developers.google.com/apps-script/reference/utilities/utilities#base64encodedata
   *
   * @summary Generates a base-64 encoded string from the given string or byte array.
   * @param input a string or byte[] of data to encode
   */
  base64Encode(input: string | number[]) {
    const blob = this.newBlob(input);
    return btoa(blob.getDataAsString());
  }
}
