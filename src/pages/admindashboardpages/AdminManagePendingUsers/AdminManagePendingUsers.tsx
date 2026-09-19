import AdminPendingUsersListWrapper from "../../../components/admincomponents/adminSettingsComponent/admin-pending-user-list/admin-pending-user-list-wrapper";
import Tabbar from "../../../components/LayoutComponent/TabBar/Tabbar";
import { TopBarAdmin } from "../../../components/LayoutComponent/TopBar-Admin/TopBar-Admin";

export const AdminManagePendingUsers = () => {
  return (
    <>
      <TopBarAdmin showNotification={true} showProfile={false}></TopBarAdmin>

      <AdminPendingUsersListWrapper></AdminPendingUsersListWrapper>

      <Tabbar></Tabbar>
    </>
  );
};

export default AdminManagePendingUsers;
