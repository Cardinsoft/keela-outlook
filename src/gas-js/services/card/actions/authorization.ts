/**
 * @see https://developers.google.com/apps-script/reference/card-service/authorization-action
 */
export class AuthorizationAction {
  url?: string;

  /**
   * @see https://developers.google.com/apps-script/reference/card-service/authorization-action#setauthorizationurlauthorizationurl
   *
   * @summary Sets the authorization URL that user is taken to from the authorization prompt. Required.
   * @param authorizationUrl The authorization URL to set.
   */
  setAuthorizationUrl(authorizationUrl: string) {
    this.url = authorizationUrl;
    return this;
  }
}
