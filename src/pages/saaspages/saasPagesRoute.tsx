import { Navigate, Route, Routes, useLocation, useParams } from "react-router-dom";
import { ReactNode, useEffect } from "react";
import SaasAdminLayout from "./admin/SaasAdminLayout";
import SaasDashboard from "./admin/SaasDashboard";
import SaasEstates from "./admin/SaasEstates";
import SaasEstateDetail from "./admin/SaasEstateDetail";
import SaasUsers from "./admin/SaasUsers";
import SaasPlans from "./admin/SaasPlans";
import SaasMessages from "./admin/SaasMessages";
import SaasAdmins from "./admin/SaasAdmins";
import Nopage from "../Nopage/Nopage";
import { DEFAULT_ESTATE_SLUG, setEstateSlug } from "../../utils/estate";

/** SaaS admin pages under /saas (the login page is a separate route) */
export const SaasAdminRoutes = () => (
  <Routes>
    <Route element={<SaasAdminLayout />}>
      <Route index element={<SaasDashboard />} />
      <Route path="estates" element={<SaasEstates />} />
      <Route path="estates/:id" element={<SaasEstateDetail />} />
      <Route path="users" element={<SaasUsers />} />
      <Route path="plans" element={<SaasPlans />} />
      <Route path="messages" element={<SaasMessages />} />
      <Route path="admins" element={<SaasAdmins />} />
      <Route path="*" element={<Nopage />} />
    </Route>
  </Routes>
);

/**
 * Wraps an estate's public pages (/e/:slug/...): remembers the estate so API calls send it as X-Estate
 */
export const EstateScope = ({ children }: { children: ReactNode }) => {
  const { slug } = useParams();
  // Stored before the first render so the pages' first API calls already use this estate
  if (slug) setEstateSlug(slug);

  useEffect(() => {
    if (slug) setEstateSlug(slug);
  }, [slug]);

  return <>{children}</>;
};

/** Old links (/landing/...) were all for Our Ladies, the only estate at the time */
export const LegacyLandingRedirect = () => {
  const location = useLocation();
  const rest = location.pathname.replace(/^\/landing/, "");
  return <Navigate to={`/e/${DEFAULT_ESTATE_SLUG}${rest}${location.search}`} replace />;
};
