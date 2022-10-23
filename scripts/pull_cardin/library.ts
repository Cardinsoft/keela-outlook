import ts from "typescript";

export const wrapIntoLibraryGlobalVariable = (
  libraryName: string,
  elements: ts.ObjectLiteralElementLike[]
) => {
  return ts.factory.createVariableStatement(
    void 0,
    ts.factory.createVariableDeclarationList([
      ts.factory.createVariableDeclaration(
        ts.factory.createIdentifier(libraryName),
        void 0,
        void 0,
        ts.factory.createObjectLiteralExpression(elements, true)
      ),
    ])
  );
};
