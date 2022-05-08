import { IconButton } from "../../components/Button";
import { Modal, useModal } from "../../components/Modal";
import SearchIcon from "@mui/icons-material/Search";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { TextField } from "../../components/TextField";
import { css } from "@emotion/react";
import { useGetMyRepositories } from "../../api/repo";
import { useNavigate } from "react-router-dom";
import { theme } from "../../components/theme";

export const SearchBox = () => {
  const { openModal, ...modal } = useModal({
    closeOnClickOutside: true,
    disableOnClose: true,
  });
  const inputRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    if (modal.open) {
      inputRef.current?.focus();
    }
  }, [modal.open]);

  const [value, setValue] = useState("");
  const keywords = value.split(" ");

  const { data: repos } = useGetMyRepositories(30);
  const options = useMemo(
    () =>
      (repos?.viewer.repositories?.nodes
        ?.map((repo) =>
          repo
            ? {
                id: repo.id,
                owner: repo.owner.login,
                name: repo.name,
              }
            : undefined
        )
        .filter(Boolean)
        .filter((option) => keywords.some((k) => option?.name.includes(k))) ??
        []) as {
        id: string;
        owner: string;
        name: string;
      }[],
    [keywords, repos?.viewer.repositories?.nodes]
  );
  const selectedRepo = options?.[0];

  const navigate = useNavigate();

  return (
    <>
      <IconButton onClick={openModal}>
        <SearchIcon />
      </IconButton>
      <Modal {...modal}>
        <div
          css={css`
            width: 80vw;
          `}
        >
          <TextField
            ref={inputRef}
            placeholder="Search for repository name"
            onChange={(event) => setValue(event.currentTarget.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                if (selectedRepo) {
                  navigate(
                    `/repo/${selectedRepo?.owner}/${selectedRepo?.name}`
                  );
                }
              }
            }}
          />
          <div
            css={css`
              display: grid;
              align-items: flex-start;
              height: 250px;
              overflow: auto;
            `}
          >
            {options.map((option) => (
              <div
                key={option.id}
                data-selected={option.id === selectedRepo?.id}
                css={css`
                  display: grid;
                  align-items: center;
                  padding: 16px 16px;

                  &[data-selected="true"] {
                    color: white;
                    background-color: ${theme.palette.primary.dark};
                  }
                `}
              >
                <p>
                  {option.owner} / {option.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Modal>
    </>
  );
};
