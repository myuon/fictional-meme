import { useParams } from "react-router-dom";
import { Page } from "../components/Page";
import { assertIsDefined } from "../helper/assert";
import React from "react";
import { useBlob } from "../api/blob";
import { LinkButton } from "../components/Button";
import { css } from "@emotion/react";
import { theme } from "../components/theme";

const FileViewer = ({ text }: { text: string }) => {
  return (
    <div
      css={css`
        display: grid;
        grid-template-columns: auto 1fr;
        gap: 8px;
      `}
    >
      <div
        css={css`
          display: grid;
          align-self: flex-start;
          justify-content: flex-end;
          padding: 0 8px;
          background-color: ${theme.palette.gray[100]};
        `}
      >
        {Array.from({ length: text.split("\n").length }, (_, k) => k + 1).map(
          (t) => (
            <code key={t}>{t}</code>
          )
        )}
      </div>
      <div>
        <pre>
          <code>{text}</code>
        </pre>
      </div>
    </div>
  );
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

          <div
            css={css`
              width: 100%;
              overflow-x: scroll;
            `}
          >
            <FileViewer text={data.node.text ?? ""} />
          </div>
        </div>
      ) : null}
    </Page>
  );
};
