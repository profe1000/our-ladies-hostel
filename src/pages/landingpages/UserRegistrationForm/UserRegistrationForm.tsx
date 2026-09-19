import { ITenantBuildingsData } from "../../../apiservice/tenant-general-apiService.type.";
import TitleBar from "../../../components/LayoutComponent/TitleBar/titleBar";
import TopBar from "../../../components/LayoutComponent/TopBar/topBar";
import TenantRegistrationForm from "../../../components/userscomponents/apartmentsFormsComp/registratiionForms/tenantRegistrationForm";
import { useAppSelector } from "../../../Redux/reduxCustomHook";
import { RootState } from "../../../Redux/store";
import "./UserRegistrationForm.css";

export const UserRegistrationForm = () => {
  // For Navigator/Redux
  const selectedBuilding: ITenantBuildingsData = useAppSelector(
    (state: RootState) => state?.TenantSelectedBuilding
  );
  return (
    <>
      <TopBar
        showBackButton={true}
        backButtonHref={`/landing/user-apartment-Unit/${selectedBuilding.id}`}
      ></TopBar>
      <div className="w3-col" style={{ marginTop: "15px" }}>
        <TitleBar title="Registration"></TitleBar>
      </div>
      <TenantRegistrationForm></TenantRegistrationForm>
    </>
  );
};

export default UserRegistrationForm;
