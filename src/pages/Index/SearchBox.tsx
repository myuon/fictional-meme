import { IconButton } from "../../components/Button";
import { Modal, useModal } from "../../components/Modal";
import SearchIcon from "@mui/icons-material/Search";
import React, { useEffect, useRef, useState } from "react";
import { TextField } from "../../components/TextField";
import { css } from "@emotion/react";
import { useDebounce } from "use-debounce";
import { useSearchRepository } from "../../api/repo";
import { useAuthUser } from "../../api/user";
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

  const [value_, setValue] = useState("");
  const [value] = useDebounce(value_, 500);

  const { data: user } = useAuthUser();
  const { data: repos } = useSearchRepository(value, user?.viewer.login);

  const selectedRepo = (() => {
    const first = repos?.search?.nodes?.[0];
    if (first?.__typename === "Repository") {
      return {
        id: first.id,
        owner: first.owner.login,
        name: first.name,
      };
    }

    return undefined;
  })();

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
            {repos?.search.nodes?.map((repo) =>
              repo?.__typename === "Repository" ? (
                <div
                  key={repo.id}
                  data-selected={repo.id === selectedRepo?.id}
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
                    {repo.owner.login} / {repo.name}
                  </p>
                </div>
              ) : null
            )}
          </div>
        </div>
      </Modal>
    </>
  );
};
