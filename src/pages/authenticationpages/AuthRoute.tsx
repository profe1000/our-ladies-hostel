import "../../App.css";
import { Routes, Route } from "react-router-dom";
import Nopage from "../Nopage/Nopage";
import AuthSignIn from "./authSignIn/authSignin";
import ForgotPasswordPage from "./ForgotPassword/ForgotPasswordPage";
import ResetPasswordPage from "./ResetPassword/ResetPasswordPage";
import LandingPagesLayout from "../Layout/Layout";

/** Estate admin sign in and password reset. Tenants use their estate's /e/:slug/login */
const AuthRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPagesLayout />}>
        <Route index element={<AuthSignIn />} />
        <Route path="/signin" element={<AuthSignIn />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage isAdmin />} />
        <Route path="/reset-password" element={<ResetPasswordPage isAdmin />} />
        <Route path="*" element={<Nopage />} />
      </Route>
    </Routes>
  );
};

export default AuthRoutes;
