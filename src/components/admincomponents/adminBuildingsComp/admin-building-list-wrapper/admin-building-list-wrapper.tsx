import { Link } from "react-router-dom";
import { AdminBuildingList } from "../admin-building-list/admin-building-list";
import "./admin-building-list-wrapper.css";

export const AdminBuildingListWrapper = () => {
  return (
    <>
      <div className="w3-col">
        <div className="w3-col w3-margin-top">
          <div className="w3-col l12 s12 m12" style={{ padding: "5px" }}>
            <div className="w3-col w3-padding w3-right-align">
              <div className="w3-content">
                <Link
                  to={"/admin/buildings-add"}
                  className="w3-btn w3-center w3-round-large addBuildingbtn"
                >
                  Add
                </Link>
              </div>
            </div>

            <div className="w3-col">
              <AdminBuildingList
                initialDefaultFilter={{ perPage: 5 }}
              ></AdminBuildingList>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminBuildingListWrapper;
