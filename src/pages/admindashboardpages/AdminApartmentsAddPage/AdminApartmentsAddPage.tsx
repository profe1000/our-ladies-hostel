import AdminContextHeader from "../../../components/admincomponents/adminContextHeader/adminContextHeader";
import AdminAddApartmentUnitForm from "../../../components/admincomponents/adminApartmentsUnitcomp/admin-apartment-unit-add/admin-apartment-unit-add";
import Tabbar from "../../../components/LayoutComponent/TabBar/Tabbar";
import { TopBarAdmin } from "../../../components/LayoutComponent/TopBar-Admin/TopBar-Admin";
import "./AdminApartmentsAddPage.css";

export const AdminApartmentsAddPage = () => {
  return (
    <>
      <TopBarAdmin
        showNotification={true}
        showBackButton={true}
        backButtonHref={"/admin/apartment/1"}
        showProfile={false}
      ></TopBarAdmin>

      <AdminContextHeader pageTitle="Add Apartment"></AdminContextHeader>

      <div className="w3-col w3-margin-top">
        <AdminAddApartmentUnitForm></AdminAddApartmentUnitForm>
      </div>

      <Tabbar></Tabbar>
    </>
  );
};

export default AdminApartmentsAddPage;
