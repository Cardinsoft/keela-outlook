import ts from "typescript";

export const printNodes = (path: string, nodes: ts.Node[]) => {
  const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });

  const typesFile = ts.createSourceFile(
    path,
    "",
    ts.ScriptTarget.Latest,
    false,
    ts.ScriptKind.TS
  );

  return printer.printList(
    ts.ListFormat.MultiLine,
    ts.factory.createNodeArray(nodes),
    typesFile
  );
};
