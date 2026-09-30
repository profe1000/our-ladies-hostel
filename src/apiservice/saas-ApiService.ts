import axios from "axios";
import { Device } from "@capacitor/device";
import { getString } from "../utils/localStorage";

// SaaS admin API (api/v1/saas/...). Uses its own token and never sends X-Estate: SaaS admins see every estate

export const SAAS_TOKEN_KEY = "authTokenSaas";
export const SAAS_AUTH_DATA_KEY = "authDataSaas";

const saasInstance = async () => {
  const deviceId = await Device.getId();
  const token = getString(SAAS_TOKEN_KEY);

  return axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      uuid: deviceId.identifier,
    },
  });
};

/** Drops empty values so they are not sent as "undefined" */
const toQuery = (params?: Record<string, any>) => {
  const clean: Record<string, string> = {};
  Object.entries(params || {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      clean[key] = String(value);
    }
  });
  const query = new URLSearchParams(clean).toString();
  return query ? `?${query}` : "";
};

const get = async (url: string, params?: Record<string, any>) => {
  const api = await saasInstance();
  const { data } = await api.get(`${url}${toQuery(params)}`);
  return data;
};

const send = async (method: "post" | "put" | "delete", url: string, body?: any) => {
  const api = await saasInstance();
  const { data } = await api.request({ method, url, data: body });
  return data;
};

export interface ISaasPage<T> {
  data: T[];
  meta: { total: number; page: number; pageSize: number };
}

export interface ISaasPageParams {
  page?: number;
  pageSize?: number;
  search?: string;
}

// Auth
export const saasLogin = (body: { email: string; password: string }) => send("post", "api/v1/saas/auth/login", body);
export const saasLogout = () => send("post", "api/v1/saas/auth/logout");
export const saasMe = () => get("api/v1/saas/auth/me");
export const saasChangePassword = (body: { oldPassword: string; newPassword: string }) =>
  send("post", "api/v1/saas/auth/change-password", body);

// Dashboard
export const getSaasDashboard = () => get("api/v1/saas/dashboard");

// Estates
export const getSaasEstates = (params: ISaasPageParams & { blocked?: boolean; planId?: number }) =>
  get("api/v1/saas/estates", params) as Promise<ISaasPage<any>>;
export const getSaasEstate = (id: number | string) => get(`api/v1/saas/estates/${id}`);
export const blockSaasEstate = (id: number | string, reason?: string) =>
  send("put", `api/v1/saas/estates/${id}/block`, { reason });
export const unblockSaasEstate = (id: number | string) => send("put", `api/v1/saas/estates/${id}/unblock`);
export const changeSaasEstatePlan = (id: number | string, planId: number) =>
  send("put", `api/v1/saas/estates/${id}/plan`, { planId });
export const loginAsEstateAdmin = (id: number | string, body: { adminId?: number; readOnly?: boolean }) =>
  send("post", `api/v1/saas/estates/${id}/login-as`, body);

// Users across estates
export const getSaasEstateAdmins = (params: ISaasPageParams & { estateId?: number }) =>
  get("api/v1/saas/users/admins", params) as Promise<ISaasPage<any>>;
export const getSaasTenants = (params: ISaasPageParams & { estateId?: number }) =>
  get("api/v1/saas/users/tenants", params) as Promise<ISaasPage<any>>;
export const loginAsTenantFromSaas = (id: number | string, body: { readOnly?: boolean }) =>
  send("post", `api/v1/saas/users/tenants/${id}/login-as`, body);

// Plans
export const getSaasPlans = () => get("api/v1/saas/plans");
export const addSaasPlan = (body: any) => send("post", "api/v1/saas/plans", body);
export const updateSaasPlan = (id: number, body: any) => send("put", `api/v1/saas/plans/${id}`, body);
export const deleteSaasPlan = (id: number) => send("delete", `api/v1/saas/plans/${id}`);

// Contact messages
export const getSaasMessages = (params: ISaasPageParams & { handled?: boolean }) =>
  get("api/v1/saas/messages", params) as Promise<ISaasPage<any>>;
export const setSaasMessageHandled = (id: number, handled: boolean) =>
  send("put", `api/v1/saas/messages/${id}/${handled ? "handled" : "unhandled"}`);

// SaaS admins
export const getSaasAdmins = () => get("api/v1/saas/admins");
export const addSaasAdmin = (body: { email: string; password: string; firstName: string; lastName: string }) =>
  send("post", "api/v1/saas/admins", body);
export const setSaasAdminBlocked = (id: number, blocked: boolean) =>
  send("put", `api/v1/saas/admins/${id}/${blocked ? "block" : "unblock"}`);
