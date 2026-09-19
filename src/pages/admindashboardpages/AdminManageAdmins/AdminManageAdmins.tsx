import AdminListWrapper from "../../../components/admincomponents/adminSettingsComponent/admin-list-wrapper/admin-list-wrapper";
import Tabbar from "../../../components/LayoutComponent/TabBar/Tabbar";
import { TopBarAdmin } from "../../../components/LayoutComponent/TopBar-Admin/TopBar-Admin";
import "./AdminManageAdmins.css";

export const AdminManageAdmins = () => {
  return (
    <>
      <TopBarAdmin showNotification={true} showProfile={false}></TopBarAdmin>

      <AdminListWrapper></AdminListWrapper>

      <Tabbar></Tabbar>
    </>
  );
};

export default AdminManageAdmins;
