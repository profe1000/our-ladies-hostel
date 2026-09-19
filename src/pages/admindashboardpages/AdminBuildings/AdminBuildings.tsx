import AdminBuildingListWrapper from "../../../components/admincomponents/adminBuildingsComp/admin-building-list-wrapper/admin-building-list-wrapper";
import Tabbar from "../../../components/LayoutComponent/TabBar/Tabbar";
import { TopBarAdmin } from "../../../components/LayoutComponent/TopBar-Admin/TopBar-Admin";
import "./AdminBuildings.css";

export const AdminBuildings = () => {
  return (
    <>
      <TopBarAdmin showNotification={true} showProfile={false}></TopBarAdmin>

      <AdminBuildingListWrapper></AdminBuildingListWrapper>

      <Tabbar></Tabbar>
    </>
  );
};

export default AdminBuildings;
