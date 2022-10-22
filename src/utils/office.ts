/**
 * @summary checks whether the host application supports a requirement set
 * @param name requirement set name
 * @param version minimum required version
 */
export const supportsSet = (name: string, version: number) => {
  return Office.context.requirements.isSetSupported(name, version.toString());
};
