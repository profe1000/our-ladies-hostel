import instance from "../utils/axios.wrapper";
import { convertObjToQueryParams } from "../utils/basic.utils";

export const sampleApiCall = async (body?: any) => {
  const axios = await instance("", "https://dummyjson.com/", true);
  const { data } = await axios.get("/todos");
  const result: any = await data;
  return result;
};

export const tenantBuildingsApi = async (body: any) => {
  const axios = await instance(null, null, true);
  const { data } = await axios.get(
    `api/v1/tenant/buildings${convertObjToQueryParams(body)}`
  );
  const result: any = await data;
  return result;
};

export const tenantApartmentApi = async (body: any) => {
  const axios = await instance(null, null, true);
  const { data } = await axios.get(
    `api/v1/tenant/apartments${convertObjToQueryParams(body)}`
  );
  const result: any = await data;
  return result;
};

export const tenantBuildingDetailsApi = async (id: string | number) => {
  const axios = await instance(null, null, true);
  const { data } = await axios.get(`api/v1/tenant/buildings/${id}`);
  const result: any = await data;
  return result;
};

export const tenantApartmentDetailsApi = async (id: string | number) => {
  const axios = await instance(null, null, true);
  const { data } = await axios.get(`api/v1/tenant/apartments/${id}`);
  const result: any = await data;
  return result;
};

export const tenantRegistrationApi = async (body: any) => {
  const axios = await instance(null, null, true);
  const { data } = await axios.post("api/v1/tenant/auth/register", body);
  const result = await data;
  return result;
};

export const tenantRentPaymentApi = async (token: string, body: any) => {
  const axios = await instance(token, null, true);
  const { data } = await axios.post(`api/v1/tenant/rent-payments`, body);
  const result: any = await data;
  return result;
};

export const tenantRentPaymentDetailsApi = async (token: string, body: any) => {
  const axios = await instance(token, null, true);
  const { data } = await axios.get(
    `api/v1/tenant/rent-payments/details${convertObjToQueryParams(body)}`
  );
  const result: any = await data;
  return result;
};

export const tenantGetSettingsApi = async (body?: any) => {
  const axios = await instance(null, null, true);
  const { data } = await axios.get(
    `api/v1/tenant/settings${convertObjToQueryParams(body)}`
  );
  const result: any = await data;
  return result;
};
