import dotenv from "dotenv";
import console from "fancy-log";
import { writeFile } from "fs/promises";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { getOctokit } from "./auth.js";
import { getRepositoryFileContent } from "./content.js";
import { wrapIntoLibraryGlobalVariable } from "./library.js";
import { printNodes } from "./printer.js";
import { parseSourceText } from "./source.js";

const { parsed = {} } = dotenv.config({
  path: `${dirname(fileURLToPath(import.meta.url))}/.env`,
});

console.info(parsed);

const { APP_ID, INSTALL_ID, KEY_PATH } = parsed;

const octokit = await getOctokit(KEY_PATH, +APP_ID, +INSTALL_ID);
console.info(`connected to GitHub app #${APP_ID}`);

const { REPO_FILE_PATH, REPO_NAME, REPO_OWNER } = parsed;

const decoded = await getRepositoryFileContent(
  octokit,
  REPO_OWNER,
  REPO_NAME,
  REPO_FILE_PATH
);
console.info(`fetched file ${REPO_FILE_PATH}`);

const [publicNodes, privateNodes] = parseSourceText(decoded);
console.info("parsed source text as nodes");

const { LIBRARY_NAME } = parsed;

const cardinGlobal = wrapIntoLibraryGlobalVariable(LIBRARY_NAME, publicNodes);
console.info(`created global ${LIBRARY_NAME} context object`);

const { OUTPUT_PATH } = parsed;

await writeFile(
  OUTPUT_PATH,
  printNodes(OUTPUT_PATH, [...privateNodes, cardinGlobal])
);
console.info(`saved output file at ${OUTPUT_PATH}`);

console.info(`finished pulling in ${process.uptime()}s`);
