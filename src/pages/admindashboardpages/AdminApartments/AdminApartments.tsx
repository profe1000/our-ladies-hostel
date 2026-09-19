import AdminApartmentUnitListWrapper from "../../../components/admincomponents/adminApartmentsUnitcomp/admin-apartment-unit-list-wrapper/admin-apartment-unit-list-wrapper";
import Tabbar from "../../../components/LayoutComponent/TabBar/Tabbar";
import { TopBarAdmin } from "../../../components/LayoutComponent/TopBar-Admin/TopBar-Admin";
import "./AdminApartments.css";

export const AdminApartments = () => {
  return (
    <>
      <TopBarAdmin
        showNotification={true}
        showBackButton={true}
        backButtonHref={"/admin/Buildings"}
        showProfile={false}
      ></TopBarAdmin>

      <AdminApartmentUnitListWrapper></AdminApartmentUnitListWrapper>

      <Tabbar></Tabbar>
    </>
  );
};

export default AdminApartments;
