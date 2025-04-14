import React from "react";
import { useRouterContext, useRouterType, useLink } from "@refinedev/core";
import { Typography, theme, Space } from "antd";
import type { RefineLayoutThemedTitleProps } from "@refinedev/antd";
import { Logo } from "../logo";

const defaultText = "SyncShire";

const defaultIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="25"
    height="25"
    viewBox="0 0 7.75 7.75"
    fill="none"
  >
    <path
      width="124"
      height="124"
      rx="24"
      fill="#F97316"
      d="M1.5 0h4.75a1.5 1.5 0 0 1 1.5 1.5v4.75a1.5 1.5 0 0 1 -1.5 1.5H1.5a1.5 1.5 0 0 1 -1.5 -1.5V1.5a1.5 1.5 0 0 1 1.5 -1.5z"
    />
    <path
      d="M1.211 2.299v3.99a0.25 0.25 0 0 0 0.25 0.25h3.99a0.25 0.25 0 0 0 0.177 -0.427l-3.99 -3.99a0.25 0.25 0 0 0 -0.427 0.177Z"
      fill="white"
    />
    <path
      cx="63.2109"
      cy="37.5391"
      r="18.1641"
      fill="black"
      d="M5.086 2.346a1.136 1.136 0 0 1 -1.136 1.136 1.136 1.136 0 0 1 -1.135 -1.136 1.136 1.136 0 0 1 2.271 0z"
    />
    <path
      opacity="0.4"
      x="81.1328"
      y="80.7198"
      width="17.5687"
      height="17.3876"
      rx="4"
      fill="#FDBA74"
      d="m-9.328 40.311 0.423 -0.423a0.25 0.25 0 0 1 0.354 0l0.415 0.415a0.25 0.25 0 0 1 0 0.354l-0.423 0.423a0.25 0.25 0 0 1 -0.354 0l-0.415 -0.415a0.25 0.25 0 0 1 0 -0.353z"
    />
  </svg>
);

export const ThemedTitleV2: React.FC<RefineLayoutThemedTitleProps> = ({
  collapsed,
  //   icon = defaultIcon,
  //   text = defaultText,
  wrapperStyles,
}) => {
  const { token } = theme.useToken();
  const routerType = useRouterType();
  const Link = useLink();
  const { Link: LegacyLink } = useRouterContext();

  const ActiveLink = routerType === "legacy" ? LegacyLink : Link;

  return (
    <ActiveLink
      to="/"
      style={{
        display: "inline-block",
        textDecoration: "none",
      }}
    >
      <Space
        style={{
          display: "flex",
          alignItems: "center",
          fontSize: "inherit",
          ...wrapperStyles,
        }}
      >
        {/* <div
          style={{
            height: "24px",
            width: "24px",
            color: token.colorPrimary,
          }}
        >
          {icon}
        </div>

        {!collapsed && (
          <Typography.Title
            style={{
              fontSize: "inherit",
              marginBottom: 0,
              fontWeight: 700,
            }}
          >
            {text}
          </Typography.Title>
        )} */}

        <Logo
          style={{
            width: "200px",
          }}
        />
      </Space>
    </ActiveLink>
  );
};
