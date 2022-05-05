import * as React from "react";
import { SWRConfig } from "swr";
import IndexPage from "./pages/Index";

const Pages = () => {
  return <IndexPage />;
};

const Providers = ({ children }: { children: React.ReactNode }) => {
  return <SWRConfig value={{ revalidateOnFocus: false }}>{children}</SWRConfig>;
};

export const App = () => {
  return (
    <Providers>
      <Pages />
    </Providers>
  );
};
