import AdminContextHeader from "../../../components/admincomponents/adminContextHeader/adminContextHeader";
import AdminTenantDetails from "../../../components/admincomponents/adminApartmentsUnitcomp/admin-tenant-detail/admin-tenant-detail";
import Tabbar from "../../../components/LayoutComponent/TabBar/Tabbar";
import { TopBarAdmin } from "../../../components/LayoutComponent/TopBar-Admin/TopBar-Admin";
import "./AdminApartmentsTenantsHistoryDetails.css";

export const AdminApartmentsTenantsHistoryDetails = () => {
  return (
    <>
      <TopBarAdmin
        showNotification={true}
        showBackButton={true}
        backButtonHref={"/admin/apartment/1"}
        showProfile={false}
      ></TopBarAdmin>

      <AdminContextHeader showApartment={true} pageTitle="Tenant Details"></AdminContextHeader>

      <div className="w3-content adminPageBody">
        <AdminTenantDetails></AdminTenantDetails>
      </div>

      <Tabbar></Tabbar>
    </>
  );
};

export default AdminApartmentsTenantsHistoryDetails;
