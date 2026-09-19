import {
  IAdminApartmentData,
  IAdminBuildingsData,
  IAdminDashboardData,
  IAdminOccupantData,
  IAdminSettingsData,
  IAdminTenantsData,
} from "../../apiservice/admin-General-ApiService.type";

export const AdminDashboardReducer = (
  state: Partial<IAdminDashboardData> = {},
  action
) => {
  switch (action.type) {
    case "ADMIN_ADD_DASHBOARD_DATA":
      return { ...state, ...action.payload };
    case "ADMIN_REMOVE_DASHBOARD_DATA":
      return {};
    default:
      return state;
  }
};

export const AdminSelectedBuildingReducer = (
  state: Partial<IAdminBuildingsData> = {},
  action
) => {
  switch (action.type) {
    case "ADMIN_ADD_SELECTED_BUILDING":
      return { ...state, ...action.payload };
    case "ADMIN_REMOVE_SELECTED_BUILDING":
      return {};
    default:
      return state;
  }
};

export const AdminSelectedApartmentReducer = (
  state: Partial<IAdminApartmentData> = {},
  action
) => {
  switch (action.type) {
    case "ADMIN_ADD_SELECTED_APARTMENT":
      return { ...state, ...action.payload };
    case "ADMIN_REMOVE_SELECTED_APARTMENT":
      return {};
    default:
      return state;
  }
};

export const AdminSelectedAdminReducer = (
  state: Partial<IAdminApartmentData> = {},
  action
) => {
  switch (action.type) {
    case "ADMIN_ADD_SELECTED_ADMIN":
      return { ...state, ...action.payload };
    case "ADMIN_REMOVE_SELECTED_ADMIN":
      return {};
    default:
      return state;
  }
};

export const AdminSelectedTenantReducer = (
  state: Partial<IAdminTenantsData> = {},
  action
) => {
  switch (action.type) {
    case "ADMIN_ADD_SELECTED_TENANT":
      return { ...state, ...action.payload };
    case "ADMIN_REMOVE_SELECTED_TENANT":
      return {};
    default:
      return state;
  }
};

export const AdminSelectedOccupantReducer = (
  state: Partial<IAdminOccupantData> = {},
  action
) => {
  switch (action.type) {
    case "ADMIN_ADD_SELECTED_OCCUPANT":
      return { ...state, ...action.payload };
    case "ADMIN_REMOVE_SELECTED_OCCUPANT":
      return {};
    default:
      return state;
  }
};

export const AdminApartmentCostLoadState = (state: boolean = false, action) => {
  switch (action.type) {
    case "ADMIN_CHANGE_APARTMENT_COST_LOAD_STATE":
      return action.payload;
    case "ADMIN_REFRESH_APARTMENT_COST_LOAD_STATE":
      return false;
    default:
      return state;
  }
};

export const AdminSettingsReducers = (
  state: Partial<IAdminSettingsData> = {},
  action
) => {
  switch (action.type) {
    case "ADMIN_ADD_SETTINGS":
      return { ...state, ...action.payload };
    case "ADMIN_REMOVE_SETTINGS":
      return {};
    default:
      return state;
  }
};
