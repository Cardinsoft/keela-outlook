namespace Components {
  /**
   * @see https://developers.google.com/apps-script/reference/properties/properties
   */
  export class Properties {
    constructor(
      private store: Office.RoamingSettings,
      private type: PropertiesStoreType
    ) {}

    /**
     * @summary saves a given store
     */
    private save() {
      const { store } = this;

      return new Promise((resolve, reject) => {
        store.saveAsync((result) => {
          const handlers: Record<Office.AsyncResultStatus, () => void> = {
            [Office.AsyncResultStatus.Succeeded]: resolve,
            [Office.AsyncResultStatus.Failed]: reject,
          };

          handlers[result.status]();
        });
      });
    }

    /**
     * @summary gets internal storage by type
     */
    private get typedStore(): Promise<Record<string, string>> {
      return new Promise(async (resolve) => {
        const { store, type } = this;

        const typedStore: Record<string, string> = store.get(type);
        if (!typedStore) {
          const defaultStore: Record<string, string> = {};
          store.set(type, defaultStore);
          await this.save();
        }

        resolve(typedStore);
      });
    }

    /**
     * @see https://developers.google.com/apps-script/reference/properties/properties#deleteallproperties
     *
     * @summary Deletes all properties in the current {@link Properties} store.
     */
    async deleteAllProperties() {
      const { store, type } = this;
      store.set(type, {});
      await this.save();
      return this;
    }

    /**
     * @see https://developers.google.com/apps-script/reference/properties/properties#deletepropertykey
     *
     * @summary Deletes the property with the given key in the current {@link Properties} store.
     * @param key the key for the property to delete
     */
    async deleteProperty(key: string) {
      const { store, type } = this;
      const typedStore = await this.typedStore;
      delete typedStore[key];
      store.set(type, typedStore);
      await this.save();
      return this;
    }

    /**
     * @see https://developers.google.com/apps-script/reference/properties/properties#getkeys
     *
     * @summary Gets all keys in the current {@link Properties} store.
     */
    async getKeys() {
      const typedStore = await this.typedStore;
      return Object.keys(typedStore);
    }

    /**
     * @see https://developers.google.com/apps-script/reference/properties/properties#getproperties
     *
     * @summary Gets a copy of all key-value pairs in the current {@link Properties} store.
     */
    async getProperties() {
      const store = await this.typedStore;
      return { ...store };
    }

    /**
     * @see https://developers.google.com/apps-script/reference/properties/properties#getpropertykey
     *
     * @summary Gets the value associated with the given key in the current {@link Properties} store, or null if no such key exists.
     * @param key the key for the property value to retrieve
     */
    async getProperty(key: string) {
      const store = await this.typedStore;
      return key in store ? store[key] : null;
    }

    /**
     * @see https://developers.google.com/apps-script/reference/properties/properties#setpropertiesproperties,-deleteallothers
     *
     * @summary Sets all key-value pairs from the given object in the current {@link Properties} store.
     * @param properties an object containing key-values pairs to set
     * @param deleteAllOthers true to delete all other key-value pairs in the properties object; false to not
     */
    async setProperties(
      properties: Record<string, string>,
      deleteAllOthers = false
    ) {
      const { store, type } = this;

      const newTypedStore = deleteAllOthers
        ? { ...properties }
        : {
            ...(await this.typedStore),
            ...properties,
          };

      store.set(type, newTypedStore);
      await this.save();
      return this;
    }

    /**
     * @see https://developers.google.com/apps-script/reference/properties/properties#setpropertykey,-value
     *
     * @summary Sets the given key-value pair in the current {@link Properties} store.
     * @param key the key for the property
     * @param value the value to associate with the key
     */
    async setProperty(key: string, value: string) {
      const { store, type } = this;
      const typedStore = await this.typedStore;
      typedStore[key] = value.toString();
      store.set(type, typedStore);
      await this.save();
      return this;
    }
  }
}
