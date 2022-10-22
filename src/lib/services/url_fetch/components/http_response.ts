namespace Components {
  /**
   * @see https://developers.google.com/apps-script/reference/url-fetch/http-response
   */
  export class HTTPResponse {
    constructor(private request: XMLHttpRequest) {}

    /**
     * @see https://developers.google.com/apps-script/reference/url-fetch/http-response#getallheaders
     *
     * @summary Returns an attribute/value map of headers for the HTTP response, with headers that have multiple values returned as arrays.
     */
    getAllHeaders() {
      const { request } = this;

      const headerLines = request
        .getAllResponseHeaders()
        .trim()
        .split(/[\r\n]+/);

      const headers: Record<string, string | string[]> = {};
      headerLines.forEach((line) => {
        const [name, ...parts] = line.split(": ");
        const value = parts.join(": ");

        const existing = headers[name];

        if (existing) {
          headers[name] =
            typeof existing === "string"
              ? [existing, value]
              : [...existing, value];
          return;
        }

        headers[name] = value;
      });

      return headers;
    }

    /**
     * @see https://developers.google.com/apps-script/reference/url-fetch/http-response#getascontenttype
     *
     * @summary Return the data inside this object as a blob converted to the specified content type.
     * @param contentType The MIME type to convert to.
     */
    getAs(contentType: string) {
      const blob = this.getBlob();
      blob.setContentType(contentType);
      return blob;
    }

    /**
     * @see https://developers.google.com/apps-script/reference/url-fetch/http-response#getblob
     * 
     * @summary Return the data inside this object as a blob.
     */
    getBlob() {
      const { response } = this.request;

      const blob = new _Blob();

      if (typeof response === "string") {
        blob.setDataFromString(response);
      }

      if (response instanceof ArrayBuffer) {
        blob.setBytes([...new Uint8Array(response)]);
      }

      if (response instanceof Document) {
        blob.setDataFromString(response.documentElement.outerHTML);
      }

      if (typeof response === "object") {
        blob.setDataFromString(JSON.stringify(response));
      }

      return blob;
    }

    /**
     * @see https://developers.google.com/apps-script/reference/url-fetch/http-response#getcontent
     *
     * @summary Gets the raw binary content of an HTTP response.
     */
    getContent() {
      return this.getBlob().getBytes();
    }

    /**
     * @see https://developers.google.com/apps-script/reference/url-fetch/http-response#getcontenttextcharset
     *
     * @summary Returns the content of an HTTP response encoded as a string of the given charset.
     * @param charset a string representing the charset to be used for encoding the HTTP response content
     */
    getContentText(charset = "UTF-8") {
      return this.getBlob().getDataAsString(charset);
    }

    /**
     * @see https://developers.google.com/apps-script/reference/url-fetch/http-response#getheaders
     *
     * @summary Returns an attribute/value map of headers for the HTTP response.
     */
    getHeaders() {
      const { request } = this;

      const headerLines = request
        .getAllResponseHeaders()
        .trim()
        .split(/[\r\n]+/);

      const headers: Record<string, string> = {};
      headerLines.forEach((line) => {
        const [name, ...parts] = line.split(": ");
        headers[name] = parts.join(": ");
      });

      return headers;
    }

    /**
     * @see https://developers.google.com/apps-script/reference/url-fetch/http-response#getresponsecode
     *
     * @summary Get the HTTP status code (200 for OK, etc.) of an HTTP response.
     */
    getResponseCode() {
      return this.request.status;
    }
  }
}
