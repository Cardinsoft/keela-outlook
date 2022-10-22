import { InspectableComponent } from "../../index.js";
import { type Suggestions } from "../suggestions.js";

export type SuggestionsResponseConfig = {
  suggestions?: Suggestions;
};

/**
 * @see https://developers.google.com/apps-script/reference/card-service/suggestions-response
 */
export class SuggestionsResponse extends InspectableComponent {
  constructor(private config: SuggestionsResponseConfig) {
    super();
  }

  get suggestions() {
    return this.config.suggestions;
  }
}
