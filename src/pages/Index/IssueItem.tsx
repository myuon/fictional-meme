import { css } from "@emotion/react";
import React from "react";
import MergeTypeIcon from "@mui/icons-material/MergeType";
import { theme } from "../../components/theme";
import dayjs from "dayjs";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

const iconStyle = css`
  &[data-status="closed"] {
    color: ${theme.palette.semantical.closed.main};
  }
  &[data-status="open"] {
    color: ${theme.palette.semantical.open.main};
  }
  &[data-status="draft"] {
    color: ${theme.palette.semantical.draft.main};
  }
`;

export const IssueItem = ({
  variant,
  state,
  url,
  title,
  repositoryName,
  updatedAt,
}: {
  variant: "issue" | "pr";
  state: "closed" | "open" | "draft";
  url: string;
  title: string;
  repositoryName: string;
  updatedAt: string;
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
          color: ${theme.palette.gray[600]};

          & > span:not(:last-of-type)::after {
            content: "・";
          }
        `}
      >
        <span>{repositoryName}</span>
        <span>{dayjs(updatedAt).fromNow()} updated</span>
      </small>
    </div>
  );
};
