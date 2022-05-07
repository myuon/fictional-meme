import { useLocation, useParams } from "react-router-dom";
import { Page } from "../components/Page";
import { assertIsDefined } from "../helper/assert";
import { useBlob } from "../api/blob";
import { LinkButton } from "../components/Button";
import SyntaxHighlighter from "react-syntax-highlighter";
import { xcode } from "react-syntax-highlighter/dist/esm/styles/hljs";
import React, { useEffect, useRef } from "react";
import { css } from "@emotion/react";
import {
  PackageItem,
  PackageJsonDependency,
  parsePackageJson,
} from "../helper/packageJsonParser";
import ReactDOM from "react-dom/client";

const detectLanguageFromFileName = (fileName: string) => {
  if (fileName.endsWith(".ts")) {
    return "typescript";
  } else if (fileName.endsWith(".js")) {
    return "javascript";
  } else if (fileName.endsWith(".json")) {
    return "json";
  } else {
    return undefined;
  }
};

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

const useEffectOnce = (run: () => void) => {
  const once = useRef(false);

  useEffect(() => {
    if (!once.current) {
      run();
      once.current = true;
    }
  }, [run]);
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
          const RenderComponent = ({
            children,
          }: {
            children: React.ReactNode;
          }) => {
            return (
              <button
                css={css`
                  color: inherit;
                  text-decoration: underline;
                `}
                onClick={() => {
                  console.log(item);
                }}
              >
                {children}
              </button>
            );
          };

          const children = React.createElement("span", {
            dangerouslySetInnerHTML: { __html: targetNode.innerHTML },
            className: targetNode.getAttribute("class"),
          });

          reactRoot.render(<RenderComponent>{children}</RenderComponent>);
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
