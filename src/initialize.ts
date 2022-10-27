import { Overlay } from "./gas-js/components/overlay";
import { Spinner } from "./gas-js/components/spinner";
import { EventObject } from "./gas-js/events";
import { type Card } from "./gas-js/services/card/components/card";

/**
 * @summary initializes the Add-In
 * @param homepageTriggerName main Add-In function name
 */
export const initialize = async (homepageTriggerName: string) => {
  const event = new EventObject();

  const overlayParent = document.getElementById("app-overlay");

  const overlay = new Overlay("app-body");
  overlay.setColor("white");
  await overlay.render(overlayParent);
  await overlay.show();

  const spinner = new Spinner();
  spinner.setSize("large");
  await spinner.render(overlayParent);
  await spinner.show();

  const homepageTrigger = window[homepageTriggerName];
  if (typeof homepageTrigger !== "function") {
    throw new Error(`missing homepage trigger "${homepageTriggerName}"`);
  }

  const maybeCards: Card | Card[] = await homepageTrigger(event);

  const cards = maybeCards instanceof Array ? maybeCards : [maybeCards];

  const lastCard = cards.at(-1);
  if (!lastCard) {
    throw new Error("Add-In must initialize with at least 1 card");
  }

  const { CardStore } = window.CardServiceConfig;

  await CardStore.teardown();
  CardStore.reset(cards);
  await CardStore.render(document.getElementById("app-body"));

  await spinner.hide();
  await overlay.hide();
};
