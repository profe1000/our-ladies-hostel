import { SearchOutlined } from "@ant-design/icons";
import { useState } from "react";
import { IAdminAuthType } from "../../../../apiservice/admin-AuthService.type";
import { useAppSelector } from "../../../../Redux/reduxCustomHook";
import { RootState } from "../../../../Redux/store";
import { AdminDashboard } from "../admin-dashboard/admin-dashboard";
import "./admin-dashboard-wrapper.css";

export const AdminDashBoardWrapper = () => {
  const [payLoadFilter, setpayLoadFilter] = useState<any>({});
  const [externalFilter, setExternalFilter] = useState<any>({});

  const adminAuthData: IAdminAuthType = useAppSelector(
    (state: RootState) => state?.AdminAuthData
  );

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();

  // Use to collect Change
  const handleInputChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setpayLoadFilter((values) => ({ ...values, [name]: value }));
  };

  // Use to Update Filter
  const updateFilter = () => {
    setExternalFilter({ ...payLoadFilter });
  };

  return (
    <>
      <div className="w3-container w3-margin-top">
        <div className="w3-content">
          {/* Selector */}
          <div className="w3-col w3-margin-top">
            <div className="w3-col l6 s6 m6" style={{ padding: "2px" }}>
              <select
                name="buildingId"
                value={payLoadFilter?.buildingId || ""}
                onChange={handleInputChange}
                onBlur={updateFilter}
                className="w3-col w3-input w3-text-white w3-border w3-round-large dashboardSelect myfont1 w3-small"
              >
                <>
                  <option value="">All Buildings</option>
                  {adminAuthData.data?.credentials.buildings.map(
                    (building, index) => (
                      <option key={index} value={building.id}>
                        {building.title}
                      </option>
                    )
                  )}
                </>
              </select>
            </div>
            <div className="w3-col l4 s4 m4" style={{ padding: "2px" }}>
              <select
                name="year"
                value={payLoadFilter?.year || ""}
                onChange={handleInputChange}
                onBlur={updateFilter}
                className="w3-col w3-input w3-text-white w3-border w3-round-large dashboardSelect myfont1 w3-small"
              >
                <option value="">Year</option>
                {adminAuthData.data?.credentials.years.map((year, index) => (
                  <option key={index} value={year}>
                    {year + ""}
                  </option>
                ))}
              </select>
            </div>
            <div className="w3-col l2 s2 m2" style={{ padding: "2px" }}>
              <button className="w3-btn w3-center w3-round-large addDashboardbtn w3-center w3-col">
                <SearchOutlined />
              </button>
            </div>
          </div>

          {/* Component */}
          <div className="w3-col l12 s12 m12" style={{ padding: "2px" }}>
            <AdminDashboard
              initialDefaultFilter={{ year: currentYear }}
              externalFilter={externalFilter}
            ></AdminDashboard>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashBoardWrapper;
