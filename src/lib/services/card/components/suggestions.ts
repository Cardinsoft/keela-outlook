namespace Components {
  /**
   * @see https://developers.google.com/apps-script/reference/card-service/suggestions
   */
  export class Suggestions {
    suggestions: string[] = [];

    /**
     * @see https://developers.google.com/apps-script/reference/card-service/suggestions#addsuggestionsuggestion
     *
     * @summary Add a text suggestion.
     * @param suggestion The suggestion text.
     */
    addSuggestion(suggestion: string) {
      this.suggestions.push(suggestion);
      return this;
    }

    /**
     * @see https://developers.google.com/apps-script/reference/card-service/suggestions#addsuggestionssuggestions
     *
     * @summary Add a list of text suggestions.
     * @param suggestions An array of string suggestions.
     */
    addSuggestions(suggestions: string[]) {
      this.suggestions.push(...suggestions);
      return this;
    }
  }
}
