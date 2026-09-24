import "../../App.css";
import { Routes, Route } from "react-router-dom";
import { HomePage } from "./Home/Home";
import Nopage from "../Nopage/Nopage";
import LandingPagesLayout from "../Layout/Layout";
import UserRegistrationForm from "./UserRegistrationForm/UserRegistrationForm";
import UserPaymentForm from "./UserPaymentForm/UserPaymentForm";
import PaymentLinkPage from "./PaymentLink/PaymentLinkPage";
import UserApartmentUnitsPage from "./UserApartmentUnitsPage/UserApartmentUnitsPage";

const LandingPagesRoute = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPagesLayout />}>
        <Route index element={<HomePage />} />
        <Route
          path="/user-apartment-Unit/:id"
          element={<UserApartmentUnitsPage />}
        />
        <Route
          path="/user-tenant-registration/:id"
          element={<UserRegistrationForm />}
        />
        <Route path="/user-tenant-payment/:id" element={<UserPaymentForm />} />
        <Route path="/pay/:token" element={<PaymentLinkPage />} />
        <Route path="*" element={<Nopage />} />
      </Route>
    </Routes>
  );
};

export default LandingPagesRoute;
