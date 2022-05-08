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
  user: string | undefined,
  refreshIntervalSeconds: number
) => {
  return useSWR<SearchIssuesQuery>(
    name ? ["issues.involvedIssues", name, user] : null,
    () =>
      request<SearchIssuesQueryVariables, SearchIssuesQuery>(
        SearchIssuesDocument,
        {
          last: 30,
          type: SearchType.Issue,
          q: Object.entries({
            involves: name,
            user,
            sort: "updated-desc",
          })
            .filter(([, value]) => Boolean(value))
            .map(([key, value]) => `${key}:${value}`)
            .join(" "),
        }
      ),
    {
      refreshInterval: refreshIntervalSeconds * 1000,
    }
  );
};
