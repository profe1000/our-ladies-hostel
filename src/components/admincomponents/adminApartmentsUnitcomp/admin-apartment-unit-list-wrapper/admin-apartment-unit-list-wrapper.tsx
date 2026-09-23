import { useState } from "react";
import { useParams } from "react-router-dom";
import { AdminApartmentUnitList } from "../admin-apartment-unit-list/admin-apartment-unit-list";
import AdminContextHeader from "../../adminContextHeader/adminContextHeader";
import "./admin-apartment-unit-list-wrapper.css";

export const AdminApartmentUnitListWrapper = () => {
  const params = useParams();
  const [totalUnits, setTotalUnits] = useState<number | null>(null);

  return (
    <>
      <AdminContextHeader buildingId={params?.id}></AdminContextHeader>

      <div className="w3-content adminPageBody">
        <div className="adminSectionHeader">
          <div>
            <h2 className="adminSectionTitle myfont5">
              Apartment Units
              {totalUnits !== null && (
                <span className="adminCountBadge">{totalUnits}</span>
              )}
            </h2>
            <p className="adminSectionSub myfont1">
              Manage occupants, costs and details for each unit.
            </p>
          </div>
        </div>

        <AdminApartmentUnitList
          initialDefaultFilter={{ perPage: 24 }}
          hidePagination={false}
          onTotalChange={setTotalUnits}
        ></AdminApartmentUnitList>
      </div>
    </>
  );
};

export default AdminApartmentUnitListWrapper;
