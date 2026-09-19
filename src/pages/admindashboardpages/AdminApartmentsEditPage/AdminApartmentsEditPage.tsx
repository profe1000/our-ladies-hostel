import AdminEditApartmentUnitForm from "../../../components/admincomponents/adminApartmentsUnitcomp/admin-apartment-unit-edit/admin-apartment-unit-edit-form";
import Tabbar from "../../../components/LayoutComponent/TabBar/Tabbar";
import { TopBarAdmin } from "../../../components/LayoutComponent/TopBar-Admin/TopBar-Admin";
import "./AdminApartmentsEditPage.css";

export const AdminApartmentsEditPage = () => {
  return (
    <>
      <TopBarAdmin
        showNotification={true}
        showBackButton={true}
        backButtonHref={"/admin/apartment/1"}
        showProfile={false}
      ></TopBarAdmin>

      <div className="w3-col w3-margin-top">
        <AdminEditApartmentUnitForm></AdminEditApartmentUnitForm>
      </div>

      <Tabbar></Tabbar>
    </>
  );
};

export default AdminApartmentsEditPage;
