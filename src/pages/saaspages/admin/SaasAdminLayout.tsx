import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Button, ConfigProvider, Drawer, Dropdown, Grid, Layout, Menu, Spin } from "antd";
import {
  AppstoreOutlined,
  DashboardOutlined,
  HomeOutlined,
  LogoutOutlined,
  MailOutlined,
  MenuOutlined,
  TeamOutlined,
  UserOutlined,
  UserSwitchOutlined,
} from "@ant-design/icons";
import { saasLogout, saasMe, SAAS_AUTH_DATA_KEY, SAAS_TOKEN_KEY } from "../../../apiservice/saas-ApiService";
import { SAAS_NAME } from "../../../utils/estate";
import { getString, removeItem } from "../../../utils/localStorage";
import { saasAdminTheme } from "./saasAdminTheme";
import SaasChangePasswordModal from "./SaasChangePasswordModal";
import "./saasAdmin.css";

const menuItems = [
  { key: "/saas", icon: <DashboardOutlined />, label: "Dashboard" },
  { key: "/saas/estates", icon: <HomeOutlined />, label: "Estates" },
  { key: "/saas/users", icon: <TeamOutlined />, label: "Users" },
  { key: "/saas/plans", icon: <AppstoreOutlined />, label: "Plans" },
  { key: "/saas/messages", icon: <MailOutlined />, label: "Messages" },
  { key: "/saas/admins", icon: <UserSwitchOutlined />, label: "SaaS admins" },
];

/** Shell for the SaaS admin pages. Checks the session and sends signed out admins to /saas/login */
const SaasAdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const screens = Grid.useBreakpoint();
  const [me, setMe] = useState<any>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);

  const signOut = () => {
    removeItem(SAAS_TOKEN_KEY);
    removeItem(SAAS_AUTH_DATA_KEY);
    navigate("/saas/login", { replace: true });
  };

  useEffect(() => {
    if (!getString(SAAS_TOKEN_KEY)) {
      signOut();
      return;
    }
    saasMe()
      .then((result) => setMe(result?.data))
      .catch(signOut);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const logout = async () => {
    try {
      await saasLogout();
    } finally {
      signOut();
    }
  };

  // Highlight the section, e.g. /saas/estates/5 => Estates
  const selectedKey =
    menuItems
      .map((item) => item.key)
      .filter((key) => key !== "/saas" && location.pathname.startsWith(key))[0] || "/saas";

  const menu = (
    <Menu
      theme="dark"
      mode="inline"
      selectedKeys={[selectedKey]}
      items={menuItems}
      onClick={({ key }) => {
        navigate(key);
        setDrawerOpen(false);
      }}
    />
  );

  const brand = (
    <div className="saasAdminBrand">
      {SAAS_NAME}
      <small>SaaS admin</small>
    </div>
  );

  if (!me) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <ConfigProvider theme={saasAdminTheme}>
      <Layout className="saasAdminShell">
        {screens.md ? (
          <Layout.Sider width={220} style={{ background: "#000000" }}>
            {brand}
            {menu}
          </Layout.Sider>
        ) : (
          <Drawer
            placement="left"
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            width={240}
            styles={{ body: { padding: 0, background: "#000000" }, header: { display: "none" } }}
          >
            {brand}
            {menu}
          </Drawer>
        )}

        <Layout>
          <Layout.Header className="saasAdminHeader">
            <div>
              {!screens.md && <Button type="text" icon={<MenuOutlined />} onClick={() => setDrawerOpen(true)} />}
            </div>
            <Dropdown
              menu={{
                items: [
                  { key: "password", label: "Change password", onClick: () => setPasswordOpen(true) },
                  { type: "divider" },
                  { key: "logout", label: "Sign out", icon: <LogoutOutlined />, onClick: logout },
                ],
              }}
            >
              <Button type="text" icon={<UserOutlined />}>
                {me.fullName || me.email}
              </Button>
            </Dropdown>
          </Layout.Header>
          <Layout.Content className="saasAdminContent">
            <Outlet context={{ me }} />
          </Layout.Content>
        </Layout>
      </Layout>
      <SaasChangePasswordModal open={passwordOpen} onClose={() => setPasswordOpen(false)} />
    </ConfigProvider>
  );
};

export default SaasAdminLayout;
