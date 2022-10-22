import { cardStack } from "./handlers/response.js";
import { initialize } from "./initialize.js";
import { Logger } from "./lib/services/base/logger.js";
import { CacheService } from "./lib/services/cache/service.js";
import { UniversalAction } from "./lib/services/card/actions/universal.js";
import { CardService } from "./lib/services/card/service.js";
import { GmailApp } from "./lib/services/gmail/service.js";
import { LockService } from "./lib/services/lock/service.js";
import { PropertiesService } from "./lib/services/properties/service.js";
import { Session } from "./lib/services/session/service.js";
import { UrlFetchApp } from "./lib/services/url_fetch/service.js";
import { Utilities } from "./lib/services/utilities/service.js";
import { ServicesStore } from "./lib/stores/services.js";
import { AddInMenu } from "./menu.js";
import { log } from "./utils/log.js";

/**
 * @summary callback to call once the Add-In is ready
 * @param info Office context info
 */
export const readyCallback = async (info: Pick<Office.Context, "host">) => {
  const { host } = info;

  if (host && host !== Office.HostType.Outlook) {
    log("error", "Add-In is loaded in a wrong host", host.toString());
    return;
  }

  if (host === null) {
    console.debug("add-in initialized outside host application");
  }

  const res = await fetch(`${location.origin}/appsscript.json`);
  if (!res.ok) {
    log("error", "failed to get manifest", await res.text());
    return; // TODO: show error card
  }

  const {
    addOns: { common, gmail },
  }: GmailAddOnManifest = await res.json();

  const { homepageTrigger } = gmail;
  const {
    universalActions,
    layoutProperties: { primaryColor, secondaryColor },
  } = common;

  const menu = new AddInMenu();

  ServicesStore.setAll([
    new CardService(primaryColor, secondaryColor, menu),
    new CacheService(),
    new GmailApp(),
    new LockService(),
    new Logger(),
    new PropertiesService(),
    new Session(),
    new UrlFetchApp(),
    new Utilities(),
  ]);

  Office.context.mailbox.addHandlerAsync(Office.EventType.ItemChanged, () =>
    initialize(cardStack, homepageTrigger.runFunction)
  );

  universalActions.forEach(({ label, runFunction }) => {
    const action = new UniversalAction();
    action.setText(label);
    action.setRunFunction(runFunction);
    menu.addUniversalAction(action);
  });
  await menu.render(document.getElementById("app-menu"));

  showRootElement("app-body");

  initialize(cardStack, homepageTrigger.runFunction);
};

Office.onReady(readyCallback);

/**
 * @summary makes the Add-In root element visible
 * @param id root element id
 */
const showRootElement = (id: string) => {
  const root = document.getElementById(id);
  if (!root) {
    log("error", "missing root element", { id });
    return;
  }

  root.style.visibility = "visible";
};
