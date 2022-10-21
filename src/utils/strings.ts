/**
 * @summary override-safe default stringifier
 * @param item item to stringify
 */
const safeToString = (item: unknown) => {
  return typeof item === "string" ? item : Object.prototype.toString.call(item);
};
