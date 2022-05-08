import useSWR from "swr";
import {
  GetMyRepositoriesDocument,
  GetMyRepositoriesQuery,
  GetMyRepositoriesQueryVariables,
  GetRepositoryDocument,
  GetRepositoryQuery,
  GetRepositoryQueryVariables,
  SearchRepositoryDocument,
  SearchRepositoryQuery,
  SearchRepositoryQueryVariables,
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

export const useSearchRepository = (
  query: string,
  user: string | undefined
) => {
  return useSWR(user ? ["repo.search", user, query] : null, () =>
    request<SearchRepositoryQueryVariables, SearchRepositoryQuery>(
      SearchRepositoryDocument,
      {
        q: [
          Object.entries({
            in: "name",
            user,
          })
            .filter(([, value]) => Boolean(value))
            .map(([key, value]) => `${key}:${value}`)
            .join(" "),
          query,
        ].join(" "),
      }
    )
  );
};

export const useGetMyRepositories = (first: number) => {
  return useSWR(["repo.my", first], () =>
    request<GetMyRepositoriesQueryVariables, GetMyRepositoriesQuery>(
      GetMyRepositoriesDocument,
      { first }
    )
  );
};
