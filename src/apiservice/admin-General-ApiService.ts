import instance from "../utils/axios.wrapper";
import { convertObjToQueryParams } from "../utils/basic.utils";

export const adminDashboardApi = async (body?: any) => {
  const axios = await instance(null, null, true, true);
  const { data } = await axios.get(
    `api/v1/admin/dashboard${convertObjToQueryParams(body)}`
  );
  const result: any = await data;
  return result;
};

export const adminGetSettingsApi = async (body?: any) => {
  const axios = await instance(null, null, true, true);
  const { data } = await axios.get(
    `api/v1/admin/settings${convertObjToQueryParams(body)}`
  );
  const result: any = await data;
  return result;
};

export const adminSaveBankAccountApi = async (body?: any) => {
  const axios = await instance(null, null, true, true);
  const { data } = await axios.post(`api/v1/admin/settings/bank-account`, body);
  const result: any = await data;
  return result;
};

export const adminSaveGeneralSettingsApi = async (body?: any) => {
  const axios = await instance(null, null, true, true);
  const { data } = await axios.post(`api/v1/admin/settings/general`, body);
  const result: any = await data;
  return result;
};

export const adminGetNotificationApi = async (body?: any) => {
  const axios = await instance(null, null, true, true);
  const { data } = await axios.get(
    `/api/v1/admin/notifications${convertObjToQueryParams(body)}`
  );
  const result: any = await data;
  return result;
};

// Admin Buildings
export const adminGetBuildingsApi = async (body?: any) => {
  const axios = await instance(null, null, true, true);
  const { data } = await axios.get(
    `api/v1/admin/buildings${convertObjToQueryParams(body)}`
  );
  const result: any = await data;
  return result;
};

export const adminAddBuildingsApi = async (body?: any) => {
  const axios = await instance(null, null, true, true);
  const { data } = await axios.post("api/v1/admin/buildings", body);
  const result: any = await data;
  return result;
};

export const adminEditBuildingsApi = async (
  body?: any,
  id?: string | number
) => {
  const axios = await instance(null, null, true, true);
  const { data } = await axios.patch(`api/v1/admin/buildings/${id}`, body);
  const result: any = await data;
  return result;
};

export const adminEditBuildingsImageApi = async (
  body?: any,
  id?: string | number
) => {
  const axios = await instance(null, null, true, true);
  const { data } = await axios.patch(
    `api/v1/admin/buildings/${id}/image`,
    body
  );
  const result: any = await data;
  return result;
};

export const adminDeleteBuildingsApi = async (id?: string | number) => {
  const axios = await instance(null, null, true, true);
  const { data } = await axios.delete(`api/v1/admin/buildings/${id}`);
  const result: any = await data;
  return result;
};

// Admin Apartmenmt
export const adminGetApartmentsApi = async (body?: any) => {
  const axios = await instance(null, null, true, true);
  const { data } = await axios.get(
    `api/v1/admin/apartments${convertObjToQueryParams(body)}`
  );
  const result: any = await data;
  return result;
};

export const adminEditApartmentApi = async (
  body?: any,
  id?: string | number
) => {
  const axios = await instance(null, null, true, true);
  const { data } = await axios.patch(`api/v1/admin/apartments/${id}`, body);
  const result: any = await data;
  return result;
};

// Admin ApartmentCost
export const adminGetApartmentsCostApi = async (body?: any) => {
  const axios = await instance(null, null, true, true);
  const { data } = await axios.get(
    `api/v1/admin/apartment-costs${convertObjToQueryParams(body)}`
  );
  const result: any = await data;
  return result;
};

export const adminAddApartmentsCostApi = async (body?: any) => {
  const axios = await instance(null, null, true, true);
  const { data } = await axios.post("api/v1/admin/apartment-costs", body);
  const result: any = await data;
  return result;
};

export const adminRemoveApartmentsCostApi = async (id?: string | number) => {
  const axios = await instance(null, null, true, true);
  const { data } = await axios.delete(`api/v1/admin/apartment-costs/${id}`);
  const result: any = await data;
  return result;
};

// Admin Other Admin
export const adminGetAdminApi = async (body?: any) => {
  const axios = await instance(null, null, true, true);
  const { data } = await axios.get(
    `api/v1/admin/admins${convertObjToQueryParams(body)}`
  );
  const result: any = await data;
  return result;
};

export const adminAddAdminApi = async (body?: any) => {
  const axios = await instance(null, null, true, true);
  const { data } = await axios.post("api/v1/admin/admins", body);
  const result: any = await data;
  return result;
};

export const adminEditAdmintApi = async (body?: any, id?: string | number) => {
  const axios = await instance(null, null, true, true);
  const { data } = await axios.patch(`api/v1/admin/admins/${id}`, body);
  const result: any = await data;
  return result;
};

export const adminRemoveAdminApi = async (id?: string | number) => {
  const axios = await instance(null, null, true, true);
  const { data } = await axios.delete(`api/v1/admin/admins/${id}`);
  const result: any = await data;
  return result;
};

