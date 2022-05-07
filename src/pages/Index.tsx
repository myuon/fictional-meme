import { css } from "@emotion/react";
import React from "react";
import { useAuthUser } from "../api/user";
import { theme } from "../components/theme";
import GitHubIcon from "@mui/icons-material/GitHub";
import { Loading } from "../components/Loading";
import { useInvolvedIssues } from "../api/issues";
import { IssueItem } from "./Index/IssueItem";

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
          padding: 16px;
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
          {issues?.search.nodes?.map((issue) =>
            issue?.__typename === "PullRequest" ? (
              <IssueItem
                variant="pr"
                state={
                  issue.closed ? "closed" : issue.isDraft ? "draft" : "open"
                }
                repositoryName={issue.repository.nameWithOwner}
                {...issue}
              />
            ) : issue?.__typename === "Issue" ? (
              <IssueItem
                variant="issue"
                state={issue.closed ? "closed" : "open"}
                repositoryName={issue.repository.nameWithOwner}
                {...issue}
              />
            ) : null
          )}
        </div>
      </main>
    </div>
  );
};

export default IndexPage;
