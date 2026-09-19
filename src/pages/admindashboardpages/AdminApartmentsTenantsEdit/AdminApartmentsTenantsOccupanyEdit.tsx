import AdminOccupantDateEditForm from "../../../components/admincomponents/adminApartmentsUnitcomp/admin-tenant-edit-form/admin-occupant-date-edit-form";
import Tabbar from "../../../components/LayoutComponent/TabBar/Tabbar";
import { TopBarAdmin } from "../../../components/LayoutComponent/TopBar-Admin/TopBar-Admin";
import "./AdminApartmentsTenantsEdit.css";

export const AdminApartmentsTenantsOccupancyEdit = () => {
  return (
    <>
      <TopBarAdmin
        showNotification={true}
        showBackButton={true}
        backButtonHref={"/admin/apartment/1"}
        showProfile={false}
      ></TopBarAdmin>

      <div className="w3-col w3-margin-top">
        <AdminOccupantDateEditForm></AdminOccupantDateEditForm>
      </div>

      <Tabbar></Tabbar>
    </>
  );
};

export default AdminApartmentsTenantsOccupancyEdit;
