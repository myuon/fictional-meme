import useSWR from "swr";
import { User } from "../model/user";
import { octokit } from "./octokit";

export const useAuthUser = () => {
  return useSWR<User | undefined>("user.authenticated", () =>
    octokit.users.getAuthenticated().then((result) => result.data)
  );
};
