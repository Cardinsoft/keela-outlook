import {
  NavigationAction,
  NavigationType,
  PushNavigationAction,
} from "../services/card/components/navigation";
import { type ActionResponse } from "../services/card/components/responses/action_response";
import { type SuggestionsResponse } from "../services/card/components/responses/suggestions_response";
import { type UniversalActionResponse } from "../services/card/components/responses/universal_action_response";
import { type CardStore } from "../stores/card";
import { RuleStore } from "../stores/rules";
import { log } from "../utils/log";
import { safeToString } from "../utils/strings";
import { handleOpenLinkAction } from "./open_link";

type NavigationHandler<T extends NavigationAction> = (
  store: typeof CardStore,
  action: T
) => Promise<void> | void;

type NavigationHandlerRule = {
  [P in NavigationType as string]: [
    P,
    NavigationHandler<
      P extends NavigationType.PUSH ? PushNavigationAction : NavigationAction
    >
  ];
}[string];

const navigationRules = new RuleStore<NavigationHandlerRule>([
  [
    NavigationType.NAMED,
    (store: typeof CardStore, action: NavigationAction) => {
      store.named(action.name!);
    },
  ],
  [
    NavigationType.POP,
    (store: typeof CardStore) => {
      store.pop();
    },
  ],
  [
    NavigationType.PUSH,
    (store: typeof CardStore, action: PushNavigationAction) => {
      store.push(action.card);
    },
  ],
  [
    NavigationType.ROOT,
    (store: typeof CardStore) => {
      store.root();
    },
  ],
]);

/**
 * @summary handles an {@link ActionResponse}
 * @param response {@link ActionResponse} to handle
 */
export const handleActionResponse = async (response: ActionResponse) => {
  try {
    const { navigation, notification, openLink } = response;

    if (navigation) {
      const { actions } = navigation;

      const { CardStore } = window.CardServiceConfig;

      await CardStore.teardown();

      for (const action of actions) {
        const { type } = action;

        const [, navigationHandler] = navigationRules.find(([t]) => t === type);
        if (!navigationHandler) {
          throw new Error(`missing Navigation handler`, { cause: action });
        }

        navigationHandler(CardStore, action as PushNavigationAction);
      }

      await CardStore.render(document.getElementById("app-body"));
    }

    if (notification) {
      const parent = document.getElementById("app-notif") || document.body;
      await notification.render(parent);
    }

    if (openLink) {
      handleOpenLinkAction(openLink);
    }
  } catch (error) {
    log("error", "ActionResponse handler error", safeToString(error));
  }
};

/**
 * @summary handles a {@link SuggestionsResponse}
 * @param response {@link SuggestionsResponse} to handle
 * @param element triggering {@link Element}
 */
export const handleSuggestionsResponse = (
  response: SuggestionsResponse,
  element: Element
) => {
  element.dispatchEvent(
    new CustomEvent("suggestions", {
      detail: response.suggestions?.suggestions || [],
      bubbles: false,
    })
  );
};

/**
 * @summary handles a {@link UniversalActionResponse}
 * @param response {@link UniversalActionResponse} to handle
 */
export const handleUniversalActionResponse = async (
  response: UniversalActionResponse
) => {
  try {
    const { cards, openLink } = response;

    const { CardStore } = window.CardServiceConfig;

    if (cards.length) {
      await CardStore.teardown();
      CardStore.reset(cards);
      await CardStore.render(document.getElementById("app-body"));
    }

    if (openLink) {
      handleOpenLinkAction(openLink);
    }
  } catch (error) {
    log("error", "UniversalActionResponse handler error", safeToString(error));
  }
};
