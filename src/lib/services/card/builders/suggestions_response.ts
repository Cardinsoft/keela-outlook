/**
 * @see https://developers.google.com/apps-script/reference/card-service/suggestions-response-builder
 */
class SuggestionsResponseBuilder extends CardServiceBuilder<Components.SuggestionsResponse> {
  private suggestions?: Components.Suggestions;

  /**
   * @see https://developers.google.com/apps-script/reference/card-service/suggestions-response-builder#build
   *
   * @summary Builds the current suggestions response and validates it.
   */
  build() {
    const response = new Components.SuggestionsResponse({
      suggestions: this.suggestions,
    });

    super.build(response);

    return response;
  }

  /**
   * @see https://developers.google.com/apps-script/reference/card-service/suggestions-response-builder#setSuggestions(Suggestions)
   *
   * @summary Sets the suggestions used in auto complete in text fields.
   * @param suggestions The {@link Components.Suggestions} to use.
   */
  setSuggestions(suggestions: Components.Suggestions) {
    this.suggestions = suggestions;
    return this;
  }

  protected validate(): boolean {
    return !!this.suggestions;
  }
}
