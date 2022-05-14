import { css } from "@emotion/react";
import React, { useEffect, useState } from "react";
import { useAuthUser } from "../api/user";
import { Loading } from "../components/Loading";
import { getPrLatestCommit, useInvolvedIssues } from "../api/issues";
import { IssueItem } from "./Index/IssueItem";
import { useNavigate } from "react-router-dom";
import DeveloperModeIcon from "@mui/icons-material/DeveloperMode";
import { Page } from "../components/Page";
import { Button, IconButton } from "../components/Button";
import { SearchBox } from "./Index/SearchBox";
import { SearchIssuesResultPullRequestFragment } from "../generated/graphql";
import { notify } from "../components/notification";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useLocalStorageState } from "../components/useLocalStorage";
import dayjs from "dayjs";

export const IndexPage = () => {
  const [mode, setMode] = useState<"you" | "yourTeam">("you");

  const { data: user } = useAuthUser();
  const { data: issues, mutate } = useInvolvedIssues(
    user?.viewer.login,
    mode === "you" ? user?.viewer.login : undefined,
    2.5 * 60
  );

  const [latestPushedDate, setLatestPushedDate] = useLocalStorageState<
    number | null
  >("latestPushedDateInUnixTime", null);

  useEffect(
    () => {
      const prs = issues?.search.nodes?.filter(
        (
          node
        ): node is Omit<SearchIssuesResultPullRequestFragment, "__typename"> & {
          __typename: "PullRequest";
        } => node?.__typename === "PullRequest"
      );

      if (prs) {
        prs.forEach((pr) => {
          const commit = getPrLatestCommit(pr);
          if (
            commit?.checkStatus === "error" &&
            dayjs.utc(commit.pushedDate).unix() > latestPushedDate
          ) {
            notify(
              `CI failed in ${pr.title}(${pr.repository.owner.login}/${pr.repository.name})`,
              {
                url: pr.url,
              }
            );

            setLatestPushedDate(
              Math.max(dayjs().utc(commit.pushedDate).unix(), latestPushedDate)
            );
          }
        });
      }
    },
    // mute latestPushedDate, setLatestPushedDate
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [issues?.search.nodes]
  );

  const navigate = useNavigate();

  return (
    <Page
      headerRight={
        <div
          css={css`
            display: flex;
            gap: 4px;
            align-items: center;
          `}
        >
          <p>Hi, {user?.viewer.name}!</p>
          <SearchBox />
          <IconButton
            onClick={() => {
              navigate("/components");
            }}
          >
            <DeveloperModeIcon />
          </IconButton>
        </div>
      }
    >
      {!issues && <Loading />}
      {issues && (
        <div
          css={css`
            display: flex;
            gap: 8px;
            margin: 0 auto;
            margin-bottom: 32px;
          `}
        >
          <Button
            color={mode === "you" ? "primary" : "default"}
            rounded
            onClick={() => setMode("you")}
          >
            OWNER
          </Button>
          <Button
            color={mode === "yourTeam" ? "primary" : "default"}
            rounded
            onClick={() => setMode("yourTeam")}
          >
            INVOLVED
          </Button>
          <IconButton onClick={() => mutate()}>
            <RefreshIcon />
          </IconButton>
        </div>
      )}
      <div
        css={css`
          display: grid;
          gap: 16px;
        `}
      >
        {issues?.search.nodes?.map((issue) =>
          issue?.__typename === "PullRequest" ? (
            <IssueItem
              key={issue.id}
              {...issue}
              variant="pr"
              state={
                issue.closed
                  ? issue.merged
                    ? "closed"
                    : "closedNoMerge"
                  : issue.isDraft
                  ? "draft"
                  : "open"
              }
              repository={{
                owner: issue.repository.owner.login,
                name: issue.repository.name,
              }}
              commit={getPrLatestCommit(issue)}
            />
          ) : issue?.__typename === "Issue" ? (
            <IssueItem
              key={issue.id}
              {...issue}
              variant="issue"
              state={issue.closed ? "closed" : "open"}
              repository={{
                owner: issue.repository.owner.login,
                name: issue.repository.name,
              }}
            />
          ) : null
        )}
      </div>
    </Page>
  );
};

export default IndexPage;
