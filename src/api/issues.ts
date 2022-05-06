import useSWR from "swr";
import { graphqlWithAuth } from "./octokit";

export interface UseInvolvedIssuesResult {
  search: {
    nodes: {
      id: string;
      title: string;
      url: string;
      repository: {
        nameWithOwner: string;
      };
      updatedAt: string;
    }[];
  };
}

export const useInvolvedIssues = () => {
  return useSWR<UseInvolvedIssuesResult>(
    "issues.involvedIssues",
    async () =>
      await graphqlWithAuth(
        `
query searchIssues($last: Int!, $type: SearchType!, $q: String!) {
  search(last: $last, type: $type, query: $q) {
    nodes {
      ... on PullRequest {
        id
        title
        closed
        state
        isDraft
        url
        updatedAt
        headRef {
          name
          target {
            ... on Commit {
              id
              status {
                state
                id
              }
            }
            abbreviatedOid
          }
        }
        repository {
          nameWithOwner
        }
      }
    }
  }
}
`,
        {
          last: 10,
          type: "ISSUE",
          q: "involves:myuon is:pr",
        }
      )
  );
};
