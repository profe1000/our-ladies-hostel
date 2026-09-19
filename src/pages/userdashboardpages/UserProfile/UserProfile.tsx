import TitleBar from "../../../components/LayoutComponent/TitleBar/titleBar";
import TopBar from "../../../components/LayoutComponent/TopBar/topBar";
import TenantProfileComp from "../../../components/userscomponents/apartmentsFormsComp/tenant-profile-comp/tenant-profile-comp";
import "./UserProfile.css";

export const UserProfile = () => {
  return (
    <>
      <TopBar showNotification={true} showProfile={false}></TopBar>
      <TitleBar title="Profile"></TitleBar>
      <TenantProfileComp></TenantProfileComp>
    </>
  );
};

export default UserProfile;
