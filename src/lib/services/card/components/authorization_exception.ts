namespace Components {
  /**
   * @see https://developers.google.com/apps-script/reference/card-service/authorization-exception
   */
  export class AuthorizationException extends InspectableComponent {
    private authUrl?: string;
    private callback?: string;
    private name?: string;

    /**
     * @see https://developers.google.com/apps-script/reference/card-service/authorization-exception#setauthorizationurlauthurl
     *
     * @summary Sets the authorization URL that user is taken to from the authorization prompt. Required.
     * @param authUrl The authorization URL to set.
     */
    setAuthorizationUrl(authUrl: string) {
      this.authUrl = authUrl;
      return this;
    }

    /**
     * @see https://developers.google.com/apps-script/reference/card-service/authorization-exception#setcustomuicallbackcallback
     *
     * @summary The name of a function to call to generate a custom authorization prompt. Optional.
     * @param callback The name of the function that generates a custom authorization prompt.
     */
    setCustomUiCallback(callback: string) {
      this.callback = callback;
      return this;
    }

    /**
     * @see https://developers.google.com/apps-script/reference/card-service/authorization-exception#setresourcedisplaynamename
     *
     * @summary Sets the name that is displayed to the user when asking for authorization. Required.
     * @param name The display name.
     */
    setResourceDisplayName(name: string) {
      this.name = name;
      return this;
    }

    /**
     * @see https://developers.google.com/apps-script/reference/card-service/authorization-exception#throwexception
     *
     * @summary Triggers this exception to be thrown.
     */
    throwException() {
      const { authUrl, callback, name } = this;

      if (!authUrl) {
        throw new Error("AuthorizationException must have an auth URL set");
      }

      if (!name) {
        throw new Error("AuthorizationException must have a name set");
      }

      if (callback) {
        // TODO: future release
      }
    }
  }
}
