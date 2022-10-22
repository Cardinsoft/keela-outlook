import { type UrlFetchAdvancedParameters } from "./service.js";

/**
 * @summary converts UrlFetchApp payload to {@link FormData}
 * @param payload payload to convert
 */
export const payloadToFormData = (
  payload: Exclude<UrlFetchAdvancedParameters["payload"], undefined>
) => {
  const formData = new FormData();
  Object.entries(payload).forEach(([key, value]) => {
    formData.append(key, value);
  });
  return formData;
};
