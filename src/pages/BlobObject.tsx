import { useLocation, useParams } from "react-router-dom";
import { Page } from "../components/Page";
import { assertIsDefined } from "../helper/assert";
import { useBlob } from "../api/blob";
import { Button, LinkButton } from "../components/Button";
import SyntaxHighlighter from "react-syntax-highlighter";
import { xcode } from "react-syntax-highlighter/dist/esm/styles/hljs";
import React, { useRef, useState } from "react";
import { css } from "@emotion/react";
import {
  PackageItem,
  PackageJsonDependency,
  parsePackageJson,
} from "../helper/packageJsonParser";
import ReactDOM from "react-dom/client";
import ListIcon from "@mui/icons-material/List";
import { Popper, PopperProps, usePopper } from "../components/Popper";
import { useEffectOnce } from "../components/useEffectOnce";
import { detectLanguageFromFileName } from "../helper/detectLanguage";
import { findLocNode } from "./BlobObject/findLocNode";

const PackageTooltip = ({
  item,
  ...props
}: {
  item?: PackageItem;
} & Omit<PopperProps, "children">) => {
  return (
    <Popper {...props}>
      <div
        css={css`
          display: grid;
          gap: 4px;
          margin: 16px 24px;
        `}
      >
        <p>
          <span
            css={css`
              font-weight: bold;
            `}
          >
            {item?.name.value}
          </span>
          <span
            css={css`
              margin-left: 4px;
            `}
          >
            (Latest: <code>7.17.10</code>)
          </span>
        </p>
        <div
          css={css`
            display: grid;
            grid-template-columns: 1fr auto;
            gap: 8px;
            align-items: center;
          `}
        >
          <Button color="primary">UPGRADE</Button>
          <ListIcon />
        </div>
      </div>
    </Popper>
  );
};

const renderWrapperComponent = (
  targetNode: HTMLElement | undefined,
  Component: ({ children }: { children: React.ReactNode }) => JSX.Element
) => {
  if (!targetNode) return;

  const reactRoot = ReactDOM.createRoot(targetNode);
  const children = React.createElement("span", {
    dangerouslySetInnerHTML: { __html: targetNode.innerHTML },
    className: targetNode.getAttribute("class"),
  });

  reactRoot.render(<Component>{children}</Component>);
};

const FileViewer = ({
  fileName,
  text,
  packageJsonDependency,
}: {
  fileName?: string;
  text?: string;
  packageJsonDependency?: PackageJsonDependency;
}) => {
  const ref = useRef<HTMLDivElement | null>(null);

  const { ref: popperRef, openPopper, ...props } = usePopper();

  const [selectedItem, setSelectedItem] = useState<PackageItem | undefined>(
    undefined
  );

  useEffectOnce(() => {
    // Find dependencies for package.json and transform the dom
    if (packageJsonDependency && ref.current) {
      const element = ref.current
        .getElementsByTagName("pre")
        .item(0)
        ?.getElementsByTagName("code")
        .item(0);

      if (element) {
        [
          ...packageJsonDependency.dependencies,
          ...packageJsonDependency.devDependencies,
        ].forEach((item) => {
          const targetNode = findLocNode(element, item.version.loc);
          renderWrapperComponent(targetNode, ({ children }) => {
            return (
              <button
                css={css`
                  color: inherit;
                  text-decoration: underline;
                `}
                onClick={(event) => {
                  popperRef(event.currentTarget);
                  setSelectedItem(item);
                  openPopper();
                }}
              >
                {children}
              </button>
            );
          });
        });
      }
    }
  });

  return text ? (
    <div ref={ref}>
      <SyntaxHighlighter
        style={xcode}
        language={fileName ? detectLanguageFromFileName(fileName) : undefined}
        showLineNumbers
      >
        {text}
      </SyntaxHighlighter>

      {packageJsonDependency && (
        <PackageTooltip item={selectedItem} {...props} />
      )}
    </div>
  ) : null;
};

export const BlobObjectPage = () => {
  const { id } = useParams<{ id: string }>();
  assertIsDefined(id);

  const location = useLocation();
  const state = location.state as { fileName: string } | undefined;

  const { data } = useBlob(id);

  return (
    <Page>
      {data?.node?.__typename === "Blob" ? (
        <div>
          <p>
            <span
              css={css`
                font-weight: bold;
              `}
            >
              {state?.fileName}
            </span>
            ・<span>{data.node.byteSize}B</span>・
            <LinkButton>{data.node.abbreviatedOid}</LinkButton>
          </p>

          <FileViewer
            fileName={state?.fileName}
            text={data.node.text ?? undefined}
            packageJsonDependency={
              state?.fileName === "package.json" && data.node.text
                ? parsePackageJson(data.node.text)
                : undefined
            }
          />
        </div>
      ) : null}
    </Page>
  );
};
