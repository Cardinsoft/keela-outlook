import dotenv from "dotenv";
import console from "fancy-log";
import { writeFile } from "fs/promises";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { getOctokit } from "../shared/auth.js";
import { getAllContent } from "./content.js";
import { downgradeToES5 } from "./transpiler.js";

const { parsed = {} } = dotenv.config({
  path: `${dirname(fileURLToPath(import.meta.url))}/.env`,
});

console.info(parsed);

const { APP_ID, INSTALL_ID, KEY_PATH } = parsed;

const octokit = await getOctokit(KEY_PATH, +APP_ID, +INSTALL_ID);
console.info(`connected to GitHub app #${APP_ID}`);

const {
  data: { account },
} = await octokit.rest.apps.getInstallation({
  installation_id: +INSTALL_ID,
});

const login = account?.login!;
console.info(`authenticated to GitHub as ${login}`);

const { REPO_NAME } = parsed;

const configs = await getAllContent(octokit, login, REPO_NAME, "configs");
const src = await getAllContent(octokit, login, REPO_NAME, "src");

const contents = [...configs, ...src].flat().join("\n\n");

const { OUTPUT_PATH } = parsed;

await writeFile(OUTPUT_PATH, downgradeToES5(contents), { encoding: "utf-8" });
