/**
 * @see https://developers.google.com/apps-script/reference/base/blob
 */
class _Blob {
  protected content: ArrayBuffer = new ArrayBuffer(0);
  protected name: string | null = null;
  protected type: string | null = null;

  /**
   * @see https://developers.google.com/apps-script/reference/base/blob#copyBlob()
   *
   * @summary Returns a copy of this blob.
   */
  copyBlob() {
    const { type, name } = this;
    const blob = new _Blob();
    blob.setBytes(this.getBytes());
    if (name) blob.setName(name);
    if (type) blob.setContentType(type);
    return blob;
  }

  /**
   * @see https://developers.google.com/apps-script/reference/base/blob#getbytes
   *
   * @summary Gets the data stored in this blob.
   */
  getBytes() {
    const { content } = this;
    return [...new Uint8Array(content)];
  }

  /**
   * @see https://developers.google.com/apps-script/reference/base/blob#getdataasstring
   *
   * @summary Gets the data of this blob as a String with UTF-8 encoding.
   * @param charset The charset to use in encoding the data in this blob as a string.
   */
  getDataAsString(_charset?: string) {
    const { content } = this;
    const decoder = new TextDecoder();
    return decoder.decode(content);
  }

  /**
   * @see https://developers.google.com/apps-script/reference/base/blob#getname
   *
   * @summary Gets the name of this blob.
   */
  getName() {
    return this.name;
  }

  /**
   * @see https://developers.google.com/apps-script/reference/base/blob#setbytesdata
   *
   * @summary Sets the data stored in this blob.
   * @param data The new data.
   */
  setBytes(data: number[]) {
    this.content = Uint8Array.from(data).buffer;
    return this;
  }

  /**
   * @see https://developers.google.com/apps-script/reference/base/blob#setcontenttypecontenttype
   *
   * @summary Sets the content type of the bytes in this blob.
   * @param contentType The new contentType.
   */
  setContentType(contentType: string) {
    this.type = contentType;
    return this;
  }

  /**
   * @see https://developers.google.com/apps-script/reference/base/blob#setdatafromstringstring
   *
   * @summary Sets the data of this blob from a string with the specified encoding.
   * @param string The string data.
   * @param charset The charset to use in interpreting the string as bytes.
   */
  setDataFromString(string: string, _charset = "utf8") {
    const encoder = new TextEncoder();
    this.content = encoder.encode(string).buffer;
    return this;
  }

  /**
   * @see https://developers.google.com/apps-script/reference/base/blob#setnamename
   *
   * @summary Sets the name of this blob.
   * @param name The new name.
   */
  setName(name: string) {
    this.name = name;
    return this;
  }
}
