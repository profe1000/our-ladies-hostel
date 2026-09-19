import axios from "axios";
import { Device } from "@capacitor/device";
import { ADMIN_TOKEN_KEY, USER_TOKEN_KEY } from "../hooks/useAuth";
import { getString } from "./localStorage";
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

    headers = {
      ...headers,
      uuid: deviceId.identifier,
      "device-name": info.name || info.model,
      "device-info": info.operatingSystem,
      platform: info.platform,
    };
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
