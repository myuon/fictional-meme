import { graphql } from "@octokit/graphql";
import { Octokit } from "@octokit/rest";
import token from "../../secrets/token";

export const octokit = new Octokit({
  auth: token.token,
});

export const graphqlWithAuth = graphql.defaults({
  headers: {
    authorization: `token ${token.token}`,
  },
});
