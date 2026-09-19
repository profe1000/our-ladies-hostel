import AdminUnitOccupantComp from "../../../components/admincomponents/adminApartmentsUnitcomp/admin-apartment-unit-occupant/admin-apartment-unit-occupant";
import Tabbar from "../../../components/LayoutComponent/TabBar/Tabbar";
import { TopBarAdmin } from "../../../components/LayoutComponent/TopBar-Admin/TopBar-Admin";
import "./AdminApartmentsTenants.css";

export const AdminApartmentsTenants = () => {
  return (
    <>
      <TopBarAdmin
        showNotification={true}
        showBackButton={true}
        backButtonHref={"/admin/apartment/1"}
        showProfile={false}
      ></TopBarAdmin>

      <div className="w3-col w3-margin-top">
        <AdminUnitOccupantComp></AdminUnitOccupantComp>
      </div>

      <Tabbar></Tabbar>
    </>
  );
};

export default AdminApartmentsTenants;
