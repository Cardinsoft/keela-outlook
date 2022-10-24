import ts from "typescript";

export type DeclarationParser = (
  s: ts.SourceFile,
  n: ts.Node
) => [ts.Identifier, ts.ShorthandPropertyAssignment];

export const parseVariableDeclaration: DeclarationParser = (source, node) => {
  const [listOrJSDoc, listIfJSDoc] = node
    .getChildren(source)
    .filter((n) => !ts.isJSDoc(n));

  const list =
    listOrJSDoc.kind === ts.SyntaxKind.JSDoc ? listIfJSDoc : listOrJSDoc;

  const decl = list.getChildAt(1, source).getChildAt(0, source);

  const [identifier] = decl.getChildren(source) as [ts.Identifier];

  return [identifier, ts.factory.createShorthandPropertyAssignment(identifier)];
};

const parseFunctionDeclaration: DeclarationParser = (_source, node) => {
  if (!ts.isFunctionDeclaration(node)) {
    throw new Error("function parser works on FunctionDeclaration nodes");
  }

  const { name } = node;

  return [name!, ts.factory.createShorthandPropertyAssignment(name!)];
};

export const parseRules: [ts.SyntaxKind, DeclarationParser][] = [
  [ts.SyntaxKind.FirstStatement, parseVariableDeclaration],
  [ts.SyntaxKind.FunctionDeclaration, parseFunctionDeclaration],
];
