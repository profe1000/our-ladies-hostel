import { useParams } from "react-router-dom";
import AdminContextHeader from "../../../components/admincomponents/adminContextHeader/adminContextHeader";
import { AdminApartmentOccupantLog } from "../../../components/admincomponents/adminApartmentsUnitcomp/admin-apartment-unit-occupant-log/admin-apartment-unit-occupant-log";
import Tabbar from "../../../components/LayoutComponent/TabBar/Tabbar";
import { TopBarAdmin } from "../../../components/LayoutComponent/TopBar-Admin/TopBar-Admin";
import "./AdminApartmentsTenantsHistory.css";

export const AdminApartmentsTenantsHistory = () => {
  const params = useParams();
  return (
    <>
      <TopBarAdmin
        showNotification={true}
        showBackButton={true}
        backButtonHref={"/admin/apartment/1"}
        showProfile={false}
      ></TopBarAdmin>

      <AdminContextHeader apartmentId={params?.id} pageTitle="Occupant History"></AdminContextHeader>

      <div className="w3-col w3-margin-top">
        <AdminApartmentOccupantLog hidePagination={false}></AdminApartmentOccupantLog>
      </div>

      <Tabbar></Tabbar>
    </>
  );
};

export default AdminApartmentsTenantsHistory;
