import { ApartmentUnitListUser } from "../apartment-unit-list/apartment-unit-list";
import "./building-list-wrapper.css";

export const BuildingListUserWrapper = () => {
  return (
    <>
      <div>
        <div className="w3-container">
          <div className="w3-col l12 s12 m12" style={{ padding: "5px" }}>
            <ApartmentUnitListUser
              initialDefaultFilter={{ perPage: 5 }}
            ></ApartmentUnitListUser>
          </div>
        </div>
      </div>
    </>
  );
};

export default BuildingListUserWrapper;
