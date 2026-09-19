import "../../App.css";
import { Routes, Route } from "react-router-dom";
import Nopage from "../Nopage/Nopage";
import UserProfile from "./UserProfile/UserProfile";
import UserNotifcation from "./userNotifcation/userNotifcation";
import UserChangePassword from "./userChangePassword/userChangePassword";

const UsersPagesRoute = () => {
  return (
    <Routes>
      <Route index element={<UserProfile />} />
      <Route path="/profile" element={<UserProfile />} />
      <Route path="/changePassword" element={<UserChangePassword />} />
      <Route path="/notifications" element={<UserNotifcation />} />
      <Route path="*" element={<Nopage />} />
    </Routes>
  );
};

export default UsersPagesRoute;
