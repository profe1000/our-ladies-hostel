import AdminTenantEditForm from "../../../components/admincomponents/adminApartmentsUnitcomp/admin-tenant-edit-form/admin-tenant-edit-form";
import Tabbar from "../../../components/LayoutComponent/TabBar/Tabbar";
import { TopBarAdmin } from "../../../components/LayoutComponent/TopBar-Admin/TopBar-Admin";
import "./AdminApartmentsTenantsEdit.css";

export const AdminApartmentsTenantsEdit = () => {
  return (
    <>
      <TopBarAdmin
        showNotification={true}
        showBackButton={true}
        backButtonHref={"/admin/apartment/1"}
        showProfile={false}
      ></TopBarAdmin>

      <div className="w3-col w3-margin-top">
        <AdminTenantEditForm></AdminTenantEditForm>
      </div>

      <Tabbar></Tabbar>
    </>
  );
};

export default AdminApartmentsTenantsEdit;
