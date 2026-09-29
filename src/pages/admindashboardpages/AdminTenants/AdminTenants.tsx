import AdminTenantList from "../../../components/admincomponents/adminTenants/adminTenantList";
import Tabbar from "../../../components/LayoutComponent/TabBar/Tabbar";
import { TopBarAdmin } from "../../../components/LayoutComponent/TopBar-Admin/TopBar-Admin";

export const AdminTenants = () => {
  return (
    <>
      <TopBarAdmin showNotification={true} showProfile={false}></TopBarAdmin>

      <AdminTenantList></AdminTenantList>

      <Tabbar></Tabbar>
    </>
  );
};

export default AdminTenants;
