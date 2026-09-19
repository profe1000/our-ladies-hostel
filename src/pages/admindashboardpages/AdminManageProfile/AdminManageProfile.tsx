import Tabbar from "../../../components/LayoutComponent/TabBar/Tabbar";
import { TopBarAdmin } from "../../../components/LayoutComponent/TopBar-Admin/TopBar-Admin";
import "./AdminManageProfile.css";

export const AdminManageProfile = () => {
  return (
    <>
      <TopBarAdmin showNotification={true} showProfile={false}></TopBarAdmin>

      <Tabbar></Tabbar>
    </>
  );
};

export default AdminManageProfile;
