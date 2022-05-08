import { css } from "@emotion/react";
import React, { useState } from "react";
import { useAuthUser } from "../api/user";
import { Loading } from "../components/Loading";
import { useInvolvedIssues } from "../api/issues";
import { IssueItem } from "./Index/IssueItem";
import { Link } from "react-router-dom";
import DeveloperModeIcon from "@mui/icons-material/DeveloperMode";
import { Page } from "../components/Page";
import { Button } from "../components/Button";

const fromStatusState = (
  state: "EXPECTED" | "ERROR" | "FAILURE" | "PENDING" | "SUCCESS" | undefined
): "success" | "error" | "pending" | undefined => {
  return state === "SUCCESS"
    ? "success"
    : state === "FAILURE" || state === "ERROR"
    ? "error"
    : state === "PENDING"
    ? "pending"
    : undefined;
};

export const IndexPage = () => {
  const [mode, setMode] = useState<"you" | "yourTeam">("you");

  const { data: user } = useAuthUser();
  const { data: issues } = useInvolvedIssues(
    user?.viewer.login,
    mode === "you" ? user?.viewer.login : undefined,
    5 * 60
  );

  return (
    <Page
      headerRight={
        <div
          css={css`
            display: flex;
            gap: 8px;
          `}
        >
          <p>Hi, {user?.viewer.name}!</p>
          <Link to="/components">
            <DeveloperModeIcon />
          </Link>
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
              state={issue.closed ? "closed" : issue.isDraft ? "draft" : "open"}
              repository={{
                owner: issue.repository.owner.login,
                name: issue.repository.name,
              }}
              commit={(() => {
                if (issue.mergeCommit) {
                  return {
                    oid: issue.mergeCommit.abbreviatedOid,
                    checkStatus: fromStatusState(
                      issue.mergeCommit.statusCheckRollup?.state
                    ),
                  };
                } else if (issue.headRef?.target) {
                  const target = issue.headRef.target;
                  if (target.__typename === "Commit") {
                    const state = target.status?.state;
                    return {
                      oid: target.abbreviatedOid,
                      checkStatus: fromStatusState(state),
                    };
                  }
                }

                return undefined;
              })()}
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
