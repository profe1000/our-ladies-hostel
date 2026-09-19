import AdminDetailsMeEditPassword from "../../../components/admincomponents/adminSettingsComponent/admin-Details-Me-Edit-Password/Admin-Details-Me-Edit-Password";
import Tabbar from "../../../components/LayoutComponent/TabBar/Tabbar";
import { TopBarAdmin } from "../../../components/LayoutComponent/TopBar-Admin/TopBar-Admin";
import "./AdminManagePassword.css";

export const AdminManagePassword = () => {
  return (
    <>
      <TopBarAdmin showNotification={true} showProfile={false}></TopBarAdmin>

      <AdminDetailsMeEditPassword></AdminDetailsMeEditPassword>

      <Tabbar></Tabbar>
    </>
  );
};

export default AdminManagePassword;
