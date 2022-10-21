/**
 * @summary handles triggered add-on events
 * @param element trigger element
 */
const handleEvent = (element: Element) => {
  const event = new EventObject();
  fillFormInputs(event);
  handleAction(event, element);
};
