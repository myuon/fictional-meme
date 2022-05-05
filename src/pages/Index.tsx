import { css } from "@emotion/react";
import * as React from "react";
import { useIssues } from "../api/issue";
import { useAuthUser } from "../api/user";
import { theme } from "../components/theme";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import * as dayjs from "dayjs";
import MergeTypeIcon from "@mui/icons-material/MergeType";
import GitHubIcon from "@mui/icons-material/GitHub";

export const IndexPage = () => {
  const { data: user } = useAuthUser();
  const { data: issues } = useIssues();

  return (
    <div
      css={css`
        main {
          max-width: 1024px;
          margin: 32px auto;
        }
      `}
    >
      <header
        css={[
          css`
            position: sticky;
            top: 0;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 12px 16px;
          `,
          theme.glass,
        ]}
      >
        <h1
          css={css`
            display: flex;
            gap: 8px;
            align-items: center;
            color: ${theme.palette.primary.main};
          `}
        >
          <GitHubIcon
            css={css`
              font-size: inherit;
            `}
          />
          Gimlet
        </h1>
        <p>Hi, {user?.name}!</p>
      </header>

      <main>
        <div
          css={css`
            display: grid;
            gap: 16px;
          `}
        >
          {issues?.map((issue) => (
            <div
              key={issue.id}
              css={css`
                display: grid;
                gap: 8px;
              `}
            >
              <a
                href={issue.html_url}
                target="_blank"
                css={css`
                  display: flex;
                  gap: 6px;
                  align-items: center;
                  font-weight: 600;
                `}
                rel="noreferrer"
              >
                {issue.pull_request ? (
                  <MergeTypeIcon
                    css={css`
                      color: ${theme.palette.semantical.open.main};
                    `}
                  />
                ) : (
                  <ErrorOutlineIcon
                    css={css`
                      color: ${theme.palette.semantical.open.main};
                    `}
                  />
                )}
                {issue.title}
              </a>
              <small
                css={css`
                  color: ${theme.palette.gray[600]};

                  & > span:not(:last-of-type)::after {
                    content: "・";
                  }
                `}
              >
                <span>{issue.repository?.full_name}</span>
                <span>
                  {dayjs(issue.updated_at).format("YYYY-MM-DD")} updated
                </span>
              </small>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default IndexPage;
