import { cardStack } from "./handlers/response";
import { initialize } from "./initialize";
import { Logger } from "./lib/services/base/logger";
import { CacheService } from "./lib/services/cache/service";
import { UniversalAction } from "./lib/services/card/actions/universal";
import { CardService } from "./lib/services/card/service";
import { GmailApp } from "./lib/services/gmail/service";
import { LockService } from "./lib/services/lock/service";
import { PropertiesService } from "./lib/services/properties/service";
import { Session } from "./lib/services/session/service";
import { UrlFetchApp } from "./lib/services/url_fetch/service";
import { Utilities } from "./lib/services/utilities/service";
import { ServicesStore } from "./lib/stores/services";
import { type GmailAddOnManifest } from "./manifest";
import { AddInMenu } from "./menu";
import { log } from "./utils/log";
import { getSettings, supportsSet } from "./utils/office";
import { safeToString } from "./utils/strings";

/**
 * @summary callback to call once the Add-In is ready
 * @param info Office context info
 */
export const readyCallback = async (info: Pick<Office.Context, "host">) => {
  const { host } = info;

  if (host !== Office.HostType.Outlook) {
    log(
      "error",
      "Add-In initialized outside host application",
      safeToString(host)
    );
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

  if (host && supportsSet("Mailbox", 1.5)) {
    Office.context.mailbox.addHandlerAsync(
      Office.EventType.ItemChanged,
      async () => {
        getSettings().saveAsync(() => {
          initialize(cardStack, homepageTrigger.runFunction);
        });
      }
    );
  }

  universalActions.forEach(({ label, runFunction }) => {
    const action = new UniversalAction();
    action.setText(label);
    action.setRunFunction(runFunction);
    menu.addUniversalAction(action);
  });

  await menu.render(document.getElementById("app-menu"));

  showRootElement("app-body");

  return initialize(cardStack, homepageTrigger.runFunction);
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
