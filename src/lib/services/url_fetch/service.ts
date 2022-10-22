type UrlFetchAdvancedParameters = {
  contentType?: string;
  headers?: Record<string, string>;
  method?: "get" | "post" | "put" | "patch" | "delete";
  payload?: string | Record<string, string>;
  validateHttpsCertificates?: boolean;
  followRedirects?: boolean;
  muteHttpExceptions?: boolean;
  escaping?: boolean;
};

/**
 * @see https://developers.google.com/apps-script/reference/url-fetch/url-fetch-app
 */
class UrlFetchApp {
  /**
   * @see https://developers.google.com/apps-script/reference/url-fetch/url-fetch-app#fetchurl,-params
   *
   * @summary Makes a request to fetch a URL using optional advanced parameters.
   * @param url The URL to fetch.
   * @param params The optional JavaScript object specifying advanced parameters
   */
  fetch(url: string, params: UrlFetchAdvancedParameters = {}) {
    const request = new XMLHttpRequest();

    try {
      request.timeout = 29000;
    } catch (error) {
      console.log(
        "Using older browser with poor request timeout support (expect timeout to differ from 30s)"
      );
    }

    const {
      contentType = "application/x-www-form-urlencoded",
      headers = {},
      method = "get",
      payload,
    } = params;

    request.open(method.toUpperCase(), url, false);

    request.setRequestHeader("endpoint", url);
    request.setRequestHeader("Content-Type", contentType);

    Object.entries(headers).forEach(([name, value]) => {
      request.setRequestHeader(name, value);
    });

    request.send(
      typeof payload === "object" ? payloadToFormData(payload) : payload
    );

    if (request.status === 500 && request.statusText === "DNS error") {
      throw new Error(`DNS error: ${url}`);
    }

    return new Components.HTTPResponse(request);
  }

  /**
   * @see https://developers.google.com/apps-script/reference/url-fetch/url-fetch-app#fetchallrequests
   *
   * @summary Makes multiple requests to fetch multiple URLs using optional advanced parameters.
   * @param requests An array of either URLs or JavaScript objects specifying requests
   */
  fetchAll(requests: Array<UrlFetchAdvancedParameters & { url: string }>) {
    return requests.map(({ url, ...params }) => {
      return this.fetch(url, params);
    });
  }

  /**
   * @see https://developers.google.com/apps-script/reference/url-fetch/url-fetch-app#getrequesturl,-params
   *
   * @summary Returns the request that is made if the operation were invoked.
   * @param url The URL to look up.
   * @param params An optional JavaScript object specifying advanced parameters
   */
  getRequest(url: string, params: UrlFetchAdvancedParameters = {}) {
    const {
      contentType = "application/x-www-form-urlencoded",
      headers = {},
      method = "get",
      payload,
    } = params;

    const request: UrlFetchAdvancedParameters & { url: string } = {
      contentType,
      headers,
      method,
      payload,
      url,
    };

    const optionalParamNames: Array<
      keyof Pick<
        UrlFetchAdvancedParameters,
        | "escaping"
        | "followRedirects"
        | "muteHttpExceptions"
        | "validateHttpsCertificates"
      >
    > = [
      "escaping",
      "followRedirects",
      "muteHttpExceptions",
      "validateHttpsCertificates",
    ];

    optionalParamNames.forEach((name) => {
      if (params[name] !== void 0) {
        request[name] = params[name];
      }
    });

    return request;
  }
}
