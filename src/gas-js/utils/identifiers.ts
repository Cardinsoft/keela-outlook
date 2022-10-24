/**
 * @summary gets a Globally Unique Identifier
 * @param store identifier store
 * @param seed generator seed
 */
export const getGuid = (store: string[], seed = 1e5): string => {
  const id = btoa((Math.random() * seed).toString());

  if (!store.includes(id)) {
    store.unshift(id);
    return id;
  }

  return getGuid(store, seed);
};
