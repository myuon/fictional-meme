import { css } from "@emotion/react";
import React from "react";
import { theme } from "./theme";

export const Progress = ({ progress }: { progress: number }) => {
  return (
    <div
      css={css`
        position: relative;
      `}
    >
      <div
        css={css`
          position: absolute;
          width: ${progress * 100}%;
          height: 4px;
          background-color: ${theme.palette.primary.dark};
        `}
      />
      <div
        css={css`
          width: 100%;
          height: 4px;
          background-color: ${theme.palette.gray[200]};
        `}
      />
    </div>
  );
};
