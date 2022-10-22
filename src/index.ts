type ActionResponseType =
  | Components.ActionResponse
  | Components.SuggestionsResponse
  | Components.UniversalActionResponse;

type ActionHandler<T extends ActionType> = (
  action: T,
  event: EventObject
) => Promise<ActionResponseType> | ActionResponseType;

type ActionResponseHandler<T extends ActionResponseType> = (
  response: T,
  element: Element
) => Promise<void> | void;

type ActionHandlerRule = {
  [T in ActionType as string]: [new () => T, ActionHandler<T>];
}[string];

type ActionResponseHandlerRule = {
  [T in ActionResponseType as string]: [new () => T, ActionResponseHandler<T>];
}[string];

/**
 * @summary global card stack
 */
const cardStack: Card[] = [];

/**
 * @summary callback to call once the Add-In is ready
 * @param info Office context info
 */
const readyCallback = async (info: Pick<Office.Context, "host">) => {
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
