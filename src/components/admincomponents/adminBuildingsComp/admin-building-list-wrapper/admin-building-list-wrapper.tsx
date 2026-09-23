import { useState } from "react";
import { Link } from "react-router-dom";
import { PlusOutlined } from "@ant-design/icons";
import { AdminBuildingList } from "../admin-building-list/admin-building-list";
import "./admin-building-list-wrapper.css";

export const AdminBuildingListWrapper = () => {
  const [totalBuildings, setTotalBuildings] = useState<number | null>(null);

  return (
    <>
      <div className="w3-col adminBldgPage">
        <div className="w3-content">
          {/* Page Header */}
          <div className="adminBldgHeader">
            <div>
              <span className="adminBldgEyebrow myfont1">Property</span>
              <h2 className="adminBldgHeading myfont5">
                Buildings
                {totalBuildings !== null && (
                  <span className="adminBldgCount myfont1">
                    {totalBuildings}
                  </span>
                )}
              </h2>
              <p className="adminBldgSubheading myfont1">
                Manage your buildings, their units and pricing.
              </p>
            </div>
            <Link
              to={"/admin/buildings-add"}
              className="adminBldgAddBtn myfont3"
            >
              <PlusOutlined /> Add Building
            </Link>
          </div>

          <AdminBuildingList
            initialDefaultFilter={{ perPage: 12 }}
            hidePagination={false}
            onTotalChange={setTotalBuildings}
          ></AdminBuildingList>
        </div>
      </div>
    </>
  );
};

export default AdminBuildingListWrapper;
