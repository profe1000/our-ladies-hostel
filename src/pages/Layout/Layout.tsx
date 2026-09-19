import "./Layout.css";
import { Outlet } from "react-router-dom";
import Layout, { Content } from "antd/es/layout/layout";

const LandingPagesLayout = () => {
  return (
    <Layout>
      <div
        className="w3-col backgroundApp"
        style={{ color: "white", minHeight: "100vh" }}
      >
        <Content>
          <Outlet />
        </Content>
      </div>
    </Layout>
  );
};

export default LandingPagesLayout;
