import { useParams } from "react-router-dom";
import { Page } from "../components/Page";
import { assertIsDefined } from "../helper/assert";
import { useBlob } from "../api/blob";
import { LinkButton } from "../components/Button";
import SyntaxHighlighter from "react-syntax-highlighter";
import { xcode } from "react-syntax-highlighter/dist/esm/styles/hljs";
import React from "react";

const FileViewer = ({ text }: { text?: string }) => {
  return text ? (
    <SyntaxHighlighter style={xcode} language="json" showLineNumbers>
      {text}
    </SyntaxHighlighter>
  ) : null;
};

export const BlobObjectPage = () => {
  const { id } = useParams<{ id: string }>();
  assertIsDefined(id);

  const { data } = useBlob(id);

  return (
    <Page>
      {data?.node?.__typename === "Blob" ? (
        <div>
          <p>
            <span>{data.node.byteSize}B</span>・
            <LinkButton>{data.node.abbreviatedOid}</LinkButton>
          </p>

          <FileViewer text={data.node.text ?? undefined} />
        </div>
      ) : null}
    </Page>
  );
};
