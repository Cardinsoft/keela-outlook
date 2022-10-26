/**
 * @summary checks whether the host application supports a requirement set
 * @param name requirement set name
 * @param version minimum required version
 */
export const supportsSet = (name: string, version: number) => {
  return Office.context.requirements.isSetSupported(name, version.toString());
};

/**
 * @summary returns {@link Office.context.roamingSettings} or shims it with {@link localStorage}
 */
export const getSettings = () => {
  return (
    Office.context.roamingSettings || {
      get(name: string) {
        const value = localStorage.getItem(name);
        return value === null ? void 0 : JSON.parse(value);
      },

      remove(name: string) {
        localStorage.removeItem(name);
      },

      saveAsync(callback) {
        callback?.({
          asyncContext: void 0,
          error: { code: 0, message: "", name: "" },
          diagnostics: "",
          status: Office.AsyncResultStatus.Succeeded,
          value: void 0,
        });
      },

      set(name: string, value: unknown) {
        localStorage.setItem(name, JSON.stringify(value));
      },
    }
  );
};

/**
 * @summary returns {@link Office.context.userProfile} or shims it
 */
export const getProfile = () => {
  return (
    Office.context?.mailbox.userProfile || {
      accountType: "office365",
      displayName: "",
      emailAddress: "",
      timeZone: "UTC",
    }
  );
};
