import console from "fancy-log";
import ts from "typescript";
import { parseRules } from "./parsers.js";

export const parseSourceText = (content: string) => {
  const sourceFile = ts.createSourceFile(
    "temp.js",
    content,
    ts.ScriptTarget.ES5,
    void 0,
    ts.ScriptKind.JS
  );

  const privateNodes: ts.Node[] = [];
  const publicNodes: Array<ts.ShorthandPropertyAssignment> = [];

  ts.forEachChild(sourceFile, (node) => {
    const { kind } = node;

    const [, parser] = parseRules.find(([k]) => k === kind) || [];
    if (!parser) {
      console.info(`no parser registered for ${ts.SyntaxKind[kind]} nodes`);
      return;
    }

    const [name, shorthand] = parser(sourceFile, node);

    privateNodes.push(node);

    if (!name.text.endsWith("_")) {
      publicNodes.push(shorthand);
    }
  });

  return [publicNodes, privateNodes] as const;
};
