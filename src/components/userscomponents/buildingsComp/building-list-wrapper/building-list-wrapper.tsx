import { BuildingListUser } from "../building-list/building-list";
import "./activities-list-wrapper.css";

export const BuildingListUserWrapper = () => {
  return (
    <>
      <div>
        <div className="w3-container">
          <div className="w3-col l12 s12 m12" style={{ padding: "5px" }}>
            <BuildingListUser
              initialDefaultFilter={{ perPage: 5 }}
            ></BuildingListUser>
          </div>
        </div>
      </div>
    </>
  );
};

export default BuildingListUserWrapper;