export const adminGetAdminRolesApi = async (body?: any) => {
  const axios = await instance(null, null, true, true);
  const { data } = await axios.get(
    `api/v1/admin/admin-roles${convertObjToQueryParams(body)}`
  );
  const result: any = await data;
  return result;
};

// Get Tenants
export const adminGetTenantsApi = async (body?: any) => {
  const axios = await instance(null, null, true, true);
  const { data } = await axios.get(
    `api/v1/admin/tenants${convertObjToQueryParams(body)}`
  );
  const result: any = await data;
  return result;
};

export const adminAddTenantApi = async (body?: any) => {
  const axios = await instance(null, null, true, true);
  const { data } = await axios.post("api/v1/admin/tenants", body);
  const result: any = await data;
  return result;
};

export const adminUpdateTenantApi = async (
  id?: string | number,
  body?: any
) => {
  const axios = await instance(null, null, true, true);
  const { data } = await axios.patch(`api/v1/admin/tenants/${id}`, body);
  const result: any = await data;
  return result;
};

export const adminUpdateTenantPasswordApi = async (
  id?: string | number,
  body?: any
) => {
  const axios = await instance(null, null, true, true);
  const { data } = await axios.post(
    `api/v1/admin/tenants/${id}/reset-password`,
    body
  );
  const result: any = await data;
  return result;
};

// Get Occupants
export const adminGetOccupantApi = async (body?: any) => {
  const axios = await instance(null, null, true, true);
  const { data } = await axios.get(
    `api/v1/admin/occupants${convertObjToQueryParams(body)}`
  );
  const result: any = await data;
  return result;
};

export const adminGetOccupantSingleApi = async (id?: string | number) => {
  const axios = await instance(null, null, true, true);
  const { data } = await axios.get(`api/v1/admin/occupants/${id}`);
  const result: any = await data;
  return result;
};

// Get Occupants History
export const adminGetOccupantHistoryApi = async (body?: any) => {
  const axios = await instance(null, null, true, true);
  const { data } = await axios.get(
    `api/v1/admin/occupants/history${convertObjToQueryParams(body)}`
  );
  const result: any = await data;
  return result;
};

export const adminExtendOccupantApi = async (body?: any) => {
  const axios = await instance(null, null, true, true);
  const { data } = await axios.post(`api/v1/admin/occupants/extend`, body);
  const result: any = await data;
  return result;
};

export const adminUpdateOccupantPeriodApi = async (
  id?: string | number,
  body?: any
) => {
  const axios = await instance(null, null, true, true);
  const { data } = await axios.patch(
    `api/v1/admin/occupants/${id}/period`,
    body
  );
  const result: any = await data;
  return result;
};

export const adminRemoveOccupantApi = async (id?: string | number) => {
  const axios = await instance(null, null, true, true);
  const { data } = await axios.patch(`api/v1/admin/occupants/${id}/remove`);
  const result: any = await data;
  return result;
};

export const adminDeleteOccupantApi = async (id?: string | number) => {
  const axios = await instance(null, null, true, true);
  const { data } = await axios.delete(`api/v1/admin/occupants/${id}`);
  const result: any = await data;
  return result;
};

// Admin Rent Payments
export const adminGetRentPaymentsApi = async (body?: any) => {
  const axios = await instance(null, null, true, true);
  const { data } = await axios.get(
    `api/v1/admin/rent-payments${convertObjToQueryParams(body)}`
  );
  const result: any = await data;
  return result;
};

export const adminGetRentPaymentSingleApi = async (id?: string | number) => {
  const axios = await instance(null, null, true, true);
  const { data } = await axios.get(`api/v1/admin/rent-payments/${id}`);
  const result: any = await data;
  return result;
};

export const adminAcceptRentPaymentApi = async (id?: string | number) => {
  const axios = await instance(null, null, true, true);
  const { data } = await axios.post(`api/v1/admin/rent-payments/${id}/accept`);
  const result: any = await data;
  return result;
};

export const adminRejectRentPaymentApi = async (id?: string | number) => {
  const axios = await instance(null, null, true, true);
  const { data } = await axios.post(`api/v1/admin/rent-payments/${id}/reject`);
  const result: any = await data;
  return result;
};

// Admin Apartment (Tenant) Requests
export const adminGetApartmentRequestsApi = async (body?: any) => {
  const axios = await instance(null, null, true, true);
  const { data } = await axios.get(
    `api/v1/admin/apartment-requests${convertObjToQueryParams(body)}`
  );
  const result: any = await data;
  return result;
};

export const adminGetApartmentRequestSingleApi = async (
  id?: string | number
) => {
  const axios = await instance(null, null, true, true);
  const { data } = await axios.get(`api/v1/admin/apartment-requests/${id}`);
  const result: any = await data;
  return result;
};

export const adminUpdateApartmentRequestStatusApi = async (
  id?: string | number,
  body?: { statusId: string }
) => {
  const axios = await instance(null, null, true, true);
  const { data } = await axios.patch(
    `api/v1/admin/apartment-requests/${id}/status`,
    body
  );
  const result: any = await data;
  return result;
};
