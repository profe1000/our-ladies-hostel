import { useParams } from "react-router-dom";
import AdminContextHeader from "../../../components/admincomponents/adminContextHeader/adminContextHeader";
import AdminUnitOccupantComp from "../../../components/admincomponents/adminApartmentsUnitcomp/admin-apartment-unit-occupant/admin-apartment-unit-occupant";
import Tabbar from "../../../components/LayoutComponent/TabBar/Tabbar";
import { TopBarAdmin } from "../../../components/LayoutComponent/TopBar-Admin/TopBar-Admin";
import "./AdminApartmentsTenants.css";

export const AdminApartmentsTenants = () => {
  const params = useParams();
  return (
    <>
      <TopBarAdmin
        showNotification={true}
        showBackButton={true}
        backButtonHref={"/admin/apartment/1"}
        showProfile={false}
      ></TopBarAdmin>

      <AdminContextHeader apartmentId={params?.id} pageTitle="Occupant"></AdminContextHeader>

      <div className="w3-col w3-margin-top">
        <AdminUnitOccupantComp></AdminUnitOccupantComp>
      </div>

      <Tabbar></Tabbar>
    </>
  );
};

export default AdminApartmentsTenants;
