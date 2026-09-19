import Tabbar from "../../../components/LayoutComponent/TabBar/Tabbar";
import { TopBarAdmin } from "../../../components/LayoutComponent/TopBar-Admin/TopBar-Admin";
import TopBar from "../../../components/LayoutComponent/TopBar/topBar";
import "./userNotifcation.css";

export const UserNotifcation = () => {
  return (
    <>
      <TopBar
        showBackButton={true}
        showNotification={true}
        showProfile={false}
      ></TopBar>

      <div className="w3-col w3-margin-top w3-center">
        No Notification at the moment
      </div>
    </>
  );
};

export default UserNotifcation;
