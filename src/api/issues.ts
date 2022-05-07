import useSWR from "swr";
import {
  SearchIssuesDocument,
  SearchIssuesQuery,
  SearchIssuesQueryVariables,
} from "../generated/graphql";
import { graphqlWithAuth } from "./octokit";

export const useInvolvedIssues = (
  name: string | undefined,
  refreshIntervalSeconds: number
) => {
  return useSWR<SearchIssuesQuery>(
    name ? ["issues.involvedIssues", name] : null,
    async () =>
      await graphqlWithAuth(SearchIssuesDocument.loc?.source.body ?? "", {
        last: 30,
        type: "ISSUE",
        q: Object.entries({
          involves: name,
          sort: "updated-desc",
        })
          .map(([key, value]) => `${key}:${value}`)
          .join(" "),
      } as SearchIssuesQueryVariables),
    {
      refreshInterval: refreshIntervalSeconds * 1000,
    }
  );
};
