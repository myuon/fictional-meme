import { css } from "@emotion/react";
import React from "react";
import { theme } from "./theme";

const styles = {
  base: css`
    height: 40px;
    padding: 0 16px;
    line-height: 40px; // overrides from typography
    border-radius: 4px;
  `,
  rounded: css`
    border-radius: 9999px;
  `,
  colors: {
    primary: css`
      color: white;
      background-color: ${theme.palette.primary.main};
      box-shadow: ${theme.primaryShadow[3]};

      &:hover {
        box-shadow: ${theme.primaryShadow[4]};
      }
      &:active {
        background-color: ${theme.palette.primary.dark};
      }
    `,
    default: css`
      background-color: ${theme.palette.gray[100]};

      &:hover {
        background-color: ${theme.palette.gray[200]};
      }

      &:active {
        background-color: ${theme.palette.gray[300]};
      }
    `,
  },
};

export interface ButtonProps extends React.ComponentPropsWithoutRef<"button"> {
  rounded?: boolean;
  color?: "primary" | "default";
}

export const Button = ({
  rounded,
  color = "default",
  ...props
}: ButtonProps) => {
  return (
    <button
      {...props}
      css={[
        theme.typography.button,
        styles.base,
        styles.colors[color],
        rounded && styles.rounded,
      ]}
    />
  );
};

export const LinkButton = ({ children, color, ...props }: ButtonProps) => {
  return (
    <button
      {...props}
      css={[
        theme.typography.body,
        css`
          display: inline-block;
          color: ${color === "primary"
            ? theme.palette.primary.main
            : theme.palette.text.light};
          text-decoration: underline;
          &:hover {
            text-decoration: none;
          }
        `,
      ]}
    >
      {children}
    </button>
  );
};
