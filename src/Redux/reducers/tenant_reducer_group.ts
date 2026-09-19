import {
  ITenantApartmentData,
  ITenantBuildingsData,
  ITenantPaymentResult,
  ITenantRegistrationData,
  IUserSettingsData,
} from "../../apiservice/tenant-general-apiService.type.";

export const TenantSelectedBuildingReducer = (
  state: Partial<ITenantBuildingsData> = {},
  action
) => {
  switch (action.type) {
    case "TENANT_ADD_SELECTED_BUILDING":
      return { ...state, ...action.payload };
    case "TENANT_REMOVE_SELECTED_BUILDING":
      return {};
    default:
      return state;
  }
};

export const TenantSelectedApartmentReducer = (
  state: Partial<ITenantApartmentData> = {},
  action
) => {
  switch (action.type) {
    case "TENANT_ADD_SELECTED_APARTMENT":
      return { ...state, ...action.payload };
    case "TENANT_REMOVE_SELECTED_APARTMENT":
      return {};
    default:
      return state;
  }
};

export const TenantRegistrationResultReducer = (
  state: Partial<ITenantRegistrationData> = {},
  action
) => {
  switch (action.type) {
    case "TENANT_ADD_REGISTRATION_RESULT_DATA":
      return { ...state, ...action.payload };
    case "ENANT_REMOVE_REGISTRATION_RESULT_DATA":
      return {};
    default:
      return state;
  }
};

export const TenantPaymentResultReducer = (
  state: Partial<ITenantPaymentResult> = {},
  action
) => {
  switch (action.type) {
    case "TENANT_ADD_PAYMENT_RESULT_DATA":
      return { ...state, ...action.payload };
    case "ENANT_REMOVE_PAYMENT_RESULT_DATA":
      return {};
    default:
      return state;
  }
};


export const TenantSettingsReducers = (
  state: Partial<IUserSettingsData> = {},
  action
) => {
  switch (action.type) {
    case "USER_ADD_SETTINGS":
      return { ...state, ...action.payload };
    case "USER_REMOVE_SETTINGS":
      return {};
    default:
      return state;
  }
};
