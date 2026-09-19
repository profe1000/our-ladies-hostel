import Tabbar from "../../../components/LayoutComponent/TabBar/Tabbar";
import { TopBarAdmin } from "../../../components/LayoutComponent/TopBar-Admin/TopBar-Admin";
import TopBar from "../../../components/LayoutComponent/TopBar/topBar";
import TenantDetailsMeEditPassword from "../../../components/userscomponents/apartmentsFormsComp/tenant-Details-Me-Edit-Password/tenant-Details-Me-Edit-Password";
import "./userChangePassword.css";

export const UserChangePassword = () => {
  return (
    <>
      <TopBar
        showBackButton={true}
        showNotification={true}
        showProfile={false}
      ></TopBar>

      <TenantDetailsMeEditPassword></TenantDetailsMeEditPassword>
    </>
  );
};

export default UserChangePassword;
