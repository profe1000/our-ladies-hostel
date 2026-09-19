import AdminNotificationsListWrapper from "../../../components/admincomponents/adminSettingsComponent/admin-notifications/admin-notification-list-wrapper";
import Tabbar from "../../../components/LayoutComponent/TabBar/Tabbar";
import { TopBarAdmin } from "../../../components/LayoutComponent/TopBar-Admin/TopBar-Admin";
import "./AdminNotifcation.css";

export const AdminNotifcation = () => {
  return (
    <>
      <TopBarAdmin showNotification={true} showProfile={false}></TopBarAdmin>

      {/* <div className="w3-col w3-margin-top w3-center">
        No Notification at the moment
      </div> */}

      <AdminNotificationsListWrapper></AdminNotificationsListWrapper>

      <Tabbar></Tabbar>
    </>
  );
};

export default AdminNotifcation;
