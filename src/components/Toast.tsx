import { css } from "@emotion/react";
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { theme } from "./theme";
import CloseIcon from "@mui/icons-material/Close";

interface ToastState {
  id: string;
  message: string;
  timer: NodeJS.Timeout | undefined;
}

interface ToastContextProps {
  toasts: ToastState[];
  addToast: (message: string, options?: { timeout?: number }) => string;
  removeToast: (id: string) => void;
}

const ToastContext = React.createContext<ToastContextProps | undefined>(
  undefined
);

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<ToastState[]>([]);
  const removeToast = useCallback((targetId: string) => {
    setToasts((prev) => [...prev].filter(({ id }) => id !== targetId));
  }, []);
  const addToast = useCallback(
    (message: string, options?: { timeout?: number }) => {
      const id = `toast-${Math.random().toString(36).slice(2, 9)}`;
      const toast = { id, message, timer: undefined } as ToastState;
      if (options?.timeout) {
        const timer = setTimeout(() => {
          removeToast(id);
        }, options.timeout);
        toast.timer = timer;
      }

      setToasts((prev) => [...prev, toast]);
    },
    [removeToast]
  );

  const value = useMemo(
    () =>
      ({
        toasts,
        addToast,
        removeToast,
      } as ToastContextProps),
    [addToast, removeToast, toasts]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        css={css`
          position: fixed;
          top: 16px;
          right: 16px;
          display: grid;

          & > *:not(:first-of-type) {
            margin-top: 8px;
          }
        `}
      >
        {toasts.map(({ id, message }) => (
          <div
            key={id}
            css={css`
              // align to right
              margin-left: auto;
            `}
          >
            <Toast key={id} id={id} message={message} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToasts = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToasts must be used within a ToastProvider");
  }

  return useMemo(
    () => ({
      addToast: ctx.addToast,
      removeToast: ctx.removeToast,
    }),
    [ctx.addToast, ctx.removeToast]
  );
};

export const Toast = ({ id, message }: { id: string; message: string }) => {
  const { removeToast } = useToasts();
  // for animation
  const [show, setShow] = useState(false);
  useEffect(() => {
    setShow(true);
  }, []);

  return (
    <div
      data-show={show}
      css={[
        css`
          z-index: 3;
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 16px;
          align-items: center;
          max-width: 350px;
          padding: 12px 16px;
          color: white;
          background-color: ${theme.palette.primary.main};
          border-radius: 4px;
          box-shadow: ${theme.primaryShadow[5]};
        `,
        css`
          transition: all 0.12s ease-in-out;

          &[data-show="false"] {
            transform: translateX(100%);
          }
        `,
      ]}
    >
      <div>
        <p
          css={css`
            display: -webkit-box;
            overflow: hidden;
            text-overflow: clip;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
          `}
        >
          {message}
        </p>
      </div>
      <button
        onClick={() => {
          removeToast(id);
        }}
        css={css`
          display: grid;
          place-items: center;
        `}
      >
        <CloseIcon
          css={css`
            color: white;
          `}
        />
      </button>
    </div>
  );
};
