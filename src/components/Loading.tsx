import { css } from "@emotion/react";
import { RaceBy } from "@uiball/loaders";
import React from "react";
import { theme } from "./theme";

export const Loading = () => {
  return (
    <div
      css={[
        css`
          display: grid;
          place-items: center;
          width: 100%;
          height: calc(100vh - 100px);
        `,
      ]}
    >
      <RaceBy size={80} speed={1.25} color={theme.palette.primary.main} />
    </div>
  );
};
