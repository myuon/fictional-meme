import useSWR from "swr";
import { octokit } from "./octokit";

export const useAuthUser = () => {
  return useSWR("user.authenticated", () =>
    octokit.users.getAuthenticated().then((result) => result.data)
  );
};
