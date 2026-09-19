import { AdminApartmentUnitList } from "../admin-apartment-unit-list/admin-apartment-unit-list";
import "./admin-apartment-unit-list-wrapper.css";

export const AdminApartmentUnitListWrapper = () => {
  return (
    <>
      <div>
        <div className="w3-container">
          <div className="w3-col l12 s12 m12" style={{ padding: "5px" }}>
            <AdminApartmentUnitList
              initialDefaultFilter={{ perPage: 5 }}
            ></AdminApartmentUnitList>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminApartmentUnitListWrapper;
