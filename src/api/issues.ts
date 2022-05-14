import useSWR from "swr";
import {
  SearchIssuesDocument,
  SearchIssuesQuery,
  SearchIssuesQueryVariables,
  SearchIssuesResultPullRequestFragment,
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

export const fromStatusState = (
  state: "EXPECTED" | "ERROR" | "FAILURE" | "PENDING" | "SUCCESS" | undefined
): "success" | "error" | "pending" | undefined => {
  return state === "SUCCESS"
    ? "success"
    : state === "FAILURE" || state === "ERROR"
    ? "error"
    : state === "PENDING"
    ? "pending"
    : undefined;
};

export const getPrLatestCommit = (
  issue: SearchIssuesResultPullRequestFragment
) => {
  if (issue.mergeCommit) {
    return {
      oid: issue.mergeCommit.abbreviatedOid,
      checkStatus: fromStatusState(issue.mergeCommit.statusCheckRollup?.state),
      pushedDate: issue.mergeCommit.pushedDate,
      url: issue.mergeCommit.url,
    };
  } else if (issue.headRef?.target) {
    const target = issue.headRef.target;
    if (target.__typename === "Commit") {
      const state = target.statusCheckRollup?.state;
      return {
        oid: target.abbreviatedOid,
        checkStatus: fromStatusState(state),
        pushedDate: target.pushedDate,
        url: target.url,
      };
    }
  }

  return undefined;
};
