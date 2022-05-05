import { Octokit } from "@octokit/rest";
import token from "../../secrets/token";

export const octokit = new Octokit({
  auth: token.token,
});
