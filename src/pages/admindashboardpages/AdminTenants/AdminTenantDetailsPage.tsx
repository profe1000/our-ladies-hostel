import AdminTenantProfile from "../../../components/admincomponents/adminTenants/adminTenantProfile";
import Tabbar from "../../../components/LayoutComponent/TabBar/Tabbar";
import { TopBarAdmin } from "../../../components/LayoutComponent/TopBar-Admin/TopBar-Admin";

export const AdminTenantDetailsPage = () => {
  return (
    <>
      <TopBarAdmin
        showNotification={true}
        showBackButton={true}
        backButtonHref={"/admin/tenants"}
        showProfile={false}
      ></TopBarAdmin>

      <AdminTenantProfile></AdminTenantProfile>

      <Tabbar></Tabbar>
    </>
  );
};

export default AdminTenantDetailsPage;
