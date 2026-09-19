import AdminTenantRegistrationForm from "../../../components/admincomponents/adminApartmentsUnitcomp/admin-tenant-registrationForms/admin-tenant-registrationForms";
import Tabbar from "../../../components/LayoutComponent/TabBar/Tabbar";
import { TopBarAdmin } from "../../../components/LayoutComponent/TopBar-Admin/TopBar-Admin";
import "./AdminApartmentsTenantsAdd.css";

export const AdminApartmentsTenantsAdd = () => {
  return (
    <>
      <TopBarAdmin
        showNotification={true}
        showBackButton={true}
        backButtonHref={"/admin/apartment/1"}
        showProfile={false}
      ></TopBarAdmin>

      <div className="w3-col w3-margin-top">
        <AdminTenantRegistrationForm></AdminTenantRegistrationForm>
      </div>

      <Tabbar></Tabbar>
    </>
  );
};

export default AdminApartmentsTenantsAdd;
