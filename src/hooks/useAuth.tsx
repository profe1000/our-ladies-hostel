import { useState, useEffect } from "react";
import { adminAuthSessionLogin } from "../apiservice/admin-AuthService";
import { IAdminAuthType } from "../apiservice/admin-AuthService.type";
import { authRefreshSession } from "../apiservice/authService";
import { IAuthType } from "../apiservice/authService.type";
import { useAppDispatch } from "../Redux/reduxCustomHook";
import {
  getJSON,
  getString,
  storeJSON,
  storePlainString,
} from "../utils/localStorage";
import useFormatApiRequest from "./formatApiRequest";

export const USER_TOKEN_KEY = "authTokenUser";
export const USER_AUTH_DATA_KEY = "authDataUser";
export const ADMIN_TOKEN_KEY = "authTokenAdmin";
export const ADMIN_AUTH_DATA_KEY = "authDataAdmin";

const useAuth = (loadApi?: Boolean, preReqFunc?: () => void) => {
  const [tokenUser, setTokenUser] = useState<any>(null);
  const [authDataUser, setAuthDataUser] = useState<any>(null);
  const [isAutheticatedUser, setIsAutheticatedUser] = useState(true);
  const [loadUserData, setLoadUserData] = useState(false);

  const [tokenAdmin, setTokenAdmin] = useState<any>(null);
  const [authDataAdmin, setAuthDataAdmin] = useState<any>(null);
  const [isAutheticatedAdmin, setIsAutheticatedAdmin] = useState(true);
  const [loadAdminData, setLoadAdminData] = useState(false);

  const dispatch = useAppDispatch();

  // This is use to check local storage the last stored Session Variables and get them and dispatch it.
  const checkAuth = async () => {
    // User Side
    if (
      getString(USER_TOKEN_KEY) !== null ||
      getJSON(USER_AUTH_DATA_KEY) !== null
    ) {
      setIsAutheticatedUser(true);
      setTokenUser(getString(USER_TOKEN_KEY));
      setAuthDataUser(getJSON(USER_AUTH_DATA_KEY));

      dispatch({
        type: "AUTH_ADD_DATA",
        payload: getJSON(USER_AUTH_DATA_KEY),
      });
      setLoadUserData(true);
    } else {
      setIsAutheticatedUser(false);
    }

    // Admin Side
    if (
      getString(ADMIN_TOKEN_KEY) !== null ||
      getJSON(ADMIN_AUTH_DATA_KEY) !== null
    ) {
      setIsAutheticatedAdmin(true);

      setTokenAdmin(getString(ADMIN_TOKEN_KEY));
      setAuthDataAdmin(getJSON(ADMIN_AUTH_DATA_KEY));
      dispatch({
        type: "ADMIN_AUTH_ADD_DATA",
        payload: getJSON(ADMIN_AUTH_DATA_KEY),
      });
      setLoadAdminData(true);
    } else {
      setIsAutheticatedAdmin(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, [isAutheticatedUser, isAutheticatedAdmin]);

  useEffect(() => {
    if (loadApi) {
      if (preReqFunc) {
        preReqFunc();
      }
      checkAuth();
    }
  }, [loadApi]);

  // A custom hook to Refresh User Data Information
  const userDataRefreshResult = useFormatApiRequest(
    () => authRefreshSession(),
    loadUserData,
    () => {
      setLoadUserData(false);
    },
    () => {
      processUserDataResult();
    }
  );

  // Process The User Data refresh Api
  const processUserDataResult = async () => {
    if (userDataRefreshResult.httpState === "SUCCESS") {
      const userRefreshResult: IAuthType = userDataRefreshResult.data;
      storePlainString(USER_TOKEN_KEY, userRefreshResult?.data?.token || "");
      storeJSON(USER_AUTH_DATA_KEY, userRefreshResult);
      dispatch({ type: "AUTH_ADD_DATA", payload: userRefreshResult });
    } else if (userDataRefreshResult.httpState === "ERROR") {
      console.log("Session Login Error");
    }
  };

  // A custom hook to Refresh Admin Data Information
  const adminDataRefreshResult = useFormatApiRequest(
    () => adminAuthSessionLogin(),
    loadAdminData,
    () => {
      setLoadAdminData(false);
    },
    () => {
      processAdminDataResult();
    }
  );

  // Process The Admin Data refresh Api
  const processAdminDataResult = async () => {
    if (adminDataRefreshResult.httpState === "SUCCESS") {
      const adminSessionResult: IAdminAuthType = adminDataRefreshResult.data;
      storePlainString(ADMIN_TOKEN_KEY, adminSessionResult?.data?.token || "");
      storeJSON(ADMIN_AUTH_DATA_KEY, adminSessionResult);
      dispatch({ type: "ADMIN_AUTH_ADD_DATA", payload: adminSessionResult });
    } else if (adminDataRefreshResult.httpState === "ERROR") {
      console.log("Session Login Error for Admin");
    }
  };

  return {
    isAutheticatedUser,
    authDataUser,
    tokenUser,
    isAutheticatedAdmin,
    authDataAdmin,
    tokenAdmin,
  };
};

export default useAuth;
