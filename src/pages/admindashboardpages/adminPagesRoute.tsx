import "../../App.css";
import { Routes, Route } from "react-router-dom";
import Nopage from "../Nopage/Nopage";
import AdminHomePage from "./AdminHome/AdminHome";
import AdminSettings from "./AdminSettings/AdminSettings";
import AdminApartments from "./AdminApartments/AdminApartments";
import AdminBuildings from "./AdminBuildings/AdminBuildings";
import AdminBuildingsAddPage from "./AdminBuildingsAddPage/AdminBuildingsAddPage";
import AdminBuildingsEditPage from "./AdminBuildingsEditPage/AdminBuildingsEditPage";
import AdminApartmentsEditPage from "./AdminApartmentsEditPage/AdminApartmentsEditPage";
import AdminApartmentsManageCostPage from "./AdminApartmentsManageCostPage/AdminApartmentsManageCostPage";
import AdminApartmentsTenants from "./AdminApartmentsTenants/AdminApartmentsTenants";
import AdminApartmentsTenantsAdd from "./AdminApartmentsTenantsAdd/AdminApartmentsTenantsAdd";
import AdminApartmentsTenantsEdit from "./AdminApartmentsTenantsEdit/AdminApartmentsTenantsEdit";
import AdminManageProfile from "./AdminManageProfile/AdminManageProfile";
import AdminManagePassword from "./AdminManagePassword/AdminManagePassword";
import AdminManageAdmins from "./AdminManageAdmins/AdminManageAdmins";
import AdminManageAdminEdit from "./AdminManageAdminEdit/AdminManageAdminEdit";
import AdminManageAdminDetails from "./AdminManageAdminDetails/AdminManageAdminDetails";
import AdminManageAdminAdd from "./AdminManageAdminAdd/AdminManageAdminAdd";
import AdminApartmentsAddPage from "./AdminApartmentsAddPage/AdminApartmentsAddPage";
import AdminNotifcation from "./AdminNotifcation/AdminNotifcation";
import AdminApartmentsTenantsHistory from "./AdminApartmentsTenantsHistory/AdminApartmentsTenantsHistory";
import { AdminApartmentsTenantsHistoryDetails } from "./AdminApartmentsTenantsHistoryDetails/AdminApartmentsTenantsHistoryDetails";
import AdminApartmentsTenantsOccupancyEdit from "./AdminApartmentsTenantsEdit/AdminApartmentsTenantsOccupanyEdit";
import AdminManageAdminAccountUpdate from "./AdminManageAdminAccountUpdate/AdminManageAdminAccountUpdate";
import AdminManagePendingUsers from "./AdminManagePendingUsers/AdminManagePendingUsers";

const AdminPagesRoute = () => {
  return (
    <Routes>
      <Route index element={<AdminHomePage />} />
      <Route path="/home" element={<AdminHomePage />} />
      <Route path="/buildings" element={<AdminBuildings />} />
      <Route path="/buildings-add" element={<AdminBuildingsAddPage />} />
      <Route path="/buildings-edit/:id" element={<AdminBuildingsEditPage />} />
      <Route path="/apartment/:id" element={<AdminApartments />} />
      <Route path="/apartment-edit/:id" element={<AdminApartmentsEditPage />} />
      <Route path="/apartment-add/:id" element={<AdminApartmentsAddPage />} />
      <Route
        path="/apartment-manage-cost/:id"
        element={<AdminApartmentsManageCostPage />}
      />
      <Route
        path="/apartment-tenant-history/:id"
        element={<AdminApartmentsTenantsHistory />}
      />
      <Route
        path="/apartment-tenant-history-details/:id"
        element={<AdminApartmentsTenantsHistoryDetails />}
      />
      <Route
        path="/apartment-tenant/:id"
        element={<AdminApartmentsTenants />}
      />
      <Route
        path="/apartment-tenant/add"
        element={<AdminApartmentsTenantsAdd />}
      />
      <Route
        path="/apartment-tenant/add/:id"
        element={<AdminApartmentsTenantsAdd />}
      />
      <Route
        path="/apartment-tenant/edit/:id"
        element={<AdminApartmentsTenantsEdit />}
      />

      <Route
        path="/apartment-tenant-occupancy/edit/:id"
        element={<AdminApartmentsTenantsOccupancyEdit />}
      />
      <Route
        path="/manageAdmin/details/:id"
        element={<AdminManageAdminDetails />}
      />
      <Route path="/manageAdmin/add" element={<AdminManageAdminAdd />} />
      <Route path="/manageAdmin/edit/:id" element={<AdminManageAdminEdit />} />
      <Route path="/manageAdmin" element={<AdminManageAdmins />} />
      <Route path="/managePassword" element={<AdminManagePassword />} />
      <Route path="/manageProfile" element={<AdminManageProfile />} />

      <Route path="/pending-user" element={<AdminManagePendingUsers />} />
      <Route
        path="/manageAdminBank/update"
        element={<AdminManageAdminAccountUpdate />}
      />

      <Route path="/settings" element={<AdminSettings />} />
      <Route path="/notifications" element={<AdminNotifcation />} />
      <Route path="*" element={<Nopage />} />
    </Routes>
  );
};

export default AdminPagesRoute;
