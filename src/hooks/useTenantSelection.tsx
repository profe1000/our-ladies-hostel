import { useEffect } from "react";
import {
  tenantApartmentDetailsApi,
  tenantBuildingDetailsApi,
} from "../apiservice/tenant-general-apiService";
import {
  ITenantApartmentData,
  ITenantBuildingsData,
} from "../apiservice/tenant-general-apiService.type.";
import { useAppDispatch, useAppSelector } from "../Redux/reduxCustomHook";
import { RootState } from "../Redux/store";

const isSameId = (a?: string | number, b?: string | number) =>
  a !== undefined && b !== undefined && String(a) === String(b);

// Returns the selected building, reloading it from the API when the
// store does not have it (e.g when the page is refreshed or opened directly)
export const useSelectedBuilding = (buildingId?: string | number) => {
  const dispatch = useAppDispatch();
  const selectedBuilding: Partial<ITenantBuildingsData> = useAppSelector(
    (state: RootState) => state?.TenantSelectedBuilding
  );
  const isLoaded = isSameId(selectedBuilding?.id, buildingId);

  useEffect(() => {
    if (isLoaded || buildingId === undefined) return;

    const fetchBuilding = async () => {
      try {
        const response = await tenantBuildingDetailsApi(buildingId);
        if (response?.data) {
          dispatch({
            type: "TENANT_ADD_SELECTED_BUILDING",
            payload: response.data,
          });
        }
      } catch (error) {
        console.error("Error fetching building:", error);
      }
    };
    fetchBuilding();
  }, [buildingId, isLoaded]);

  return isLoaded ? selectedBuilding : undefined;
};

// Returns the selected apartment, reloading it from the API when the
// store does not have it (e.g when the page is refreshed or opened directly)
export const useSelectedApartment = (apartmentId?: string | number) => {
  const dispatch = useAppDispatch();
  const selectedApartment: Partial<ITenantApartmentData> = useAppSelector(
    (state: RootState) => state?.TenantSelectedApartment
  );
  const isLoaded = isSameId(selectedApartment?.id, apartmentId);

  useEffect(() => {
    if (isLoaded || apartmentId === undefined) return;

    const fetchApartment = async () => {
      try {
        const response = await tenantApartmentDetailsApi(apartmentId);
        if (response?.data) {
          dispatch({
            type: "TENANT_ADD_SELECTED_APARTMENT",
            payload: response.data,
          });
        }
      } catch (error) {
        console.error("Error fetching apartment:", error);
      }
    };
    fetchApartment();
  }, [apartmentId, isLoaded]);

  return isLoaded ? selectedApartment : undefined;
};
