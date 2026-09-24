import AdminTenantRequestList from "../../../components/admincomponents/adminTenantRequests/adminTenantRequestList";
import Tabbar from "../../../components/LayoutComponent/TabBar/Tabbar";
import { TopBarAdmin } from "../../../components/LayoutComponent/TopBar-Admin/TopBar-Admin";

export const AdminTenantRequests = () => {
  return (
    <>
      <TopBarAdmin showNotification={true} showProfile={false}></TopBarAdmin>

      <AdminTenantRequestList></AdminTenantRequestList>

      <Tabbar></Tabbar>
    </>
  );
};

export default AdminTenantRequests;
