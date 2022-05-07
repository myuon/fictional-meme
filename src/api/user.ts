import useSWR from "swr";
import {
  GetViewerDocument,
  GetViewerQuery,
  GetViewerQueryVariables,
} from "../generated/graphql";
import { request } from "./fetch";

export const useAuthUser = () => {
  return useSWR(
    "viewer",
    () =>
      request<GetViewerQueryVariables, GetViewerQuery>(GetViewerDocument, {}),
    {}
  );
};
