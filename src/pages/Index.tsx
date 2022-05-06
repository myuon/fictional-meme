import { css } from "@emotion/react";
import * as React from "react";
import { useAuthUser } from "../api/user";
import { theme } from "../components/theme";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import * as dayjs from "dayjs";
import MergeTypeIcon from "@mui/icons-material/MergeType";
import GitHubIcon from "@mui/icons-material/GitHub";
import { Loading } from "../components/Loading";
import { useInvolvedIssues } from "../api/issues";

export const IndexPage = () => {
  const { data: user } = useAuthUser();
  const { data: issues } = useInvolvedIssues();

  return (
    <div
      css={css`
        main {
          display: grid;
          grid-template-rows: auto 1fr;
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
        {!issues && <Loading />}
        <div
          css={css`
            display: grid;
            gap: 16px;
          `}
        >
          {issues?.search.nodes?.map((issue) => (
            <div
              key={issue.id}
              css={css`
                display: grid;
                gap: 8px;
              `}
            >
              <a
                href={issue.url}
                target="_blank"
                css={css`
                  display: flex;
                  gap: 6px;
                  align-items: center;
                  font-weight: 600;
                `}
                rel="noreferrer"
              >
                {true ? (
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
                <span>{issue.repository?.nameWithOwner}</span>
                <span>
                  {dayjs(issue.updatedAt).format("YYYY-MM-DD")} updated
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
