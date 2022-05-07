import useSWR from "swr";
import {
  SearchIssuesDocument,
  SearchIssuesQuery,
  SearchIssuesQueryVariables,
} from "../generated/graphql";
import { graphqlWithAuth } from "./octokit";

export const useInvolvedIssues = () => {
  return useSWR<SearchIssuesQuery>(
    "issues.involvedIssues",
    async () =>
      await graphqlWithAuth(SearchIssuesDocument.loc?.source.body ?? "", {
        last: 10,
        type: "ISSUE",
        q: "involves:myuon sort:updated-desc",
      } as SearchIssuesQueryVariables)
  );
};
