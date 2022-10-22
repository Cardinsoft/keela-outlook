export abstract class InspectableComponent {
  /**
   * @summary Prints the JSON representation of this object.
   */
  printJson() {
    return JSON.stringify(this);
  }
}
