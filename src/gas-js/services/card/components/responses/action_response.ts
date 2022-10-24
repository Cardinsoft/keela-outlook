import { type OpenLink } from "../../actions/open_link";
import { InspectableComponent } from "../../index";
import { type Navigation } from "../navigation";
import { type Notification } from "../notification";

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
