import { graphql } from "@octokit/graphql";
import {
  GraphQlResponse,
  RequestParameters,
} from "@octokit/graphql/dist-types/types";
import { DocumentNode } from "graphql";
import token from "../../secrets/token";

const graphqlWithAuth = graphql.defaults({
  headers: {
    authorization: `token ${token.token}`,
  },
});
export const request = <V extends RequestParameters, R>(
  document: DocumentNode,
  variables: V
): GraphQlResponse<R> => {
  if (document.loc) {
    return graphqlWithAuth(document.loc?.source.body, variables);
  } else {
    throw new Error("Document does not have a location");
  }
};
