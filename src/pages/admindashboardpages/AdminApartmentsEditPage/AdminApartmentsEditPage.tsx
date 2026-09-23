import { useParams } from "react-router-dom";
import AdminContextHeader from "../../../components/admincomponents/adminContextHeader/adminContextHeader";
import AdminEditApartmentUnitForm from "../../../components/admincomponents/adminApartmentsUnitcomp/admin-apartment-unit-edit/admin-apartment-unit-edit-form";
import Tabbar from "../../../components/LayoutComponent/TabBar/Tabbar";
import { TopBarAdmin } from "../../../components/LayoutComponent/TopBar-Admin/TopBar-Admin";
import "./AdminApartmentsEditPage.css";

export const AdminApartmentsEditPage = () => {
  const params = useParams();
  return (
    <>
      <TopBarAdmin
        showNotification={true}
        showBackButton={true}
        backButtonHref={"/admin/apartment/1"}
        showProfile={false}
      ></TopBarAdmin>

      <AdminContextHeader apartmentId={params?.id} pageTitle="Edit Apartment"></AdminContextHeader>

      <div className="w3-col w3-margin-top">
        <AdminEditApartmentUnitForm></AdminEditApartmentUnitForm>
      </div>

      <Tabbar></Tabbar>
    </>
  );
};

export default AdminApartmentsEditPage;
