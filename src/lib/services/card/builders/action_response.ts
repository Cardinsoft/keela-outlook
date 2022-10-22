import { type OpenLink } from "../actions/open_link";
import { type Navigation } from "../components/navigation";
import { type Notification } from "../components/notification";
import { ActionResponse } from "../components/responses/action_response";
import { CardServiceBuilder } from "./index";

/**
 * @see https://developers.google.com/apps-script/reference/card-service/action-response-builder
 */
export class ActionResponseBuilder extends CardServiceBuilder<ActionResponse> {
  private navigation?: Navigation;
  private notification?: Notification;
  private openLink?: OpenLink;
  private stateChanged: boolean = false;

  /**
   * @see https://developers.google.com/apps-script/reference/card-service/action-response-builder#build
   *
   * @summary Builds the current action response and validates it.
   */
  build() {
    const response = new ActionResponse({
      navigation: this.navigation,
      notification: this.notification,
      openLink: this.openLink,
      stateChanged: this.stateChanged,
    });

    super.build(response);

    return response;
  }

  /**
   * @see https://developers.google.com/apps-script/reference/card-service/action-response-builder#setNavigation(Navigation)
   *
   * @summary Sets the response to a {@link Navigation} action.
   * @param navigation The {@link Navigation} to use.
   */
  setNavigation(navigation: Navigation) {
    this.navigation = navigation;
    return this;
  }

  /**
   * @see https://developers.google.com/apps-script/reference/card-service/action-response-builder#setnotificationnotification
   *
   * @summary Sets the notification to display when the action is activated.
   * @param notification The {@link Notification} to use.
   */
  setNotification(notification: Notification) {
    this.notification = notification;
    return this;
  }

  /**
   * @see https://developers.google.com/apps-script/reference/card-service/action-response-builder#setopenlinkopenlink
   *
   * @summary Sets the URL to navigate to when the action is activated.
   * @param openLink The {@link OpenLink} to use.
   */
  setOpenLink(openLink: OpenLink) {
    this.openLink = openLink;
    return this;
  }

  /**
   * @see https://developers.google.com/apps-script/reference/card-service/action-response-builder#setstatechangedstatechanged
   *
   * @summary Sets a flag to indicate that this action changed the existing data state.
   * @param stateChanged Whether this action has changed the existing state data. Defaults to false.
   */
  setStateChanged(stateChanged: boolean) {
    this.stateChanged = stateChanged;
    return this;
  }

  /**
   * @summary validates the {@link ActionResponse}
   */
  protected validate() {
    const { navigation, notification, openLink } = this;
    return [navigation, notification, openLink].some(Boolean);
  }
}
