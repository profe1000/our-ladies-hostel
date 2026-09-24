import { useState } from "react";
import { IAdminAuthType } from "../../../../apiservice/admin-AuthService.type";
import { useAppSelector } from "../../../../Redux/reduxCustomHook";
import { RootState } from "../../../../Redux/store";
import { AdminDashboard } from "../admin-dashboard/admin-dashboard";
import AdminDashboardAlerts from "../admin-dashboard-alerts/admin-dashboard-alerts";
import "./admin-dashboard-wrapper.css";

// "Good morning" / "Good afternoon" / "Good evening"
const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
};

export const AdminDashBoardWrapper = () => {
  const [payLoadFilter, setpayLoadFilter] = useState<any>({});
  const [externalFilter, setExternalFilter] = useState<any>({});

  const adminAuthData: IAdminAuthType = useAppSelector(
    (state: RootState) => state?.AdminAuthData
  );

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const credentials = adminAuthData.data?.credentials;

  // Apply a filter as soon as it changes
  const handleInputChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    const nextFilter = { ...payLoadFilter, [name]: value };
    setpayLoadFilter(nextFilter);
    setExternalFilter(nextFilter);
  };

  return (
    <>
      <div className="w3-content adminPageBody">
        {/* Welcome Header */}
        <div className="dashHeader">
          <div>
            <span className="dashEyebrow myfont1">
              {currentDate.toLocaleDateString("en-GB", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
            <h2 className="dashTitle myfont5">
              {getGreeting()}
              {credentials?.firstName ? `, ${credentials.firstName}` : ""}
            </h2>
            <p className="adminSectionSub myfont1">
              Here is how your hostel is doing.
            </p>
          </div>

          {/* Filters */}
          <div className="dashFilters">
            <label className="dashFilter">
              <span className="dashFilterLabel myfont1">Building</span>
              <select
                name="buildingId"
                value={payLoadFilter?.buildingId || ""}
                onChange={handleInputChange}
                className="w3-input w3-text-white adminInput myfont1"
              >
                <option value="">All Buildings</option>
                {credentials?.buildings?.map((building, index) => (
                  <option key={index} value={building.id}>
                    {building.title}
                  </option>
                ))}
              </select>
            </label>
            <label className="dashFilter dashFilterYear">
              <span className="dashFilterLabel myfont1">Year</span>
              <select
                name="year"
                value={payLoadFilter?.year || currentYear}
                onChange={handleInputChange}
                className="w3-input w3-text-white adminInput myfont1"
              >
                {[
                  currentYear,
                  ...(credentials?.years || []).filter(
                    (year) => year !== currentYear
                  ),
                ].map((year) => (
                  <option key={year} value={year}>
                    {year + ""}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        {/* Needs attention */}
        <AdminDashboardAlerts></AdminDashboardAlerts>

        {/* Dashboard */}
        <AdminDashboard
          initialDefaultFilter={{ year: currentYear }}
          externalFilter={externalFilter}
        ></AdminDashboard>
      </div>
    </>
  );
};

export default AdminDashBoardWrapper;
