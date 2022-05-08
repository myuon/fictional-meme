import React from "react";
import { SWRConfig } from "swr";
import IndexPage from "./pages/Index";
import "ress";
import { css, Global } from "@emotion/react";
import { theme } from "./components/theme";
import relativeTime from "dayjs/plugin/relativeTime";
import dayjs from "dayjs";
import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import { ComponentsPage } from "./pages/Components";
import { RepositoryPage } from "./pages/Repository";
import { BlobObjectPage } from "./pages/BlobObject";
import { ToastProvider } from "./components/Toast";

dayjs.extend(relativeTime);

const Pages = () => {
  return (
    <Routes>
      <Route path="/" element={<IndexPage />} />
      <Route path="/repo/:owner/:name" element={<RepositoryPage />} />
      <Route path="/object/blob/:id" element={<BlobObjectPage />} />
      <Route path="/components" element={<ComponentsPage />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <SWRConfig value={{ revalidateOnFocus: false }}>
      <ToastProvider>
        <Global
          styles={[
            css`
              html {
                font-family: ui-sans-serif, system-ui, -apple-system, sans-serif;
                color: ${theme.palette.text.main};
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
        <HashRouter>{children}</HashRouter>
      </ToastProvider>
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
