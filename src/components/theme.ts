import { css } from "@emotion/react";

export const theme = {
  typography: {
    h1: {
      fontSize: 36,
      fontWeight: 700,
    },
    h2: {
      fontSize: 28,
      fontWeight: 700,
    },
    h3: { fontSize: 24, fontWeight: 600 },
    h4: { fontSize: 20, fontWeight: 600 },
    body: {
      fontSize: 16,
      fontWeight: 400,
      letterSpacing: 0.5,
      lineHeight: 1.65,
    },
    button: {
      fontSize: 16,
      fontWeight: 500,
      letterSpacing: 1.1,
      lineHeight: 1.15,
    },
  },
  glass: css`
    background: rgba(255, 255, 255, 0.5);
    border: 1px solid rgba(255, 255, 255, 0.3);
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
    -webkit-backdrop-filter: blur(5px);
    backdrop-filter: blur(5px);
  `,
};
