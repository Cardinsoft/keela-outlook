/**
 * @see https://developers.google.com/apps-script/reference/card-service/action-response-builder
 */
class ActionResponseBuilder extends CardServiceBuilder<Components.ActionResponse> {
  /**
   * @see https://developers.google.com/apps-script/reference/card-service/action-response-builder#setNavigation(Navigation)
   *
   * @summary Sets the response to a {@link Components.Navigation} action.
   * @param navigation The {@link Components.Navigation} to use.
   */
  setNavigation(navigation: Components.Navigation) {
    this.item.navigation = navigation;
    return this;
  }

  /**
   * @see https://developers.google.com/apps-script/reference/card-service/action-response-builder#setnotificationnotification
   *
   * @summary Sets the notification to display when the action is activated.
   * @param notification The {@link Components.Notification} to use.
   */
  setNotification(notification: Components.Notification) {
    this.item.notification = notification;
    return this;
  }

  /**
   * @see https://developers.google.com/apps-script/reference/card-service/action-response-builder#setopenlinkopenlink
   *
   * @summary Sets the URL to navigate to when the action is activated.
   * @param openLink The {@link Components.OpenLink} to use.
   */
  setOpenLink(openLink: Components.OpenLink) {
    this.item.openLink = openLink;
    return this;
  }

  /**
   * @see https://developers.google.com/apps-script/reference/card-service/action-response-builder#setstatechangedstatechanged
   *
   * @summary Sets a flag to indicate that this action changed the existing data state.
   * @param stateChanged Whether this action has changed the existing state data. Defaults to false.
   */
  setStateChanged(stateChanged: boolean) {
    this.item.stateChanged = stateChanged;
    return this;
  }

  /**
   * @summary validates the {@link ActionResponse}
   */
  protected validate() {
    const { navigation, notification, openLink } = this.item;
    return [navigation, notification, openLink].some(Boolean);
  }
}
