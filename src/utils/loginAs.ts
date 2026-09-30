import {
  ADMIN_AUTH_DATA_KEY,
  ADMIN_TOKEN_KEY,
  USER_AUTH_DATA_KEY,
  USER_TOKEN_KEY,
} from "../hooks/useAuth";
import {
  LOGIN_AS_ADMIN_INFO_KEY,
  LOGIN_AS_ADMIN_UUID_KEY,
  LOGIN_AS_USER_INFO_KEY,
  LOGIN_AS_USER_UUID_KEY,
  setEstateSlug,
} from "./estate";
import { getJSON, storeJSON, storePlainString } from "./localStorage";

export interface ILoginAsInfo {
  impersonatedBy: string;
  expiresAt: string;
  readOnly: boolean;
  name?: string;
  estate?: { id: number; name: string; slug: string };
}

/**
 * Stores a "login as" session returned by the server and opens it in a new tab.
 * The server response holds token, uuid, expiresAt, readOnly, impersonatedBy, credentials and (from SaaS) estate
 */
export const openLoginAsSession = (isAdmin: boolean, response: any) => {
  const data = response?.data || {};

  storePlainString(isAdmin ? ADMIN_TOKEN_KEY : USER_TOKEN_KEY, data.token);
  // Same shape as a normal sign in response, which the rest of the app reads
  storeJSON(isAdmin ? ADMIN_AUTH_DATA_KEY : USER_AUTH_DATA_KEY, {
    status: 200,
    data: { token: data.token, credentials: data.credentials },
  });
  storePlainString(isAdmin ? LOGIN_AS_ADMIN_UUID_KEY : LOGIN_AS_USER_UUID_KEY, data.uuid);
  storeJSON(isAdmin ? LOGIN_AS_ADMIN_INFO_KEY : LOGIN_AS_USER_INFO_KEY, {
    impersonatedBy: data.impersonatedBy,
    expiresAt: data.expiresAt,
    readOnly: data.readOnly,
    name: data.credentials?.fullName,
    estate: data.estate,
  } as ILoginAsInfo);

  if (!isAdmin && data.estate?.slug) {
    setEstateSlug(data.estate.slug);
  }

  window.open(isAdmin ? "/admin" : "/users", "_blank");
};

export const getLoginAsInfo = (isAdmin: boolean): ILoginAsInfo | null =>
  getJSON(isAdmin ? LOGIN_AS_ADMIN_INFO_KEY : LOGIN_AS_USER_INFO_KEY);
