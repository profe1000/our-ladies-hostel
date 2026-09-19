import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPagesRoute from "./pages/landingpages/landingPagesRoute";
import useAuth from "./hooks/useAuth";
import { ProtectedRoute } from "./pages/ProtectedRoute/ProtectedRoutePage";
import { StatusBar, Style } from "@capacitor/status-bar";
import AuthRoutes from "./pages/authenticationpages/AuthRoute";
import Nopage from "./pages/Nopage/Nopage";
import { useEffect } from "react";
import AdminPagesRoute from "./pages/admindashboardpages/adminPagesRoute";
import UsersPagesRoute from "./pages/userdashboardpages/userPagesRoute";

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
      <Routes>
        {/* <Route index element={<AuthRoutes />} /> */}
        <Route index element={<LandingPagesRoute />} />
        <Route path="landing/*" element={<LandingPagesRoute />} />
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
            <ProtectedRoute>
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
