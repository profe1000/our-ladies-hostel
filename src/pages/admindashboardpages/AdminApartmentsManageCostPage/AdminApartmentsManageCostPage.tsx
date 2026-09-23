import { useParams } from "react-router-dom";
import AdminContextHeader from "../../../components/admincomponents/adminContextHeader/adminContextHeader";
import AdminAddUnitCost from "../../../components/admincomponents/adminApartmentsUnitcomp/admin-apartment-unit-cost-add/admin-unitcost-add";
import { AdminApartmentUnitCost } from "../../../components/admincomponents/adminApartmentsUnitcomp/admin-apartment-unit-cost-list/admin-apartment-unit-cost-list";
import Tabbar from "../../../components/LayoutComponent/TabBar/Tabbar";
import { TopBarAdmin } from "../../../components/LayoutComponent/TopBar-Admin/TopBar-Admin";
import "./AdminApartmentsManageCostPage.css";

export const AdminApartmentsManageCostPage = () => {
  const params = useParams();
  return (
    <>
      <TopBarAdmin
        showNotification={true}
        showBackButton={true}
        backButtonHref={"/admin/apartment/1"}
        showProfile={false}
      ></TopBarAdmin>

      <AdminContextHeader apartmentId={params?.id} pageTitle="Manage Cost"></AdminContextHeader>

      <div className="w3-col w3-margin-top">
        <div className="w3-col">
          <AdminApartmentUnitCost hidePagination={false}></AdminApartmentUnitCost>
        </div>

        <div className="w3-col w3-margin-top">
          <AdminAddUnitCost></AdminAddUnitCost>
        </div>
      </div>

      <Tabbar></Tabbar>
    </>
  );
};

export default AdminApartmentsManageCostPage;
