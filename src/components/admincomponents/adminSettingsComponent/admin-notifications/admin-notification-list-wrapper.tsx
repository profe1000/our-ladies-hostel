import { Link } from "react-router-dom";
import "./admin-notification-list.css";
import { AdminNotificationsList } from "./admin-notification-list";

export const AdminNotificationsListWrapper = () => {
  return (
    <>
      <div className="w3-col">
        <div className="w3-col w3-margin-top">
          <div className="w3-col l12 s12 m12" style={{ padding: "5px" }}>
            <div className="w3-col w3-padding">
              <div className="w3-content">
                <h2> Notification </h2>
                {/* <Link
                  to={"/admin/manageAdmin/add"}
                  className="w3-btn w3-center w3-round-large addBuildingbtn"
                >
                  Add Admin
                </Link> */}
              </div>
            </div>

            <div className="w3-col">
              <AdminNotificationsList
                initialDefaultFilter={{
                  sort: "dateCreated",
                  order: "desc",
                  setasread: "true",
                }}
              ></AdminNotificationsList>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminNotificationsListWrapper;
