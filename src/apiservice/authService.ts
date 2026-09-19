import instance from "../utils/axios.wrapper";
import { convertObjToQueryParams } from "../utils/basic.utils";
import { IAuthType } from "./authService.type";

export const sampleApiCall = async (body?: any) => {
  const axios = await instance("", "https://dummyjson.com/", true);
  const { data } = await axios.get("/todos");
  const result: IAuthType = await data;
  return result;
};

export const authSignUp = async (body: any) => {
  const axios = await instance(null, null, true);
  const { data } = await axios.post("api/v1/tenant/auth/register", body);
  const result: IAuthType = await data;
  return result;
};

export const authSignIn = async (body: any) => {
  const axios = await instance(null, null, true);
  const { data } = await axios.post("api/v1/tenant/auth/login", body);
  const result = await data;
  return result;
};

export const authRefreshSession = async () => {
  const axios = await instance(null, null, true);
  const { data } = await axios.get("api/v1/tenant/auth/sessions-login");
  const result = await data;
  return result;
};

export const authChangePassword = async (body: any) => {
  const axios = await instance(null, null, true);
  const { data } = await axios.post("api/v1/tenant/auth/reset-password", body);
  const result = await data;
  return result;
};

export const authSendverifyEmail = async (body?: any) => {
  const axios = await instance(null, null, true);
  const { data } = await axios.post(
    "api/v1/auth/verify-email/send-email",
    body
  );
  const result = await data;
  return result;
};

export const authConfirmToken = async (body: any) => {
  const axios = await instance(null, null, true);
  const { data } = await axios.post(
    "api/v1/auth/verify-email/confirm-token",
    body
  );
  const result = await data;
  return result;
};

export const authUpdateDetails = async (body: any) => {
  const axios = await instance(null, null, true);
  const { data } = await axios.patch("api/v1/auth/update-details", body);
  const result = await data;
  return result;
};

export const authUpdateDP = async (body: any) => {
  const axios = await instance(null, null, true);
  const { data } = await axios.patch("api/v1/auth/update-dp", body);
  const result = await data;
  return result;
};

export const authUpdatePassword = async (body: any) => {
  const axios = await instance(null, null, true);
  const { data } = await axios.post("api/v1/auth/verify-email", body);
  const result = await data;
  return result;
};

export const authActivateAdvertiser = async (body: any) => {
  const axios = await instance(null, null, true);
  const { data } = await axios.post("api/v1/auth/activate-advertiser", body);
  const result = await data;
  return result;
};

export const authActivatePublisher = async (body: any) => {
  const axios = await instance(null, null, true);
  const { data } = await axios.post("api/v1/auth/activate-publisher", body);
  const result = await data;
  return result;
};

export const authUpdateActiveType = async (body: any) => {
  const axios = await instance(null, null, true);
  const { data } = await axios.patch("api/v1/auth/update-active-type", body);
  const result = await data;
  return result;
};

export const authResetPassword = async (body: any) => {
  const axios = await instance(null, null, true);
  const { data } = await axios.post(
    "api/v1/auth/forgot-password/send-email",
    body
  );
  const result = await data;
  return result;
};

export const authSetNewPassword = async (body: any) => {
  const axios = await instance(null, null, true);
  const { data } = await axios.post(
    "api/v1/auth/forgot-password/confirm-token",
    body
  );
  const result = await data;
  return result;
};

// User Notifications

export const getUserNotifications = async (body?: any) => {
  const axios = await instance(null, null, true);
  const { data } = await axios.get(
    `api/v1/notifications${convertObjToQueryParams(body)}`
  );
  const result: any = await data;
  return result;
};

export const getUserNotification = async (id: string | number) => {
  const axios = await instance(null, null, true);
  const { data } = await axios.get(`api/v1/notifications/${id}`);
  const result: any = await data;
  return result;
};

// User Activity
export const getUserRecentActivities = async (body?: any) => {
  const axios = await instance(null, null, true);
  const { data } = await axios.get(
    `api/v1/recent-activities${convertObjToQueryParams(body)}`
  );
  const result: any = await data;
  return result;
};

//Get Referrals
export const getReferrals = async (body?: any) => {
  const axios = await instance(null, null, true);
  const { data } = await axios.get(
    `api/v1/referrals${convertObjToQueryParams(body)}`
  );
  const result: any = await data;
  return result;
};

export const getReferral = async (id: string | number) => {
  const axios = await instance(null, null, true);
  const { data } = await axios.get(`api/v1/referrals/${id}`);
  const result: any = await data;
  return result;
};
