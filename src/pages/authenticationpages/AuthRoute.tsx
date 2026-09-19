import "../../App.css";
import { Routes, Route } from "react-router-dom";
import Nopage from "../Nopage/Nopage";
import AuthSignIn from "./authSignIn/authSignin";
import AuthForgetPassword from "./authforgetPassword/authForgetPassword";
import AuthSetNewPassword from "./authforgetPassword-setnewpassword/authSetNewPassword";
import LandingPagesLayout from "../Layout/Layout";

const AuthRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPagesLayout />}>
        <Route index element={<AuthSignIn />} />
        <Route path="/signin" element={<AuthSignIn />} />
        <Route path="/auth-forget-password" element={<AuthForgetPassword />} />
        <Route path="/auth-setnew-password" element={<AuthSetNewPassword />} />
        <Route path="*" element={<Nopage />} />
      </Route>
    </Routes>
  );
};

export default AuthRoutes;
