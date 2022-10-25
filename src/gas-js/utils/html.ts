import { addAnchorListener, addTelListener } from "./anchors";
import { isElementNode, isHTMLAnchorElement } from "./guards";
import { addMailtoListener } from "./mailbox";

export type AnchorHandler = (anchor: HTMLAnchorElement) => void;

export type AnchorHandlerRule = [string, AnchorHandler];

/**
 * @summary parses length (i.e. "1 px") into a number
 * @param length stringified length
 */
export const parsePixelLength = (length: string) => {
  return Math.ceil(+length.replace("px", ""));
};

/**
 * @summary binds an event listener to a given {@link anchor}
 * @param anchor an {@link HTMLAnchorElement}
 * @param rules anchor handler rules
 * @param defaultHandler default anchor hander
 */
export const bindAnchorListener = (
  anchor: HTMLAnchorElement,
  rules: AnchorHandlerRule[],
  defaultHandler: AnchorHandler
) => {
  const { href } = anchor;

  const [, handler] = rules.find(([hrefStart]) =>
    href.startsWith(hrefStart)
  ) || [, defaultHandler];

  handler(anchor);
};

/**
 * @summary leaves only allowed attributes on a given {@link element}
 * @param element element to sanitize
 * @param allowedAttributes map of tag names to allowed attribute names
 */
export const sanitizeAttributes = (
  element: Element,
  allowedAttributes: Record<string, string[]>
) => {
  const { attributes } = element;

  const tagName = element.tagName.toLowerCase();

  for (const attribute of attributes) {
    const attributeName = attribute.name.toLowerCase();

    if (!allowedAttributes[tagName].includes(attributeName)) {
      attributes.removeNamedItem(attributeName);
    }
  }

  return element;
};

/**
 * @summary sanitizes a given {@link node} content
 * @param node node to sanitize
 * @param allowedNodeNames list of allowed node names
 */
export const sanitizeContent = (node: Node, allowedNodeNames: string[]) => {
  const nodeName = node.nodeName.toLowerCase();

  if (allowedNodeNames.includes(nodeName)) return node;

  const text = document.createTextNode(
    isElementNode(node) ? node.outerHTML : node.nodeValue || ""
  );

  node.parentNode?.replaceChild(text, node);
  return text;
};

/**
 * @see https://developers.google.com/apps-script/add-ons/concepts/widgets#text_formatting
 *
 * @summary parses HTML widget content according to text formatting rules
 * @param parent element to parse content for
 * @param content content HTML string
 */
export const parseHTMLWidgetContent = (
  parent: HTMLElement,
  content: string
) => {
  const temp = document.createElement("div");
  temp.innerHTML = content;

  const walker = document.createTreeWalker(temp, NodeFilter.SHOW_ALL, {
    acceptNode(node) {
      return node.nodeType === Node.ATTRIBUTE_NODE
        ? NodeFilter.FILTER_SKIP
        : NodeFilter.FILTER_ACCEPT;
    },
  });

  const allowedNodeNames = ["b", "i", "u", "s", "font", "a", "time", "br"];

  const allowedAttributes: Record<string, string[]> = {
    font: ["color"],
    a: ["href"],
  };

  const anchorHandlerRules: AnchorHandlerRule[] = [
    [
      "mailto:",
      (anchor) => {
        addMailtoListener(anchor, anchor.href.replace("mailto:", ""));
      },
    ],
    [
      "tel:",
      (anchor) => {
        addTelListener(anchor);
      },
    ],
  ];

  const defaultAnchorHandler = (anchor: HTMLAnchorElement) => {
    addAnchorListener(anchor, anchor.href, "browser"); //TODO: check type
  };

  let current: Node | null = walker.currentNode;
  while (current) {
    sanitizeContent(current, allowedNodeNames);

    if (isElementNode(current)) {
      sanitizeAttributes(current, allowedAttributes);
    }

    if (isHTMLAnchorElement(current)) {
      bindAnchorListener(current, anchorHandlerRules, defaultAnchorHandler);
    }

    current = walker.nextNode();
  }

  parent.append(...temp.childNodes);
  return parent;
};

/**
 * @summary strips all HTML markup from content
 * @param content HTML string
 */
export const stripHTMLMarkup = (content: string) => {
  const temp = document.createElement("div");
  temp.innerHTML = content;
  return temp.textContent!;
};

/**
 *
 * @param target element to bind the listener to
 * @param type event type
 * @param callback event listener callback
 */
export const bindSelfRemovingListener = (
  target: EventTarget,
  type: string,
  callback: EventListener
) => {
  const listener = (event: Event) => {
    callback(event);
    target.removeEventListener(type, listener);
  };

  target.addEventListener(type, listener);
};
