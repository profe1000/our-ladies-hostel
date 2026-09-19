import AdminEditBuildingForm from "../../../components/admincomponents/adminBuildingsComp/admin-building-edit/admin-builiding-edit-form";
import AdminEditBuildingImage from "../../../components/admincomponents/adminBuildingsComp/admin-building-edit/admin-builiding-edit-image";
import Tabbar from "../../../components/LayoutComponent/TabBar/Tabbar";
import { TopBarAdmin } from "../../../components/LayoutComponent/TopBar-Admin/TopBar-Admin";
import "./AdminBuildingsEditPage.css";

export const AdminBuildingsEditPage = () => {
  return (
    <>
      <TopBarAdmin
        showNotification={true}
        showBackButton={true}
        backButtonHref={"/admin/Buildings"}
        showProfile={false}
      ></TopBarAdmin>

      <div className="w3-col w3-margin-top">
        <AdminEditBuildingForm></AdminEditBuildingForm>
      </div>

      <div className="w3-col w3-margin-top">
        <AdminEditBuildingImage></AdminEditBuildingImage>
      </div>

      <Tabbar></Tabbar>
    </>
  );
};

export default AdminBuildingsEditPage;
