import { useParams } from "react-router-dom";
import AdminContextHeader from "../../../components/admincomponents/adminContextHeader/adminContextHeader";
import AdminTenantRegistrationForm from "../../../components/admincomponents/adminApartmentsUnitcomp/admin-tenant-registrationForms/admin-tenant-registrationForms";
import Tabbar from "../../../components/LayoutComponent/TabBar/Tabbar";
import { TopBarAdmin } from "../../../components/LayoutComponent/TopBar-Admin/TopBar-Admin";
import "./AdminApartmentsTenantsAdd.css";

export const AdminApartmentsTenantsAdd = () => {
  const params = useParams();
  return (
    <>
      <TopBarAdmin
        showNotification={true}
        showBackButton={true}
        backButtonHref={"/admin/apartment/1"}
        showProfile={false}
      ></TopBarAdmin>

      <AdminContextHeader apartmentId={params?.id} pageTitle="Add Occupant"></AdminContextHeader>

      <div className="w3-col w3-margin-top">
        <AdminTenantRegistrationForm></AdminTenantRegistrationForm>
      </div>

      <Tabbar></Tabbar>
    </>
  );
};

export default AdminApartmentsTenantsAdd;
