import console from "fancy-log";
import { type Octokit } from "octokit";
import { basename } from "path";
type RecursiveArray<T> = Array<T | RecursiveArray<T>>;

export const getAllContent = async (
  octokit: Octokit,
  owner: string,
  repo: string,
  path: string,
  level = 0
): Promise<RecursiveArray<string>> => {
  const folderName = basename(path) || path;
  console.info(level ? `|${"_".repeat(level)} ${folderName}` : folderName);

  const { data } = await octokit.rest.repos.getContent({
    owner,
    repo,
    path,
  });

  const entries = data instanceof Array ? data : [data];

  const output: RecursiveArray<string> = [];

  for (const entry of entries) {
    const { path, type } = entry;

    if (type === "dir") {
      output.push(await getAllContent(octokit, owner, repo, path, level + 1));
    }

    if (type === "file") {
      console.info(`|${"_".repeat(level + 1)} ${basename(path)}`);

      const { data } = await octokit.rest.repos.getContent({
        owner,
        repo,
        path,
      });

      if (data instanceof Array || data.type !== "file") {
        continue;
      }

      output.push(Buffer.from(data.content, "base64").toString("utf-8"));
    }
  }

  return output;
};
