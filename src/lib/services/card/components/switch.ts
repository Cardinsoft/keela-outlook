/// <reference path="../../../../index.d.ts" />

import { RenderableComponent } from "../../../../component.js";
import { handleEvent } from "../../../../handlers/event.js";
import { safeToString } from "../../../../utils/strings.js";
import { ActionStore } from "../../../stores/actions.js";
import { type Action } from "../actions/action.js";
import { SwitchControlType } from "../enums.js";

/**
 * @see https://developers.google.com/apps-script/reference/card-service/switch
 */
export class Switch extends RenderableComponent {
  private action?: Action;
  private controlType: SwitchControlType = SwitchControlType.SWITCH;
  private fieldName?: string;
  private selected: boolean = false;
  private value?: string;

  /**
   * @see https://developers.google.com/apps-script/reference/card-service/switch#setcontroltypecontroltype
   *
   * @summary Sets the control type of the switch. Defaults to {@link SwitchControlType.SWITCH}.
   * @param controlType The switch control type.
   */
  setControlType(controlType: SwitchControlType) {
    this.controlType = controlType;
    return this;
  }

  /**
   * @see https://developers.google.com/apps-script/reference/card-service/switch#setfieldnamefieldname
   *
   * @summary Sets the key that identifies this switch in the event object that is generated when there is a UI interaction. Not visible to the user. Required.
   * @param fieldName The key that is used to identify this switch.
   */
  setFieldName(fieldName: string) {
    this.fieldName = fieldName;
    return this;
  }

  /**
   * @see https://developers.google.com/apps-script/reference/card-service/switch#setonchangeactionaction
   *
   * @summary Sets the action to take when the switch is toggled.
   * @param action The action to take when the switch is toggled.
   */
  setOnChangeAction(action: Action) {
    this.action = action;
    return this;
  }

  /**
   * @see https://developers.google.com/apps-script/reference/card-service/switch#setselectedselected
   *
   * @summary Sets whether this switch should start as selected or unselected.
   * @param selected The starting switch state setting.
   */
  setSelected(selected: boolean) {
    this.selected = selected;
    return this;
  }

  /**
   * @see https://developers.google.com/apps-script/reference/card-service/switch#setvaluevalue
   *
   * @summary Sets the value that is sent as the form input when this switch is toggled on.
   * @param value The value associated with the name when the switch is on.
   */
  setValue(value: string) {
    this.value = safeToString(value);
    return value;
  }

  create(): HTMLElement {
    const {
      action,
      controlType,
      fieldName,
      selected = false,
      value = "",
    } = this;

    if (!fieldName) {
      throw new Error("Switch must have a field name set");
    }

    if (controlType !== SwitchControlType.SWITCH) {
      // TODO: future releases
      throw new Error("checkbox control type is not implemented");
    }

    const wrapper = document.createElement("div");
    wrapper.classList.add("ms-Toggle", "ms-font-m-plus", "Switch");

    const input = document.createElement("input");
    input.classList.add("ms-Toggle-input");
    input.classList.toggle("is-selected", selected);
    input.id = input.name = fieldName;
    input.type = "checkbox";
    input.value = value;
    wrapper.append(input);

    if (action) {
      wrapper.addEventListener("click", () => {
        ActionStore.set(wrapper, action);
        handleEvent(wrapper);
      });
    }

    const label = document.createElement("label");
    label.classList.add("ms-Toggle-field");
    label.classList.toggle("is-selected", selected);
    wrapper.append(label);

    new fabric.Toggle(wrapper);
    return wrapper;
  }
}
