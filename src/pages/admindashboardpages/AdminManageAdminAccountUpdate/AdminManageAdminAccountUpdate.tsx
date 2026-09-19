import CreateAdminBankForm from "../../../components/admincomponents/adminSettingsComponent/CreateAdmin-Form/CreateAdmin-Bank-Form";
import CreateAdminForm from "../../../components/admincomponents/adminSettingsComponent/CreateAdmin-Form/CreateAdmin-Form";
import Tabbar from "../../../components/LayoutComponent/TabBar/Tabbar";
import { TopBarAdmin } from "../../../components/LayoutComponent/TopBar-Admin/TopBar-Admin";
import { useAppSelector } from "../../../Redux/reduxCustomHook";
import { RootState } from "../../../Redux/store";

export const AdminManageAdminAccountUpdate = () => {
  const selectedAdmin: any = useAppSelector(
    (state: RootState) => state?.AdminSelectedAdmin
  );
  return (
    <>
      <TopBarAdmin showNotification={true} showProfile={false}></TopBarAdmin>
      {/* <CreateAdminForm
        isEditMode={true}
        adminUserData={selectedAdmin}
      ></CreateAdminForm> */}
      <CreateAdminBankForm></CreateAdminBankForm>
      <Tabbar></Tabbar>
    </>
  );
};

export default AdminManageAdminAccountUpdate;
