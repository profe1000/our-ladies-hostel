import TitleBar from "../../../components/LayoutComponent/TitleBar/titleBar";
import TopBar from "../../../components/LayoutComponent/TopBar/topBar";
import { ApartmentUnitListUser } from "../../../components/userscomponents/apartmentsUnitcomp/apartment-unit-list/apartment-unit-list";
import "./UserApartmentUnitsPage.css";

export const UserApartmentUnitsPage = () => {
  return (
    <>
      <TopBar showBackButton={true} backButtonHref={"/"}></TopBar>
      <TitleBar title="Select Your Apartment"></TitleBar>
      <ApartmentUnitListUser></ApartmentUnitListUser>
    </>
  );
};

export default UserApartmentUnitsPage;
