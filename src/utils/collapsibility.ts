/**
 * @summary computes element height given the number of elements to show
 * @param element element to compute the height for
 * @param numberOfUncollapsibleWidgets number of widgets to show
 * @returns uncollapsed element height
 */
const getUncollapsedHeight = (
  element: HTMLElement,
  numberOfUncollapsibleWidgets: number
) => {
  let fullHeight = 0;

  if (!numberOfUncollapsibleWidgets) {
    return fullHeight;
  }

  const { children } = element;
  const chLength = children.length;

  for (let childIndex = 0; childIndex < chLength; childIndex++) {
    const child = children[childIndex];
    const computed = window.getComputedStyle(child);
    const computedT = parsePixelLength(computed.marginTop);
    const computedH = parsePixelLength(computed.height);
    const computedB = parsePixelLength(computed.marginBottom);

    if (childIndex < numberOfUncollapsibleWidgets) {
      fullHeight += (childIndex === 0 ? computedT : computedB) + computedH;
    }
  }

  return fullHeight;
};

/**
 * @summary gets computed value of a given element's children
 * @param property property to lookup
 * @param element element to get the value for
 */
const getChildrenPropertyValue = (
  property: "height" | "width",
  element: HTMLElement
) => {
  const { children } = element;

  let childrenPropertyValue = 0;
  for (let i = 0; i < children.length; i++) {
    const computed = window.getComputedStyle(children[i]);
    childrenPropertyValue += parsePixelLength(computed[property]);

    if (property === "height") {
      const chMargin = parsePixelLength(
        i > 0 ? computed.marginBottom : computed.marginTop
      );

      childrenPropertyValue += chMargin;
    }
  }

  return childrenPropertyValue;
};

/**
 * @summary toggles a given element collapsed state
 * @param trigger trggering element;
 * @param element element to toggle
 * @param property property to animate (height or width)
 * @param interval delay between increments
 * @param increment animation speed
 * @param initial initial value
 */
const toggleCollapsedState = async (
  trigger: HTMLElement,
  element: HTMLElement,
  property: "height" | "width",
  interval: number,
  increment: number,
  initial: number
) => {
  let end = initial;
  let change = increment;

  const childrenPropertyValue = getChildrenPropertyValue(property, element);

  //compute and set height to element
  const computed = parsePixelLength(window.getComputedStyle(element)[property]);
  element.style[property] = `${computed}px`;

  //if element is collapsed -> inverse increment;
  if (computed === initial) {
    change = -increment;
    end = childrenPropertyValue;
  }

  //set recursive timeout to change height;
  let timeout: NodeJS.Timeout = setTimeout(function wait() {
    trigger.classList.add("disabled");
    let newProperyValue = parsePixelLength(element.style[property]) - change;

    if (newProperyValue < initial) {
      newProperyValue = initial;
    }

    if (newProperyValue > childrenPropertyValue) {
      newProperyValue = childrenPropertyValue;
    }

    element.style[property] = `${newProperyValue}px`;

    const currentPropertyValue = parsePixelLength(element.style[property]);

    const shouldStop = [
      computed > initial && currentPropertyValue <= end,
      computed === initial && currentPropertyValue >= end,
    ].some(Boolean);

    if (shouldStop) {
      trigger.classList.remove("disabled");
      return clearTimeout(timeout);
    }

    timeout = setTimeout(wait, interval);
  }, interval);
};
