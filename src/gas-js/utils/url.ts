/**
 * @summary normalizes base URL for GitHub Pages self-URLs
 */
export const getNormalizedBaseURL = () => {
  const { origin, pathname } = location;
  return `${origin}${pathname.replace("index.html", "").replace(/\/$/, "")}`;
};
