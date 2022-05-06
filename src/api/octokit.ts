import { graphql } from "@octokit/graphql";
import { Octokit } from "@octokit/rest";
import { GraphQLClient } from "graphql-request";
import token from "../../secrets/token";
import { getSdk } from "../generated/graphql";

export const octokit = new Octokit({
  auth: token.token,
});

export const graphqlWithAuth = graphql.defaults({
  headers: {
    authorization: `token ${token.token}`,
  },
});

export const sdk = getSdk(
  new GraphQLClient("api.github.com", {
    headers: {
      authorization: `token ${token.token}`,
    },
  })
);
