import { type OpenLink } from "../../actions/open_link.js";
import { InspectableComponent } from "../../index.js";
import { type Navigation } from "../navigation.js";
import { type Notification } from "../notification.js";

export type ActionResponseConfig = {
  navigation?: Navigation;
  notification?: Notification;
  openLink?: OpenLink;
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
