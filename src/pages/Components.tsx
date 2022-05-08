import { css } from "@emotion/react";
import dayjs from "dayjs";
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/Button";
import { theme } from "../components/theme";
import { Toast, useToasts } from "../components/Toast";

export const ComponentsPage = () => {
  const { addToast } = useToasts();

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

        <Toast id="" message="こんにちは これはトーストです。" />
        <Toast
          id=""
          message="「今は昔、竹取の翁（おきな）といふものありけり。 野山にまじりて竹を取りつつ、よろづのことに使ひけり。 名をば、さぬきの造（みやつこ）となむいひける。 その竹の中に、もと光る竹なむ一筋（ひとすぢ）ありける。"
        />

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
            onClick={() => {
              addToast(`Hi! Timeout: 3s`, { timeout: 3000 });
            }}
          >
            Add Toast with timeout
          </Button>
        </div>
      </section>
    </main>
  );
};
