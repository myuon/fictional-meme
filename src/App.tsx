import React from "react";
import { SWRConfig } from "swr";
import IndexPage from "./pages/Index";
import "ress";
import { css, Global } from "@emotion/react";
import { theme } from "./components/theme";
import relativeTime from "dayjs/plugin/relativeTime";
import dayjs from "dayjs";

dayjs.extend(relativeTime);

const Pages = () => {
  return <IndexPage />;
};

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <SWRConfig value={{ revalidateOnFocus: false }}>
      <Global
        styles={[
          css`
            html {
              font-family: ui-sans-serif, system-ui, -apple-system, sans-serif;
              -webkit-font-smoothing: antialiased;
            }

            a {
              color: inherit;
              text-decoration: none;
            }
          `,
          {
            body: theme.typography.body,
            h1: theme.typography.h1,
            h2: theme.typography.h2,
            h3: theme.typography.h3,
            h4: theme.typography.h4,
            small: theme.typography.caption,
          },
        ]}
      />
      {children}
    </SWRConfig>
  );
};

export const App = () => {
  return (
    <Providers>
      <Pages />
    </Providers>
  );
};
