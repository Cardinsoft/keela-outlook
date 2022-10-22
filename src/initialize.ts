import { EventObject } from "./events.js";
import { type Card } from "./lib/services/card/components/card.js";
import { Overlay } from "./overlay.js";
import { Spinner } from "./spinner.js";

/**
 * @summary initializes the Add-In
 * @param cardStack Add-In {@link Card} stack
 * @param homepageTriggerName main Add-In function name
 */
export const initialize = async (
  cardStack: Card[],
  homepageTriggerName: string
) => {
  const event = new EventObject();

  const overlay = new Overlay("app-overlay", "app-body");
  overlay.setColor("white");
  overlay.show();

  const spinner = new Spinner("app-overlay");
  spinner.setSize("large");
  spinner.show();

  const homepageTrigger = window[homepageTriggerName];
  if (typeof homepageTrigger !== "function") {
    throw new Error(`missing homepage trigger "${homepageTriggerName}"`);
  }

  const cards: Card[] = await homepageTrigger(event);

  const lastCard = cards.at(-1);
  if (!lastCard) {
    throw new Error("Add-In must initialize with at least 1 card");
  }

  cardStack.length = 0;
  cardStack.push(...cards);

  await lastCard.render(document.getElementById("app-body"));

  spinner.hide();
  overlay.hide();
};
