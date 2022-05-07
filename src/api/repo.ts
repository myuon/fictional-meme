import useSWR from "swr";
import {
  GetRepositoryDocument,
  GetRepositoryQuery,
  GetRepositoryQueryVariables,
} from "../generated/graphql";
import { request } from "./fetch";

export const useRepository = (owner: string, name: string) => {
  return useSWR(["repo.get", owner, name], () =>
    request<GetRepositoryQueryVariables, GetRepositoryQuery>(
      GetRepositoryDocument,
      {
        owner,
        name,
      }
    )
  );
};
