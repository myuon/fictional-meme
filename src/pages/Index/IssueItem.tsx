import { css } from "@emotion/react";
import React from "react";
import MergeTypeIcon from "@mui/icons-material/MergeType";
import { theme } from "../../components/theme";
import dayjs from "dayjs";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import PendingIcon from "@mui/icons-material/Pending";
import { Link } from "react-router-dom";
import { AnchorButton } from "../../components/Button";

const iconStyle = css`
  &[data-status="closed"] {
    color: ${theme.palette.semantical.closed.main};
  }
  &[data-status="closedNoMerge"] {
    color: ${theme.palette.semantical.error.main};
  }
  &[data-status="open"] {
    color: ${theme.palette.semantical.open.main};
  }
  &[data-status="draft"] {
    color: ${theme.palette.semantical.draft.main};
  }
`;
const checkStatusStyle = css`
  margin-left: 4px;
  font-size: inherit;
  vertical-align: middle;

  &[data-status="success"] {
    color: ${theme.palette.semantical.success.main};
  }
  &[data-status="error"] {
    color: ${theme.palette.semantical.error.main};
  }
  &[data-status="pending"] {
    color: ${theme.palette.semantical.warning.main};
  }
`;

export const IssueItem = ({
  variant,
  state,
  url,
  title,
  repository,
  updatedAt,
  commit,
}: {
  variant: "issue" | "pr";
  state: "closed" | "closedNoMerge" | "open" | "draft";
  url: string;
  title: string;
  repository: {
    owner: string;
    name: string;
  };
  updatedAt: string;
  commit?: {
    oid?: string;
    checkStatus?: "success" | "error" | "pending";
    url?: string;
  };
}) => {
  return (
    <div
      css={css`
        display: grid;
        gap: 8px;
      `}
    >
      <a
        href={url}
        target="_blank"
        css={css`
          display: flex;
          gap: 6px;
          align-items: center;
          font-weight: 600;
          line-height: 1.3;
        `}
        rel="noreferrer"
      >
        {variant === "issue" ? (
          <ErrorOutlineIcon data-status={state} css={iconStyle} />
        ) : (
          <MergeTypeIcon data-status={state} css={iconStyle} />
        )}
        {title}
      </a>
      <small
        css={css`
          color: ${theme.palette.text.light};

          & > span:not(:last-of-type)::after {
            content: "・";
          }
        `}
      >
        <span key="repositoryName">
          <Link to={`/repo/${repository.owner}/${repository.name}`}>
            {repository.owner}/{repository.name}
          </Link>
        </span>
        <span key="updatedAt">{dayjs(updatedAt).fromNow()}</span>
        {commit ? (
          <span key="latestCommit">
            <AnchorButton
              href={commit.url}
              blank
              css={css`
                font-size: inherit;
              `}
            >
              {commit?.oid}
              {commit.checkStatus === "success" ? (
                <CheckIcon data-status="success" css={checkStatusStyle} />
              ) : commit.checkStatus === "error" ? (
                <ClearIcon data-status="error" css={checkStatusStyle} />
              ) : commit.checkStatus === "pending" ? (
                <PendingIcon data-status="pending" css={checkStatusStyle} />
              ) : null}
            </AnchorButton>
          </span>
        ) : undefined}
      </small>
    </div>
  );
};
