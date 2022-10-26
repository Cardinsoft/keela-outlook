import { parsePixelLength } from "./html";

/**
 * @summary gets computed value of a CSS style as a numeric value
 * @param element element to get the value for
 * @param property property to lookup
 */
export const getComputedNumericProperty = (
  element: Element,
  property: "height" | "width"
) => {
  return parsePixelLength(window.getComputedStyle(element)[property]);
};

/**
 * @summary computes element height given the number of elements to show
 * @param element element to compute the height for
 * @param numberOfUncollapsibleWidgets number of widgets to show
 * @returns uncollapsed element height
 */
export const getUncollapsedHeight = (
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
