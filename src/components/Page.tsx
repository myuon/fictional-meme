import { css } from "@emotion/react";
import React from "react";
import { theme } from "./theme";
import GitHubIcon from "@mui/icons-material/GitHub";
import { Link, useNavigate } from "react-router-dom";
import { LinkButton } from "./Button";

export const Page = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();

  return (
    <div
      css={css`
        main {
          display: grid;
          grid-template-rows: auto 1fr;
          width: 100%;
          max-width: 1024px;
          padding-right: 32px;
          padding-left: 16px;
          margin: 32px auto;
          overflow-x: scroll;
        }
      `}
    >
      <header
        css={[
          css`
            position: sticky;
            top: 0;
            z-index: 2;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 12px 16px;
          `,
          theme.glass,
        ]}
      >
        <Link to="/">
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
        </Link>
        <LinkButton onClick={() => navigate(-1)}>Back</LinkButton>
      </header>

      <main>{children}</main>
    </div>
  );
};
