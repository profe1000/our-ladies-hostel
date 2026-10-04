import { getString, removeItem, storePlainString } from "./localStorage";

/**
 * Name of the SaaS on the landing, sign up and SaaS admin pages.
 * Set REACT_APP_SAAS_NAME in .env to change it.
 */
export const SAAS_NAME = process.env.REACT_APP_SAAS_NAME || "Estate Manager";

/**
 * Set REACT_APP_ESTATE_SLUG for an app built for one estate (e.g. the Our Ladies mobile app):
 * "/" then opens that estate's page instead of the SaaS landing page.
 */
export const LOCKED_ESTATE_SLUG = process.env.REACT_APP_ESTATE_SLUG || "";

/** The original estate; old /landing links point here */
export const DEFAULT_ESTATE_SLUG = LOCKED_ESTATE_SLUG || "ourladies";

export const ESTATE_SLUG_KEY = "estateSlug";

/** The estate whose public pages the visitor last opened (/e/:slug), sent as the X-Estate header */
export const getEstateSlug = () => getString(ESTATE_SLUG_KEY) || DEFAULT_ESTATE_SLUG;

export const setEstateSlug = (slug: string) => {
  storePlainString(ESTATE_SLUG_KEY, slug.toLowerCase());
};

/** Path inside the current estate's public pages, e.g. estatePath("/pay/abc") => "/e/ourladies/pay/abc" */
export const estatePath = (path = "/") => {
  const base = `/e/${getEstateSlug()}`;
  return path === "/" ? base : `${base}${path.startsWith("/") ? path : `/${path}`}`;
};

// "Login as" sessions: the token only works with the uuid it was issued for, so it replaces the device uuid
export const LOGIN_AS_ADMIN_UUID_KEY = "loginAsAdminUuid";
export const LOGIN_AS_USER_UUID_KEY = "loginAsUserUuid";
export const LOGIN_AS_ADMIN_INFO_KEY = "loginAsAdminInfo";
export const LOGIN_AS_USER_INFO_KEY = "loginAsUserInfo";

export const clearLoginAs = (isAdmin: boolean) => {
  removeItem(isAdmin ? LOGIN_AS_ADMIN_UUID_KEY : LOGIN_AS_USER_UUID_KEY);
  removeItem(isAdmin ? LOGIN_AS_ADMIN_INFO_KEY : LOGIN_AS_USER_INFO_KEY);
};
