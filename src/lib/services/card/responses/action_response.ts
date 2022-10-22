namespace Components {
  /**
   * @see https://developers.google.com/apps-script/reference/card-service/action-response
   */
  export class ActionResponse extends InspectableComponent {
    navigation?: Components.Navigation;
    notification?: Components.Notification;
    openLink?: Components.OpenLink;
    stateChanged: boolean = false;
  }
}
