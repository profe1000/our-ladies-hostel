import { Link } from "react-router-dom";
import { AdminList } from "../admin-list/admin-list";
import "./admin-list-wrapper.css";

export const AdminListWrapper = () => {
  return (
    <>
      <div className="w3-col">
        <div className="w3-col w3-margin-top">
          <div className="w3-col l12 s12 m12" style={{ padding: "5px" }}>
            <div className="w3-col w3-padding w3-right-align">
              <div className="w3-content">
                <Link
                  to={"/admin/manageAdmin/add"}
                  className="w3-btn w3-center w3-round-large addBuildingbtn"
                >
                  Add Admin
                </Link>
              </div>
            </div>

            <div className="w3-col">
              <AdminList initialDefaultFilter={{ perPage: 5 }}></AdminList>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminListWrapper;
