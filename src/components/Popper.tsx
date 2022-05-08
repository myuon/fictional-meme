import { css } from "@emotion/react";
import { flip, shift, useFloating } from "@floating-ui/react-dom";
import {
  UseFloatingProps,
  UseFloatingReturn,
} from "@floating-ui/react-dom/src";
import { useMemo, useRef, useState } from "react";
import React from "react";
import { theme } from "./theme";
import { useClickOutside } from "./useClickOutside";

type PopperFloatingProps = Omit<UseFloatingReturn, "reference">;

export const usePopper = (
  options?: UseFloatingProps
): {
  open: boolean;
  openPopper: () => void;
  onClose: () => void;
  ref: UseFloatingReturn["reference"];
  floatingProps: PopperFloatingProps;
} => {
  const { reference, ...props } = useFloating({
    middleware: [shift(), flip()],
    ...options,
  });
  const [open, setOpen] = useState(false);

  return useMemo(
    () => ({
      open,
      openPopper: () => setOpen(true),
      onClose: () => setOpen(false),
      ref: reference,
      floatingProps: props,
    }),
    [open, reference, props]
  );
};

export interface PopperProps {
  open?: boolean;
  onClose?: () => void;
  children?: React.ReactNode;
  floatingProps: PopperFloatingProps;
}

export const Popper = ({
  open = false,
  onClose,
  children,
  floatingProps,
}: PopperProps) => {
  const clickAreaRef = useRef<HTMLDivElement | null>(null);
  useClickOutside(clickAreaRef, onClose);

  return (
    <div ref={clickAreaRef}>
      <div
        ref={floatingProps.floating}
        style={{
          position: floatingProps.strategy,
          top: floatingProps.y ?? "",
          left: floatingProps.x ?? "",
        }}
        css={[
          css`
            color: ${theme.palette.text.main};
            background-color: white;
            box-shadow: ${theme.shadow[4]};
          `,
          !open &&
            css`
              display: none;
            `,
        ]}
      >
        {children}
      </div>
    </div>
  );
};
