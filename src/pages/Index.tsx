import { css } from "@emotion/react";
import * as React from "react";
import { useIssues } from "../api/issue";
import { useAuthUser } from "../api/user";
import { theme } from "../components/theme";

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
            padding: 8px 16px;
          `,
          theme.glass,
        ]}
      >
        <h1>G</h1>
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
            <div key={issue.id}>
              <h4>{issue.title}</h4>
              <span>{issue.updated_at}</span>,<span>{issue.created_at}</span>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default IndexPage;
