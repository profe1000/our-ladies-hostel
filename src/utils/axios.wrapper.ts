import axios from "axios";
import { Device } from "@capacitor/device";
import { ADMIN_TOKEN_KEY, USER_TOKEN_KEY } from "../hooks/useAuth";
import { getString } from "./localStorage";
import {
  getEstateSlug,
  LOGIN_AS_ADMIN_UUID_KEY,
  LOGIN_AS_USER_UUID_KEY,
} from "./estate";
// import * as rax from "retry-axios";

interface IAxiosHeaders {
  Authorization: string;
}

const instance = async (
  passedToken?: string | null,
  passedBasedUrl?: string | null,
  useDefaultHeader?: boolean | null,
  isAdmin?: boolean
) => {
  const BASE_URL = passedBasedUrl || process.env.REACT_APP_API_URL;
  const token = getString(isAdmin ? ADMIN_TOKEN_KEY : USER_TOKEN_KEY);
  const accessToken = passedToken || token;

  let headers: IAxiosHeaders | any = {
    Authorization: `Bearer ${accessToken}`,
  };

  if (passedToken === "") {
    headers = {};
  }

  if (useDefaultHeader) {
    const info = await Device.getInfo();
    const deviceId = await Device.getId();

    // A "login as" session only works with the uuid it was issued for
    const loginAsUuid = getString(
      isAdmin ? LOGIN_AS_ADMIN_UUID_KEY : LOGIN_AS_USER_UUID_KEY
    );

    headers = {
      ...headers,
      uuid: loginAsUuid || deviceId.identifier,
      "device-name": info.name || info.model,
      "device-info": info.operatingSystem,
      platform: info.platform,
    };
  }

  // Tenant pages belong to the estate opened at /e/:slug. Admins are matched to their estate by the server
  if (!isAdmin) {
    headers = { ...headers, "X-Estate": getEstateSlug() };
  }

  const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers,
  });

  // axiosInstance.defaults.raxConfig = {
  //   instance: axiosInstance,
  //   retry: 3,
  //   noResponseRetries: 3,
  //   onRetryAttempt: (err: any) => {
  //     const cfg = rax.getConfig(err) as { currentRetryAttempt: number };
  //     console.log(`Retry attempt #${cfg.currentRetryAttempt}`);
  //   },
  // };

  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      throw error;
    }
  );

  // rax.attach(axiosInstance);

  return axiosInstance;
};

export default instance;
