import { SuggestionsResponse } from "../components/responses/suggestions_response.js";
import { type Suggestions } from "../components/suggestions.js";
import { CardServiceBuilder } from "./index.js";

/**
 * @see https://developers.google.com/apps-script/reference/card-service/suggestions-response-builder
 */
export class SuggestionsResponseBuilder extends CardServiceBuilder<SuggestionsResponse> {
  private suggestions?: Suggestions;

  /**
   * @see https://developers.google.com/apps-script/reference/card-service/suggestions-response-builder#build
   *
   * @summary Builds the current suggestions response and validates it.
   */
  build() {
    const response = new SuggestionsResponse({
      suggestions: this.suggestions,
    });

    super.build(response);

    return response;
  }

  /**
   * @see https://developers.google.com/apps-script/reference/card-service/suggestions-response-builder#setSuggestions(Suggestions)
   *
   * @summary Sets the suggestions used in auto complete in text fields.
   * @param suggestions The {@link Suggestions} to use.
   */
  setSuggestions(suggestions: Suggestions) {
    this.suggestions = suggestions;
    return this;
  }

  protected validate(): boolean {
    return !!this.suggestions;
  }
}
