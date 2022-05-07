import useSWR from "swr";
import {
  SearchIssuesDocument,
  SearchIssuesQuery,
  SearchIssuesQueryVariables,
  SearchType,
} from "../generated/graphql";
import { request } from "./fetch";

export const useInvolvedIssues = (
  name: string | undefined,
  refreshIntervalSeconds: number
) => {
  return useSWR<SearchIssuesQuery>(
    name ? ["issues.involvedIssues", name] : null,
    () =>
      request<SearchIssuesQueryVariables, SearchIssuesQuery>(
        SearchIssuesDocument,
        {
          last: 30,
          type: SearchType.Issue,
          q: Object.entries({
            involves: name,
            sort: "updated-desc",
          })
            .map(([key, value]) => `${key}:${value}`)
            .join(" "),
        }
      ),
    {
      refreshInterval: refreshIntervalSeconds * 1000,
    }
  );
};
