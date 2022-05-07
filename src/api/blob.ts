import useSWR from "swr";
import {
  GetBlobDocument,
  GetBlobQuery,
  GetBlobQueryVariables,
} from "../generated/graphql";
import { request } from "./fetch";

export const useBlob = (id: string) => {
  return useSWR(["blob", id], () =>
    request<GetBlobQueryVariables, GetBlobQuery>(GetBlobDocument, { id })
  );
};
