import { EventObject } from "../events";
import {
  isInputLike,
  isOfficeJSstateFormElement,
  isSelectedStateFormElement,
} from "../utils/guards";
import { handleAction } from "./action";

/**
 * @summary adds a value to form inputs
 * @param event event object
 * @param name input name
 * @param value input value
 */
const addToFormInputs = (event: EventObject, name: string, value: string) => {
  const {
    commonEventObject: { formInputs },
  } = event;

  const { stringInputs } = (formInputs[name] ||= {
    stringInputs: { value: [] },
  });

  stringInputs.value.push(value);
};

/**
 * @summary removes a value from form inputs
 * @param event event object
 * @param name input name
 * @param value input value
 */
const removeFromFormInputs = (
  event: EventObject,
  name: string,
  value: string
) => {
  const {
    commonEventObject: { formInputs },
  } = event;

  const values = (formInputs[name].stringInputs.value ||= []);

  const valueIndex = values.indexOf(value);
  if (valueIndex > -1) {
    values.splice(values.indexOf(value), 1);
  }
};

/**
 * @summary fills {@link EventObject.formInputs}
 * @param event current event object
 */
const fillFormInputs = (event: EventObject) => {
  const forms = document.getElementsByTagName("form");
  for (const { elements } of forms) {
    for (const element of elements) {
      if (!isInputLike(element)) continue;

      const { name, value } = element;

      if (isOfficeJSstateFormElement(element)) {
        const selected = isSelectedStateFormElement(element);
        const handler = selected ? addToFormInputs : removeFromFormInputs;
        handler(event, name, value);
        continue;
      }

      addToFormInputs(event, name, value);
    }
  }
};

/**
 * @summary handles triggered add-on events
 * @param element trigger element
 */
export const handleEvent = (element: Element) => {
  const event = new EventObject();
  fillFormInputs(event);
  handleAction(event, element);
};
