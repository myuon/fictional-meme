import * as React from "react";
import { SWRConfig } from "swr";
import IndexPage from "./pages/Index";
import "ress";
import { css, Global } from "@emotion/react";
import { theme } from "./components/theme";

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
              -webkit-font-smoothing: antialiased;
            }
          `,
          {
            h1: theme.typography.h1,
            h2: theme.typography.h2,
            h3: theme.typography.h3,
            h4: theme.typography.h4,
            p: theme.typography.body,
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
