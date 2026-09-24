import AdminTenantRequestDetails from "../../../components/admincomponents/adminTenantRequests/adminTenantRequestDetails";
import Tabbar from "../../../components/LayoutComponent/TabBar/Tabbar";
import { TopBarAdmin } from "../../../components/LayoutComponent/TopBar-Admin/TopBar-Admin";

export const AdminTenantRequestDetailsPage = () => {
  return (
    <>
      <TopBarAdmin
        showNotification={true}
        showBackButton={true}
        backButtonHref={"/admin/tenant-requests"}
        showProfile={false}
      ></TopBarAdmin>

      <AdminTenantRequestDetails></AdminTenantRequestDetails>

      <Tabbar></Tabbar>
    </>
  );
};

export default AdminTenantRequestDetailsPage;
