import { css } from "@emotion/react";
import dayjs from "dayjs";
import React from "react";
import { Link } from "react-router-dom";
import { AnchorButton, Button } from "../components/Button";
import { Modal, useModal } from "../components/Modal";
import { Progress } from "../components/Progress";
import { theme } from "../components/theme";
import { Toast, useToasts } from "../components/Toast";
import { sleep } from "../helper/sleep";

export const ComponentsPage = () => {
  const { addToast, updateToast } = useToasts();
  const { openModal, ...modal } = useModal({ closeOnClickOutside: true });

  return (
    <main
      css={css`
        padding: 8px 24px;

        section {
          display: grid;
          gap: 16px;
          margin-bottom: 32px;

          header {
            margin: 7px 0;
          }

          .row {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
          }
        }
      `}
    >
      <div
        css={css`
          display: flex;
          justify-content: flex-end;
          margin-top: 16px;
        `}
      >
        <Link
          to="/"
          css={css`
            color: ${theme.palette.text.light};
            text-decoration: underline;
          `}
        >
          Back
        </Link>
      </div>
      <section>
        <header>
          <h3>Buttons</h3>
        </header>

        <div className="row">
          <Button color="primary">ボタンだよ</Button>
          <Button>ボタンだよ</Button>
        </div>

        <div className="row">
          <Button color="primary" rounded>
            ボタンだよ
          </Button>
          <Button rounded>ボタンだよ</Button>
        </div>
      </section>

      <section>
        <header>
          <h3>Shadows</h3>
        </header>

        <div className="row">
          {Object.keys(theme.shadow).map((key) => (
            <div
              key={key}
              css={[
                css`
                  display: grid;
                  place-items: center;
                  width: 100px;
                  height: 100px;
                `,
                {
                  boxShadow:
                    theme.shadow[key as unknown as keyof typeof theme.shadow],
                },
              ]}
            >
              {key}
            </div>
          ))}
        </div>
      </section>

      <section>
        <header>
          <h3>Primary Shadows</h3>
        </header>

        <div className="row">
          {Object.keys(theme.primaryShadow).map((key) => (
            <div
              key={key}
              css={[
                css`
                  display: grid;
                  place-items: center;
                  width: 100px;
                  height: 100px;
                  color: white;
                  background-color: ${theme.palette.primary.main};
                  border-radius: 4px;
                `,
                {
                  boxShadow:
                    theme.primaryShadow[
                      key as unknown as keyof typeof theme.primaryShadow
                    ], // ],
                },
              ]}
            >
              {key}
            </div>
          ))}
        </div>
      </section>

      <section>
        <header>
          <h3>Toast</h3>
        </header>

        <div className="row">
          <Toast
            id=""
            message="こんにちは これはトーストです。"
            disableAnimation
          />
        </div>
        <div className="row">
          <Toast
            id=""
            message="「今は昔、竹取の翁（おきな）といふものありけり。 野山にまじりて竹を取りつつ、よろづのことに使ひけり。 名をば、さぬきの造（みやつこ）となむいひける。 その竹の中に、もと光る竹なむ一筋（ひとすぢ）ありける。"
            disableAnimation
          />
        </div>
        <div className="row">
          <Toast
            id=""
            message="こんにちは これはトーストのサンプルです。"
            loading
            progress={0.5}
            disableAnimation
          />
        </div>
        <div className="row">
          <Toast
            id=""
            message={
              <>
                <AnchorButton href="https://example.com">
                  https://example.com
                </AnchorButton>
                へのリンク
              </>
            }
            disableAnimation
          />
        </div>

        <div
          className="row"
          css={css`
            margin-top: 16px;
          `}
        >
          <Button
            onClick={() => {
              addToast(`Hi! ${dayjs().format("HH:mm:ss")}`);
            }}
          >
            Add Toast
          </Button>

          <Button
            onClick={() => {
              addToast(
                "「今は昔、竹取の翁（おきな）といふものありけり。 野山にまじりて竹を取りつつ、よろづのことに使ひけり。 名をば、さぬきの造（みやつこ）となむいひける。 その竹の中に、もと光る竹なむ一筋（ひとすぢ）ありける。"
              );
            }}
          >
            Add Toast with Looooooong text
          </Button>

          <Button
            onClick={async () => {
              const id = addToast(`Starting a job... [1/3]`, {
                width: 350,
                loading: true,
                progress: 0,
              });

              await sleep(3000);

              updateToast(id, {
                message: `Doing the job... [2/3]`,
                width: 350,
                loading: true,
                progress: 0.33,
              });

              await sleep(3000);

              updateToast(id, {
                message: `Doing the job... [3/3]`,
                width: 350,
                loading: true,
                progress: 0.66,
              });

              await sleep(3000);

              updateToast(id, {
                message: `Finishing the job...`,
                width: 350,
                loading: true,
                progress: 1.0,
              });

              await sleep(3000);

              updateToast(id, {
                message: `Done!`,
                loading: false,
                progress: undefined,
              });
            }}
          >
            Add Toast with timeout
          </Button>
        </div>
      </section>

      <section>
        <header>
          <h3>Progress</h3>
        </header>

        <div
          css={css`
            max-width: 400px;
          `}
        >
          <Progress progress={0.2} />
        </div>
      </section>

      <section>
        <header>
          <h3>Modal</h3>
        </header>

        <div>
          <Button
            onClick={() => {
              openModal();
            }}
          >
            Open Modal
          </Button>

          <Modal {...modal}>
            <div
              css={css`
                display: grid;
                gap: 8px;
              `}
            >
              <h3>This is a Modal</h3>

              <p>Here is a information for you. Are you sure?</p>
            </div>
          </Modal>
        </div>
      </section>
    </main>
  );
};
