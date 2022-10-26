import ts from "typescript";

/**
 * @summary transpiles JS source to ES5
 * @param content content to transpile
 */
export const downgradeToES5 = (content: string) => {
  return ts.transpile(content, {
    allowJs: true,
    module: ts.ModuleKind.None,
    target: ts.ScriptTarget.ES5,
    downlevelIteration: true,
    declaration: false,
  });
};
