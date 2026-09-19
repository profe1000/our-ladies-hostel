import AdminDetails from "../../../components/admincomponents/adminSettingsComponent/admin-details/admin-details";
import Tabbar from "../../../components/LayoutComponent/TabBar/Tabbar";
import { TopBarAdmin } from "../../../components/LayoutComponent/TopBar-Admin/TopBar-Admin";
import "./AdminManageAdminDetails.css";

export const AdminManageAdminDetails = () => {
  return (
    <>
      <TopBarAdmin
        showNotification={true}
        showBackButton={true}
        backButtonHref={"/admin"}
        showProfile={false}
      ></TopBarAdmin>

      <AdminDetails></AdminDetails>
      <Tabbar></Tabbar>
    </>
  );
};

export default AdminManageAdminDetails;
