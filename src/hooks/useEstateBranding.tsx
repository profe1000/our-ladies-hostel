import { useEffect, useState } from "react";
import instance from "../utils/axios.wrapper";
import { getEstateSlug } from "../utils/estate";

export interface IEstateBranding {
  name: string;
  slug: string;
  logoUrl?: string | null;
}

// Kept for the page's lifetime so every top bar does not refetch it
const cache: Record<string, IEstateBranding> = {};

/**
 * Name and logo of the estate being shown: the admin's own estate on admin pages,
 * otherwise the estate opened at /e/:slug
 */
const useEstateBranding = (isAdmin = false) => {
  const key = isAdmin ? "admin" : getEstateSlug();
  const [branding, setBranding] = useState<IEstateBranding | null>(cache[key] || null);

  useEffect(() => {
    if (cache[key]) {
      setBranding(cache[key]);
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const axios = await instance(isAdmin ? null : "", null, true, isAdmin);
        const { data } = await axios.get(isAdmin ? "api/v1/admin/estate" : "api/v1/estates/current");
        if (data?.data) {
          cache[key] = data.data;
          if (!cancelled) setBranding(data.data);
        }
      } catch {
        // Keep showing the fallback
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [key, isAdmin]);

  return branding;
};

export default useEstateBranding;
