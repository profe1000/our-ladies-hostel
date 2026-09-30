import { ReactNode, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ConfigProvider, Spin, theme } from "antd";
import { BellOutlined, CreditCardOutlined, PictureOutlined } from "@ant-design/icons";
import { adminGetSettingsApi } from "../../../apiservice/admin-General-ApiService";
import Tabbar from "../../../components/LayoutComponent/TabBar/Tabbar";
import { TopBarAdmin } from "../../../components/LayoutComponent/TopBar-Admin/TopBar-Admin";
import EstateBrandingForm from "../../../components/admincomponents/adminSettingsComponent/EstateSettings/EstateBrandingForm";
import EstateNotificationsForm from "../../../components/admincomponents/adminSettingsComponent/EstateSettings/EstateNotificationsForm";
import EstatePaystackForm from "../../../components/admincomponents/adminSettingsComponent/EstateSettings/EstatePaystackForm";
import "../../../components/admincomponents/adminContextHeader/adminContextHeader.css";
import "./AdminEstateSettings.css";

const Panel = ({ icon, title, children }: { icon: ReactNode; title: string; children: ReactNode }) => (
  <div className="adminPanel">
    <div className="adminPanelHeader">
      <h3 className="adminPanelTitle myfont3">
        <span className="adminPanelIcon">{icon}</span>
        {title}
      </h3>
    </div>
    {children}
  </div>
);

/** Estate super admins: logo and home pictures, notification emails, Paystack collections */
export const AdminEstateSettings = () => {
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    adminGetSettingsApi()
      .then((result) => setSettings(result?.data || {}))
      .catch(() => setSettings({}));
  }, []);

  return (
    <>
      <TopBarAdmin showNotification={true} showProfile={false}></TopBarAdmin>
      <ConfigProvider
        theme={{
          algorithm: theme.darkAlgorithm,
          token: { colorPrimary: "#b8952f", fontFamily: "Poppins, sans-serif", borderRadius: 8 },
        }}
      >
        <div className="w3-content adminPageBody">
          <nav className="adminCtxCrumbs myfont1" aria-label="Breadcrumb">
            <Link to="/admin/settings">Settings</Link>
            <span className="adminCtxCrumbSep">›</span>
            <span className="adminCtxCrumbCurrent">Estate Settings</span>
          </nav>

          <Panel icon={<PictureOutlined />} title="Logo and home page pictures">
            <EstateBrandingForm />
          </Panel>

          {settings === null ? (
            <div className="w3-center" style={{ padding: 24 }}>
              <Spin />
            </div>
          ) : (
            <>
              <Panel icon={<BellOutlined />} title="Notification emails">
                <EstateNotificationsForm settings={settings} onSaved={setSettings} />
              </Panel>
              <Panel icon={<CreditCardOutlined />} title="Paystack collections">
                <EstatePaystackForm settings={settings} onSaved={setSettings} />
              </Panel>
            </>
          )}
        </div>
      </ConfigProvider>
      <Tabbar></Tabbar>
    </>
  );
};

export default AdminEstateSettings;
