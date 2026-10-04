import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LandingPagesRoute from "./pages/landingpages/landingPagesRoute";
import useAuth from "./hooks/useAuth";
import { ProtectedRoute } from "./pages/ProtectedRoute/ProtectedRoutePage";
import { StatusBar, Style } from "@capacitor/status-bar";
import AuthRoutes from "./pages/authenticationpages/AuthRoute";
import Nopage from "./pages/Nopage/Nopage";
import { useEffect } from "react";
import AdminPagesRoute from "./pages/admindashboardpages/adminPagesRoute";
import UsersPagesRoute from "./pages/userdashboardpages/userPagesRoute";
import SaasPublicLayout from "./pages/saaspages/SaasPublicLayout";
import SaasLandingPage from "./pages/saaspages/SaasLanding/SaasLanding";
import SaasSignUpPage from "./pages/saaspages/SaasSignUp/SaasSignUp";
import SaasContactPage from "./pages/saaspages/SaasContact/SaasContact";
import SaasLoginPage from "./pages/saaspages/admin/SaasLogin";
import {
  EstateScope,
  LegacyLandingRedirect,
  SaasAdminRoutes,
} from "./pages/saaspages/saasPagesRoute";
import LoginAsBanner from "./components/LoginAsBanner/LoginAsBanner";
import { estatePath, LOCKED_ESTATE_SLUG } from "./utils/estate";

const ReactApp = () => {
  const authState = useAuth();

  const setStatusBarStyleLight = async () => {
    try {
      await StatusBar.setStyle({ style: Style.Dark });
      await StatusBar.setBackgroundColor({ color: "#0000000" });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    setStatusBarStyleLight();
  }, []);

  return (
    <BrowserRouter>
      <LoginAsBanner />
      <Routes>
        {/* SaaS public pages. An app built for one estate opens that estate's page instead */}
        <Route element={<SaasPublicLayout />}>
          <Route
            index
            element={
              LOCKED_ESTATE_SLUG ? (
                <Navigate to={`/e/${LOCKED_ESTATE_SLUG}`} replace />
              ) : (
                <SaasLandingPage />
              )
            }
          />
          <Route path="signup" element={<SaasSignUpPage />} />
          <Route path="contact" element={<SaasContactPage />} />
        </Route>

        {/* An estate's public pages: its buildings, applications and payment links */}
        <Route
          path="e/:slug/*"
          element={
            <EstateScope>
              <LandingPagesRoute />
            </EstateScope>
          }
        />
        <Route path="landing/*" element={<LegacyLandingRedirect />} />

        {/* SaaS admin */}
        <Route path="saas/login" element={<SaasLoginPage />} />
        <Route path="saas/*" element={<SaasAdminRoutes />} />

        <Route
          path="admin/*"
          element={
            <ProtectedRoute VerificationUserType="admin" customUrl="auth">
              <AdminPagesRoute />
            </ProtectedRoute>
          }
        />
        <Route
          path="users/*"
          element={
            <ProtectedRoute customUrl={estatePath("/login")}>
              <UsersPagesRoute />
            </ProtectedRoute>
          }
        />
        <Route path="auth/*" element={<AuthRoutes />} />
        <Route path="*" element={<Nopage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default ReactApp;
