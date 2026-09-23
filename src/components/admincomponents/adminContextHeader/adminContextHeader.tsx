import { useEffect, useState } from "react";
import {
  AppstoreOutlined,
  HomeOutlined,
  RightOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import {
  tenantApartmentDetailsApi,
  tenantBuildingDetailsApi,
} from "../../../apiservice/tenant-general-apiService";
import {
  IAdminApartmentData,
  IAdminBuildingsData,
} from "../../../apiservice/admin-General-ApiService.type";
import { useAppSelector } from "../../../Redux/reduxCustomHook";
import { RootState } from "../../../Redux/store";
import { formatCurrency } from "../../../utils/basic.utils";
import "./adminContextHeader.css";

type IAdminContextHeader = {
  // Page title shown under the breadcrumb e.g "Occupant"
  pageTitle?: string;
  // Id of the building when the page is about a building
  buildingId?: string | number;
  // Id of the apartment when the page is about an apartment
  apartmentId?: string | number;
  // Show the selected apartment (defaults to true when apartmentId is set)
  showApartment?: boolean;
};

const isSameId = (a?: string | number, b?: string | number) =>
  a !== undefined && b !== undefined && String(a) === String(b);

/*
  Shows the admin's current selection (building, and apartment when relevant)
  at the top of a page. Uses the Redux selection when it is there, and falls
  back to the public building/apartment endpoints after a page refresh.
  The fallback data is kept locally so it never overwrites the admin store.
*/
export const AdminContextHeader: React.FC<IAdminContextHeader> = ({
  pageTitle,
  buildingId,
  apartmentId,
  showApartment,
}) => {
  const storeBuilding: Partial<IAdminBuildingsData> = useAppSelector(
    (state: RootState) => state?.AdminSelectedBuilding
  );
  const storeApartment: Partial<IAdminApartmentData> = useAppSelector(
    (state: RootState) => state?.AdminSelectedApartment
  );

  const [fetchedApartment, setFetchedApartment] =
    useState<Partial<IAdminApartmentData>>();
  const [fetchedBuilding, setFetchedBuilding] =
    useState<Partial<IAdminBuildingsData>>();

  const withApartment = showApartment ?? apartmentId !== undefined;

  // Resolve the apartment
  const apartment: Partial<IAdminApartmentData> | undefined = !withApartment
    ? undefined
    : apartmentId === undefined
    ? storeApartment?.id
      ? storeApartment
      : undefined
    : isSameId(storeApartment?.id, apartmentId)
    ? storeApartment
    : isSameId(fetchedApartment?.id, apartmentId)
    ? fetchedApartment
    : undefined;

  // Resolve the building
  const wantedBuildingId = buildingId ?? apartment?.buildingId;
  const building: Partial<IAdminBuildingsData> | undefined =
    wantedBuildingId === undefined
      ? storeBuilding?.id
        ? storeBuilding
        : undefined
      : isSameId(storeBuilding?.id, wantedBuildingId)
      ? storeBuilding
      : isSameId(fetchedBuilding?.id, wantedBuildingId)
      ? fetchedBuilding
      : undefined;

  // Reload the apartment after a page refresh
  useEffect(() => {
    if (!withApartment || apartmentId === undefined || apartment) return;
    tenantApartmentDetailsApi(apartmentId)
      .then((response) => setFetchedApartment(response?.data))
      .catch((error) => console.error("Error fetching apartment:", error));
  }, [apartmentId, withApartment, !!apartment]);

  // Reload the building after a page refresh
  useEffect(() => {
    if (wantedBuildingId === undefined || building) return;
    tenantBuildingDetailsApi(wantedBuildingId)
      .then((response) => setFetchedBuilding(response?.data))
      .catch((error) => console.error("Error fetching building:", error));
  }, [wantedBuildingId, !!building]);

  const occupantName = apartment?.currentOccupant?.tenant?.fullName;
  const rentDue = apartment?.currentOccupant?.expired;

  return (
    <div className="w3-content adminCtxWrapper">
      {/* Breadcrumb */}
      <nav className="adminCtxCrumbs myfont1" aria-label="Breadcrumb">
        <Link to="/admin/buildings">Buildings</Link>
        {building?.id && (
          <>
            <RightOutlined className="adminCtxCrumbSep" />
            <Link to={`/admin/apartment/${building.id}`}>{building.title}</Link>
          </>
        )}
        {withApartment && apartment?.title && (
          <>
            <RightOutlined className="adminCtxCrumbSep" />
            <span>{apartment.title}</span>
          </>
        )}
        {pageTitle && (
          <>
            <RightOutlined className="adminCtxCrumbSep" />
            <span className="adminCtxCrumbCurrent">{pageTitle}</span>
          </>
        )}
      </nav>

      <div className="adminCtxCard">
        {building?.imageUrl ? (
          <img
            className="adminCtxImage"
            src={building.imageUrl}
            alt={building.title || "Building"}
          />
        ) : (
          <div className="adminCtxImage adminCtxImagePlaceholder">
            <HomeOutlined />
          </div>
        )}

        <div className="adminCtxBody">
          {/* Building */}
          <div className="adminCtxBuilding">
            <span className="adminCtxEyebrow myfont1">Building</span>
            <h2 className="adminCtxTitle myfont5">
              {building?.title || "Loading building..."}
            </h2>
            {building?.description && (
              <p className="adminCtxText myfont1">{building.description}</p>
            )}
            <div className="adminCtxChips myfont1">
              {building?.price !== undefined && (
                <span className="adminCtxChip">
                  {formatCurrency(building.price)}
                </span>
              )}
              {building?.noOfApartments !== undefined && (
                <span className="adminCtxChip">
                  <AppstoreOutlined /> {building.noOfApartments} Units
                </span>
              )}
              {!!building?.serviceCharge && (
                <span className="adminCtxChip">
                  {formatCurrency(building.serviceCharge)} service
                </span>
              )}
            </div>
          </div>

          {/* Apartment */}
          {withApartment && (
            <div className="adminCtxApartment">
              <span className="adminCtxEyebrow myfont1">Apartment</span>
              <div className="adminCtxApartmentRow">
                <h3 className="adminCtxApartmentTitle myfont3">
                  {apartment?.title || "Loading apartment..."}
                </h3>
                {apartment && (
                  <span
                    className={`adminStatusPill myfont1 ${
                      apartment.isOccupied
                        ? "adminStatusOccupied"
                        : "adminStatusVacant"
                    }`}
                  >
                    {apartment.isOccupied ? "Occupied" : "Vacant"}
                  </span>
                )}
                {rentDue && (
                  <span className="adminStatusPill adminStatusDue myfont1">
                    Rent due
                  </span>
                )}
              </div>
              <div className="adminCtxChips myfont1">
                {apartment?.price !== undefined && (
                  <span className="adminCtxChip">
                    Rent {formatCurrency(apartment.price)}
                  </span>
                )}
                {occupantName && (
                  <span className="adminCtxChip">
                    <UserOutlined /> {occupantName}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminContextHeader;
