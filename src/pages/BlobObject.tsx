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

const findPackageVersionNode = (element: HTMLElement, item: PackageItem) => {
  const getElementByLine = (element: HTMLElement, nth: number) => {
    let counter = 1;

    for (let i = 0; i < element.childNodes.length; i++) {
      const current = element.childNodes.item(i);
      if (counter == nth) {
        return current;
      }

      if (current.textContent?.includes("\n")) {
        counter++;
      }
    }
  };
  const getElementByColumn = (element: Node, column: number) => {
    let counter = 0;
    let current = element;

    while (counter < column) {
      const length = current?.textContent?.length;
      if (length) {
        counter += length;
      }

      if (current.nextSibling) {
        current = current.nextSibling;
      } else {
        return undefined;
      }
    }

    if (counter === column) {
      return current.nextSibling;
    }
  };
  const findLocNode = (element: HTMLElement, line: number, column: number) => {
    const lineElement = getElementByLine(element, line);
    if (lineElement) {
      return getElementByColumn(lineElement, column);
    }

    return undefined;
  };

  if (element) {
    const node = findLocNode(
      element,
      item.version.loc.line,
      item.version.loc.column
    );
    if (node) {
      return node as HTMLElement;
    }
  }
};

const PackageTooltip = ({
  item,
  ...props
}: {
  item: PackageItem;
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
            {item.name.value}
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
  const [open, setOpen] = useState(false);

  const { ref: popperRef, props: popperProps } = usePopper();

  useEffectOnce(() => {
    console.log(packageJsonDependency);

    // Find dependencies for package.json and transform the dom
    if (packageJsonDependency && ref.current) {
      const element = ref.current
        .getElementsByTagName("pre")
        .item(0)
        ?.getElementsByTagName("code")
        .item(0);
      const item = packageJsonDependency?.devDependencies?.[0];
      if (element && item) {
        const targetNode = findPackageVersionNode(element, item);
        if (targetNode) {
          const reactRoot = ReactDOM.createRoot(targetNode);
          const children = React.createElement("span", {
            dangerouslySetInnerHTML: { __html: targetNode.innerHTML },
            className: targetNode.getAttribute("class"),
          });

          reactRoot.render(
            <button
              css={css`
                color: inherit;
                text-decoration: underline;
              `}
              ref={popperRef}
              onClick={() => setOpen(true)}
            >
              {children}
            </button>
          );
        }
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
        <PackageTooltip
          item={packageJsonDependency.devDependencies[0]}
          open={open}
          floatingProps={popperProps}
        />
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
