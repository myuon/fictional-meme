import { css } from "@emotion/react";
import { flip, shift, useFloating } from "@floating-ui/react-dom";
import {
  UseFloatingProps,
  UseFloatingReturn,
} from "@floating-ui/react-dom/src";
import { useMemo } from "react";
import React from "react";
import { theme } from "./theme";

type PopperFloatingProps = Omit<UseFloatingReturn, "reference">;

export const usePopper = (
  options?: UseFloatingProps
): {
  ref: UseFloatingReturn["reference"];
  props: PopperFloatingProps;
} => {
  const { reference, ...props } = useFloating({
    middleware: [shift(), flip()],
    ...options,
  });

  return useMemo(
    () => ({
      ref: reference,
      props,
    }),
    [reference, props]
  );
};

export interface PopperProps {
  open?: boolean;
  children?: React.ReactNode;
  floatingProps: PopperFloatingProps;
}

export const Popper = ({
  open = false,
  children,
  floatingProps,
}: PopperProps) => {
  return (
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
  );
};
