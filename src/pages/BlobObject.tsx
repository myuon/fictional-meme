import { useLocation, useParams } from "react-router-dom";
import { Page } from "../components/Page";
import { assertIsDefined } from "../helper/assert";
import { useBlob } from "../api/blob";
import { LinkButton } from "../components/Button";
import SyntaxHighlighter from "react-syntax-highlighter";
import { xcode } from "react-syntax-highlighter/dist/esm/styles/hljs";
import React from "react";
import { css } from "@emotion/react";
import {
  PackageJsonDependency,
  parsePackageJson,
} from "../helper/packageJsonParser";

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

const FileViewer = ({
  fileName,
  text,
  packageJsonDependency,
}: {
  fileName?: string;
  text?: string;
  packageJsonDependency?: PackageJsonDependency;
}) => {
  console.log(packageJsonDependency);
  return text ? (
    <SyntaxHighlighter
      style={xcode}
      language={fileName ? detectLanguageFromFileName(fileName) : undefined}
      showLineNumbers
    >
      {text}
    </SyntaxHighlighter>
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
