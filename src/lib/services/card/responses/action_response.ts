namespace Components {
  type ActionResponseConfig = {
    navigation?: Components.Navigation;
    notification?: Components.Notification;
    openLink?: Components.OpenLink;
    stateChanged: boolean;
  };

  /**
   * @see https://developers.google.com/apps-script/reference/card-service/action-response
   */
  export class ActionResponse extends InspectableComponent {
    constructor(private config: ActionResponseConfig) {
      super();
    }

    get navigation() {
      return this.config.navigation;
    }

    get notification() {
      return this.config.notification;
    }

    get openLink() {
      return this.config.openLink;
    }

    get stateChanged() {
      return this.config.stateChanged;
    }
  }
}
