import AdminDashBoardWrapper from "../../../components/admincomponents/adminDashboardComp/admin-dashboard-wrapper/admin-dashboard-wrapper";
import Tabbar from "../../../components/LayoutComponent/TabBar/Tabbar";
import { TopBarAdmin } from "../../../components/LayoutComponent/TopBar-Admin/TopBar-Admin";
import "./AdminHome.css";

export const AdminHomePage = () => {
  return (
    <>
      <TopBarAdmin showNotification={true} showProfile={false}></TopBarAdmin>

      <AdminDashBoardWrapper></AdminDashBoardWrapper>
      
      <Tabbar></Tabbar>
    </>
  );
};

export default AdminHomePage;
