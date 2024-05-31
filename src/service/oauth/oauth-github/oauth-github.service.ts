import axios from "axios";
import { GithubTokensResult, GithubUserResult } from "./types/oauth-github";

export async function GetGithubOAuthTokens({
  code,
}: {
  code: string;
}): Promise<string> {
  try {
    const res: GithubTokensResult = (await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: "145eec9b7cf80a564516",
        client_secret: "1b6ec617f9f49ea1d2c9eb25e80995b15e38304d",
        code: code,
      },
      {
        headers: {
          Accept: "application/json",
        },
      }
    )) as GithubTokensResult;

    return res.data.access_token;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function GetGithubUser({
  accessToken,
}: {
  accessToken: string;
}): Promise<GithubUserResult> {
  const url = "https://api.github.com/user";

  try {
    const res = await axios.get<GithubUserResult>(url, {
      headers: {
        Authorization: `token ${accessToken}`,
        "User-Agent": "node.js",
      },
    });

    return res.data;
  } catch (error: any) {
    throw new Error(error.message);
  }
}
