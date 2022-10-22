import { RenderableComponent } from "../../../../component";
import { handleEvent } from "../../../../handlers/event";
import { isHTMLTextAreaElement } from "../../../../utils/guards";
import { safeToString } from "../../../../utils/strings";
import { ActionStore } from "../../../stores/actions";
import { type Action } from "../actions/action";
import { type Suggestions } from "./suggestions";

/**
 * @see https://developers.google.com/apps-script/reference/card-service/text-input
 */
export class TextInput extends RenderableComponent {
  private action?: Action;
  private fieldName?: string;
  private hint?: string;
  private multiline: boolean = false;
  private suggestions?: Suggestions;
  private suggestionsAction?: Action;
  private title?: string;
  private value?: string;

  /**
   * @see https://developers.google.com/apps-script/reference/card-service/text-input#setfieldnamefieldname
   *
   * @summary Sets the key that identifies this text input in the event object that is generated when there is a UI interaction. Not visible to the user. Required, must be unique.
   * @param fieldName The key that is used to identify this input.
   */
  setFieldName(fieldName: string) {
    this.fieldName = fieldName;
    return this;
  }

  /**
   * @see https://developers.google.com/apps-script/reference/card-service/text-input#sethinthint
   *
   * @summary Sets a hint for the text input.
   * @param hint The text hint to display when the input is empty.
   */
  setHint(hint: string) {
    this.hint = hint;
    return this;
  }

  /**
   * @see https://developers.google.com/apps-script/reference/card-service/text-input#setmultilinemultiline
   *
   * @summary Sets whether the input text shows on one line or multiple lines.
   * @param multiline The multiline setting.
   */
  setMultiline(multiline: boolean) {
    this.multiline = multiline;
    return this;
  }

  /**
   * @see https://developers.google.com/apps-script/reference/card-service/text-input#setonchangeactionaction
   *
   * @summary Sets an action to be performed whenever the text input changes.
   * @param action The action to take.
   */
  setOnChangeAction(action: Action) {
    this.action = action;
    return this;
  }

  /**
   * @see https://developers.google.com/apps-script/reference/card-service/text-input#setsuggestionssuggestions
   *
   * @summary Sets the suggestions for autocompletion in the text field.
   * @param suggestions The collection of suggestions to use.
   */
  setSuggestions(suggestions: Suggestions) {
    this.suggestions = suggestions;
    return this;
  }

  /**
   * @see https://developers.google.com/apps-script/reference/card-service/text-input#setsuggestionsactionsuggestionsaction
   *
   * @summary Sets the callback action to fetch suggestions based on user input for autocompletion.
   * @param suggestionsAction The action that fetches suggestions for this input.
   */
  setSuggestionsAction(suggestionsAction: Action) {
    this.suggestionsAction = suggestionsAction;
    return this;
  }

  /**
   * @see https://developers.google.com/apps-script/reference/card-service/text-input#settitletitle
   *
   * @summary Sets the title to be shown above the input field. Required.
   * @param title The text label for this input.
   */
  setTitle(title: string) {
    this.title = title;
    return this;
  }

  /**
   * @see https://developers.google.com/apps-script/reference/card-service/text-input#setvaluevalue
   *
   * @summary Sets the pre-filled value to be set in the input field.
   * @param value The default value placed in the input. It is always represented as a string in the form callback parameters.
   */
  setValue(value: string) {
    this.value = safeToString(value);
    return this;
  }

  create(): HTMLElement {
    const {
      action,
      fieldName,
      hint,
      multiline = false,
      suggestions,
      suggestionsAction,
      title,
      value = "",
    } = this;

    if (!fieldName) {
      throw new Error("TextInput must have a field name set");
    }

    if (!title) {
      throw new Error("TextInput must have a title set");
    }

    if (suggestions || suggestionsAction) {
      // TODO: future releases
      throw new Error("suggestions are not implemented");
    }

    const wrapper = document.createElement("div");
    wrapper.classList.add("row", "TextInput");

    const row = document.createElement("div");
    row.classList.add("column");
    wrapper.append(row);

    if (title) {
      const topLabel = document.createElement("label");
      topLabel.classList.add("ms-fontSize-s", "TextInputTopLabel");
      topLabel.textContent = title;
      row.append(topLabel);
    }

    const inputWrapper = document.createElement("div");
    inputWrapper.classList.add("ms-TextField", "ms-TextField--underlined");
    row.append(inputWrapper);

    const label = document.createElement("label");
    label.classList.add("ms-Label", "TextInputLabel");
    inputWrapper.append(label);

    const input = document.createElement(multiline ? "textarea" : "input");
    input.classList.add("ms-TextField-field", "TextInputInput");
    input.name = fieldName;
    input.value = value;
    inputWrapper.append(input);

    if (!isHTMLTextAreaElement(input)) {
      input.type = "text";
    }

    input.addEventListener("keydown", (event) => {
      if (event instanceof KeyboardEvent && event.key === "Enter") {
        event.preventDefault();
        this.value += "\r";
      }
    });

    if (action) {
      wrapper.addEventListener("focusout", () => {
        ActionStore.set(wrapper, action);
        handleEvent(wrapper);
      });
    }

    new fabric.TextField(inputWrapper);

    if (hint) {
      const bottomLabel = document.createElement("label");
      bottomLabel.classList.add("ms-fontSize-s", "TextInputBottomLabel");
      bottomLabel.textContent = hint;
      row.append(bottomLabel);
    }

    return inputWrapper;
  }
}
