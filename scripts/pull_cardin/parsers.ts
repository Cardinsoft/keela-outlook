import ts from "typescript";

export type DeclarationParser = (
  s: ts.SourceFile,
  n: ts.Node
) => [ts.Identifier, ts.PropertyAssignment | ts.MethodDeclaration];

export const parseVariableDeclaration: DeclarationParser = (source, node) => {
  const [listOrJSDoc, listIfJSDoc] = node
    .getChildren(source)
    .filter((n) => !ts.isJSDoc(n));

  const list =
    listOrJSDoc.kind === ts.SyntaxKind.JSDoc ? listIfJSDoc : listOrJSDoc;

  const decl = list.getChildAt(1, source).getChildAt(0, source);

  const [identifier, expression] = decl.getChildren(source) as [
    ts.Identifier,
    ts.Expression
  ];

  return [
    identifier,
    ts.factory.createPropertyAssignment(identifier, expression),
  ];
};

const parseFunctionDeclaration: DeclarationParser = (_source, node) => {
  if (!ts.isFunctionDeclaration(node)) {
    throw new Error("function parser works on FunctionDeclaration nodes");
  }

  const parsed = ts.factory.createMethodDeclaration(
    node.modifiers,
    node.asteriskToken,
    node.name!,
    node.questionToken,
    node.typeParameters,
    node.parameters,
    node.type,
    node.body || ts.factory.createBlock([])
  );

  return [node.name!, parsed];
};

export const parseRules: [ts.SyntaxKind, DeclarationParser][] = [
  [ts.SyntaxKind.FirstStatement, parseVariableDeclaration],
  [ts.SyntaxKind.FunctionDeclaration, parseFunctionDeclaration],
];
