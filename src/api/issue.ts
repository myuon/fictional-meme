import useSWR from "swr";
import { octokit } from "./octokit";

export const useIssues = () => {
  return useSWR("/issues.list", () =>
    octokit.issues
      .list({ sort: "updated", direction: "desc" })
      .then((result) => result.data)
  );
};
