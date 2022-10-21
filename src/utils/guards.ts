/**
 * @summary checks if a given {@link node} is an {@link Element} node
 * @param node {@link Node} to check
 */
const isElementNode = (node: Node): node is Element => {
  return node.nodeType === Node.ELEMENT_NODE;
};

/**
 * @summary checks if a given {@link node} is an {@link HTMLTextAreaElement}
 * @param node {@link Node} to check
 */
const isHTMLTextAreaElement = (node: Node): node is HTMLTextAreaElement => {
  return node.nodeName.toLowerCase() === "textarea";
};

/**
 * @summary checks if a given {@link node} is an {@link HTMLAnchorElement}
 * @param node {@link Node} to check
 */
const isHTMLAnchorElement = (node: Node): node is HTMLAnchorElement => {
  return node.nodeName.toLowerCase() === "a";
};

/**
 * @summary checks if an element is input-like (defined as having a name and a value)
 * @param element element to check
 */
const isInputLike = (
  element: Element
): element is Element & { name: string; value: string } => {
  return "name" in element && "value" in element;
};

/**
 * @summary checks if an element is OfficeUI toggle, checkbox, or radio button
 * @param element element to check
 */
const isOfficeJSstateFormElement = (
  element: Element
): element is HTMLInputElement => {
  const { classList } = element;
  return ["ms-Toggle-input", "ms-CheckBox-input", "ms-RadioButton-input"].some(
    (token) => classList.contains(token)
  );
};

/**
 * @summary checks if an OfficeUI state element is selected
 * @param element element to check
 */
const isSelectedStateFormElement = (element: HTMLInputElement) => {
  return element.classList.contains("is-selected") || element.checked;
};
