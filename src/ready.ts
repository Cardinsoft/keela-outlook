import { AddInMenu } from "./gas-js/components/menu";
import { UniversalAction } from "./gas-js/services/card/actions/universal";
import { CardServiceConfig } from "./gas-js/services/card/service";
import { log } from "./gas-js/utils/log";
import { getSettings, supportsSet } from "./gas-js/utils/office";
import { safeToString } from "./gas-js/utils/strings";
import { initialize } from "./initialize";
import { GmailAddOnManifest } from "./manifest";

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

  CardServiceConfig.set("primaryColor", primaryColor).set(
    "secondaryColor",
    secondaryColor
  );

  if (host && supportsSet("Mailbox", 1.5)) {
    Office.context.mailbox.addHandlerAsync(
      Office.EventType.ItemChanged,
      async () => {
        getSettings().saveAsync(() => {
          initialize(homepageTrigger.runFunction);
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

  return initialize(homepageTrigger.runFunction);
};
