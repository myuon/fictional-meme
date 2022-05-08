import { Link, useParams } from "react-router-dom";
import { assertIsDefined } from "../helper/assert";
import React from "react";
import { css } from "@emotion/react";
import { theme } from "../components/theme";
import { useRepository } from "../api/repo";
import { Page } from "../components/Page";
import FolderIcon from "@mui/icons-material/Folder";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import { sort } from "fast-sort";

const ObjectIcon = ({ type }: { type: "file" | "directory" }) => {
  return type === "file" ? (
    <InsertDriveFileOutlinedIcon
      css={css`
        font-size: 16px;
        color: ${theme.palette.text.light};
      `}
    />
  ) : (
    <FolderIcon
      css={css`
        font-size: 16px;
        color: ${theme.palette.text.light};
      `}
    />
  );
};

export const RepositoryPage = () => {
  const { owner, name } = useParams<{
    owner: string;
    name: string;
  }>();
  assertIsDefined(owner);
  assertIsDefined(name);

  const { data } = useRepository(owner, name);

  const defaultBranchName = data?.repository?.defaultBranchRef?.name;
  const target = data?.repository?.defaultBranchRef?.target;

  return (
    <Page>
      <Link
        to="/"
        css={css`
          color: ${theme.palette.text.light};
          text-decoration: underline;
        `}
      >
        Back
      </Link>

      <div
        css={css`
          display: grid;
          gap: 8px;
        `}
      >
        <p>
          branch{" "}
          <span
            css={css`
              font-weight: bold;
            `}
          >
            {defaultBranchName}
          </span>
        </p>

        <div
          css={css`
            display: grid;
            gap: 4px;
          `}
        >
          {target?.__typename === "Commit"
            ? sort(target.tree.entries ?? [])
                .asc([
                  (entry) => (entry.type === "blob" ? 1 : 0),
                  (entry) => entry.name,
                ])
                ?.map((obj) => (
                  <Link
                    to={
                      obj.type === "blob"
                        ? `/object/blob/${obj.object?.id}`
                        : `#`
                    }
                    state={{
                      fileName: obj.name,
                      repositoryPath: `git@github.com:${owner}/${name}.git`,
                      repositoryName: name,
                    }}
                    key={obj.oid}
                    css={css`
                      display: grid;
                      grid-template-columns: auto 1fr;
                      gap: 8px;
                      align-items: center;
                    `}
                  >
                    <ObjectIcon
                      type={obj.type === "blob" ? "file" : "directory"}
                    />
                    <code>{obj.name}</code>
                  </Link>
                ))
            : null}
        </div>
      </div>
    </Page>
  );
};
