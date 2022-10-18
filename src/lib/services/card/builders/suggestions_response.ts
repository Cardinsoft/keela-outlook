/**
 * @see https://developers.google.com/apps-script/reference/card-service/suggestions-response-builder
 */
class SuggestionsResponseBuilder extends CardServiceBuilder<Components.SuggestionsResponse> {
  /**
   * @see https://developers.google.com/apps-script/reference/card-service/suggestions-response-builder#setSuggestions(Suggestions)
   *
   * @summary Sets the suggestions used in auto complete in text fields.
   * @param suggestions The {@link Components.Suggestions} to use.
   */
  setSuggestions(suggestions: Components.Suggestions) {
    this.item.suggestions = suggestions;
    return this;
  }

  protected validate(): boolean {
    return !!this.item.suggestions;
  }
}
