import { type Octokit } from "octokit";

export const getRepositoryFileContent = async (
  octokit: Octokit,
  owner: string,
  repo: string,
  path: string
) => {
  const { data } = await octokit.rest.repos.getContent({
    owner,
    repo,
    path,
  });

  if (data instanceof Array) {
    console.error("expected dist file, got a folder");
    return "";
  }

  const { type } = data;

  if (type !== "file") {
    console.error(`expected dist file, got a ${type}`);
    return "";
  }

  return Buffer.from(data.content, "base64").toString("utf-8");
};
