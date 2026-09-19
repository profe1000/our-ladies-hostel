import { ITenantApartmentData } from "../../../apiservice/tenant-general-apiService.type.";
import TitleBar from "../../../components/LayoutComponent/TitleBar/titleBar";
import TopBar from "../../../components/LayoutComponent/TopBar/topBar";
import TenantPaymentForm from "../../../components/userscomponents/apartmentsFormsComp/paymentForms/tenantPaymentForm";
import { useAppSelector } from "../../../Redux/reduxCustomHook";
import { RootState } from "../../../Redux/store";
import "./UserPaymentForm.css";

export const UserPaymentForm = () => {
  const selectedApartment: ITenantApartmentData = useAppSelector(
    (state: RootState) => state?.TenantSelectedApartment
  );
  return (
    <>
      <TopBar
        showBackButton={true}
        backButtonHref={`/landing/user-tenant-registration/${selectedApartment.id}`}
      ></TopBar>
      <div className="w3-col" style={{ marginTop: "15px" }}>
        <TitleBar title="Make Your Payment"></TitleBar>
      </div>
      <TenantPaymentForm></TenantPaymentForm>
    </>
  );
};

export default UserPaymentForm;
