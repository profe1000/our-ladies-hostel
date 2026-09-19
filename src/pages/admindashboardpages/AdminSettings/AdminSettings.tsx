import AdminSettingWrapper from "../../../components/admincomponents/adminSettingsComponent/admin-settings-wrapper/admin-settings-wrapper";
import Tabbar from "../../../components/LayoutComponent/TabBar/Tabbar";
import { TopBarAdmin } from "../../../components/LayoutComponent/TopBar-Admin/TopBar-Admin";
import "./AdminSettings.css";

export const AdminSettings = () => {
  return (
    <>
      <TopBarAdmin showNotification={true} showProfile={false}></TopBarAdmin>

      <AdminSettingWrapper></AdminSettingWrapper>

      <Tabbar></Tabbar>
    </>
  );
};

export default AdminSettings;
