import CreateAdminForm from "../../../components/admincomponents/adminSettingsComponent/CreateAdmin-Form/CreateAdmin-Form";
import Tabbar from "../../../components/LayoutComponent/TabBar/Tabbar";
import { TopBarAdmin } from "../../../components/LayoutComponent/TopBar-Admin/TopBar-Admin";
import "./AdminManageAdminAdd.css";

export const AdminManageAdminAdd = () => {
  return (
    <>
      <TopBarAdmin showNotification={true} showProfile={false}></TopBarAdmin>
      <CreateAdminForm></CreateAdminForm>
      <Tabbar></Tabbar>
    </>
  );
};

export default AdminManageAdminAdd;
