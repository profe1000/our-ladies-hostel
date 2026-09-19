import { AdminApartmentOccupantLog } from "../../../components/admincomponents/adminApartmentsUnitcomp/admin-apartment-unit-occupant-log/admin-apartment-unit-occupant-log";
import Tabbar from "../../../components/LayoutComponent/TabBar/Tabbar";
import { TopBarAdmin } from "../../../components/LayoutComponent/TopBar-Admin/TopBar-Admin";
import "./AdminApartmentsTenantsHistory.css";

export const AdminApartmentsTenantsHistory = () => {
  return (
    <>
      <TopBarAdmin
        showNotification={true}
        showBackButton={true}
        backButtonHref={"/admin/apartment/1"}
        showProfile={false}
      ></TopBarAdmin>

      <div className="w3-col w3-margin-top">
        <AdminApartmentOccupantLog></AdminApartmentOccupantLog>
      </div>

      <Tabbar></Tabbar>
    </>
  );
};

export default AdminApartmentsTenantsHistory;
