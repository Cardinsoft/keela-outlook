import { createAppAuth } from "@octokit/auth-app";
import { readFile } from "fs/promises";
import { Octokit } from "octokit";

export const getOctokit = async (
  keyPath: string,
  appId: number,
  installationId: number
) => {
  const privateKey = await readFile(keyPath, { encoding: "utf-8" });

  return new Octokit({
    authStrategy: createAppAuth,
    auth: {
      appId,
      installationId,
      privateKey,
    },
  });
};
