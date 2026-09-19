import AdminAddBuilding from "../../../components/admincomponents/adminBuildingsComp/admin-building-add/admin-builiding-add";
import Tabbar from "../../../components/LayoutComponent/TabBar/Tabbar";
import { TopBarAdmin } from "../../../components/LayoutComponent/TopBar-Admin/TopBar-Admin";
import "./AdminBuildingsAddPage.css";

export const AdminBuildingsAddPage = () => {
  return (
    <>
      <TopBarAdmin
        showNotification={true}
        showBackButton={true}
        backButtonHref={"/admin/Buildings"}
        showProfile={false}
      ></TopBarAdmin>

      <div className="w3-col w3-margin-top">
        <AdminAddBuilding></AdminAddBuilding>
      </div>

      <Tabbar></Tabbar>
    </>
  );
};

export default AdminBuildingsAddPage;
