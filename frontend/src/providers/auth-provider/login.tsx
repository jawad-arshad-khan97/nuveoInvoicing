import { ThemedTitleV2 } from "@/components/sider/title";
import { Button, Layout, Space, Typography } from "antd";
import backgroundImage from "../../../public/assets/loginBackground.jpg";

import { useAuth0 } from "@auth0/auth0-react";

export const Login: React.FC = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <Layout
      style={{
        height: "100vh",
        justifyContent: "center",
        alignItems: "center",
        backgroundImage: `url(${backgroundImage})`, // Use the imported image
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Space
        direction="vertical"
        align="center"
        style={{
          width: "300px",
          height: "400px", // Set the desired width
          padding: "24px", // Add padding for content
          borderRadius: "16px", // Add rounded corners
          backdropFilter: "blur(0px)", // Add backdrop blur effect
          background: "rgba(3, 3, 3, 0.5)", // Glass-like background color
          boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)", // Subtle white shadow
          border: "1px solid rgba(3, 3, 3, 0.29)",
          WebkitBackdropFilter: "blur(0px)",
        }}
      >
        {/* <ThemedTitleV2
          collapsed={false}
          wrapperStyles={{
            fontSize: "22px",
            marginBottom: "136px",
          }}
        /> */}
        <Button
          style={{
            width: "240px",
            marginBottom: "32px",
            backgroundColor: "#f6871f",
          }}
          type="primary"
          size="middle"
          onClick={() => loginWithRedirect()}
        >
          Sign in
        </Button>
        <Typography.Text type="secondary">
          Powered by
          <img
            style={{ padding: "0 5px" }}
            alt="Auth0"
            src="https://refine.ams3.cdn.digitaloceanspaces.com/superplate-auth-icons%2Fauth0-2.svg"
          />
          Auth0
        </Typography.Text>
      </Space>
    </Layout>
  );
};
