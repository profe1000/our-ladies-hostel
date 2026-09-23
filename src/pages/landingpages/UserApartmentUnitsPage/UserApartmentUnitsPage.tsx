import { useParams } from "react-router-dom";
import { AppstoreOutlined } from "@ant-design/icons";
import { Skeleton } from "antd";
import TitleBar from "../../../components/LayoutComponent/TitleBar/titleBar";
import TopBar from "../../../components/LayoutComponent/TopBar/topBar";
import { ApartmentUnitListUser } from "../../../components/userscomponents/apartmentsUnitcomp/apartment-unit-list/apartment-unit-list";
import { useSelectedBuilding } from "../../../hooks/useTenantSelection";
import { formatCurrency } from "../../../utils/basic.utils";
import "./UserApartmentUnitsPage.css";

export const UserApartmentUnitsPage = () => {
  const params = useParams();
  const selectedBuilding = useSelectedBuilding(params?.id);

  return (
    <>
      <TopBar showBackButton={true} backButtonHref={"/"}></TopBar>

      {/* Selected Building Details */}
      <div className="w3-content unitsBuildingWrapper">
        {selectedBuilding ? (
          <div className="unitsBuildingCard">
            <img
              className="unitsBuildingImage"
              src={selectedBuilding.imageUrl}
              alt={selectedBuilding.title || "Building"}
            />
            <div className="unitsBuildingContent">
              <h2 className="unitsBuildingTitle myfont5">
                {selectedBuilding.title}
              </h2>
              <p className="unitsBuildingText myfont1">
                {selectedBuilding.description}
              </p>
              <div className="unitsBuildingMeta">
                <span className="unitsBuildingPrice myfont3">
                  {formatCurrency(selectedBuilding.price)}
                </span>
                <span className="unitsBuildingCount myfont1">
                  <AppstoreOutlined /> {selectedBuilding.noOfApartments}{" "}
                  Apartments
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="unitsBuildingCard unitsBuildingLoading">
            <Skeleton.Image active className="unitsBuildingImage" />
            <div className="unitsBuildingContent">
              <Skeleton active paragraph={{ rows: 3 }} />
            </div>
          </div>
        )}
      </div>

      <TitleBar title="Select Your Apartment"></TitleBar>
      <ApartmentUnitListUser></ApartmentUnitListUser>
    </>
  );
};

export default UserApartmentUnitsPage;
