import instance from "../utils/axios.wrapper";
import { convertObjToQueryParams } from "../utils/basic.utils";

// Public SaaS pages: pricing, estate sign up and contact us

export interface IPlan {
  id: number;
  title: string;
  description?: string;
  monthlyPrice?: number | null;
  maxBuildings?: number | null;
  maxApartments?: number | null;
  isDefault?: boolean;
}

export const getPublicPlans = async (): Promise<IPlan[]> => {
  const axios = await instance("", null, false, true);
  const { data } = await axios.get("api/v1/plans");
  return data?.data || [];
};

export const checkEstateSlug = async (
  slug: string
): Promise<{ slug: string; available: boolean; message?: string }> => {
  const axios = await instance("", null, false, true);
  const { data } = await axios.get(
    `api/v1/estates/slug-available${convertObjToQueryParams({ slug })}`
  );
  return data?.data;
};

export interface IRegisterEstateBody {
  name: string;
  slug?: string;
  email: string;
  phoneNumber?: string;
  firstName: string;
  lastName: string;
  adminEmail: string;
  password: string;
}

export const registerEstate = async (body: IRegisterEstateBody) => {
  const axios = await instance("", null, false, true);
  const { data } = await axios.post("api/v1/estates/register", body);
  return data;
};

export interface IContactBody {
  name: string;
  email: string;
  phoneNumber?: string;
  estateName?: string;
  message: string;
  /** Honeypot, must stay empty */
  website?: string;
}

export const sendContactMessage = async (body: IContactBody) => {
  const axios = await instance("", null, false, true);
  const { data } = await axios.post("api/v1/contact", body);
  return data;
};

/** Pulls the server's message out of an axios error */
export const getApiErrorMessage = (error: any, fallback = "Something went wrong, please try again") => {
  const data = error?.response?.data;
  // Validation errors come as a list of messages
  const firstFieldError = Array.isArray(data?.errors) ? data.errors[0] : null;
  return firstFieldError || data?.message || fallback;
};
