import { LoadIndicator } from "../enums.js";

/**
 * @see https://developers.google.com/apps-script/reference/card-service/action
 */
export class Action {
  indicator: LoadIndicator = LoadIndicator.SPINNER;
  name?: string;
  parameters: Record<string, string> = {};

  /**
   * @see https://developers.google.com/apps-script/reference/card-service/action#setfunctionnamefunctionname
   *
   * @summary Sets the name of the callback function to be called. Required.
   * @param functionName The name of the function.
   */
  setFunctionName(functionName: string) {
    this.name = functionName;
    return this;
  }

  /**
   * @see https://developers.google.com/apps-script/reference/card-service/action#setloadindicatorloadindicator
   *
   * @summary Sets the loading indicator that displays while the action is in progress.
   * @param loadIndicator The indicator to display.
   */
  setLoadIndicator(loadIndicator: LoadIndicator) {
    this.indicator = loadIndicator;
    return this;
  }

  /**
   * @see https://developers.google.com/apps-script/reference/card-service/action#setparametersparameters
   *
   * @summary Allows custom parameters to be passed to the callback function. Optional.
   * @param parameters Both keys and values must be strings
   */
  setParameters(parameters: Record<string, string>) {
    this.parameters = parameters;
    return this;
  }
}
