import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { ADMIN_AUTH_DATA_KEY, ADMIN_TOKEN_KEY, USER_AUTH_DATA_KEY, USER_TOKEN_KEY } from "../../hooks/useAuth";
import { clearLoginAs } from "../../utils/estate";
import { getLoginAsInfo, ILoginAsInfo } from "../../utils/loginAs";
import { removeItem } from "../../utils/localStorage";
import "./LoginAsBanner.css";

/**
 * Shown on admin and tenant pages while someone is logged in through "login as",
 * so it is always clear whose account this is and how to leave it
 */
const LoginAsBanner = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");
  const isUser = location.pathname.startsWith("/users");
  const [info, setInfo] = useState<ILoginAsInfo | null>(null);

  useEffect(() => {
    setInfo(isAdmin || isUser ? getLoginAsInfo(isAdmin) : null);
  }, [location.pathname, isAdmin, isUser]);

  // The app's header is fixed to the top, so the page moves down to make room for the banner
  useEffect(() => {
    document.body.classList.toggle("hasLoginAsBanner", !!info);
    return () => document.body.classList.remove("hasLoginAsBanner");
  }, [info]);

  if (!info) return null;

  const expired = info.expiresAt && new Date(info.expiresAt).getTime() < Date.now();

  const leave = () => {
    clearLoginAs(isAdmin);
    removeItem(isAdmin ? ADMIN_TOKEN_KEY : USER_TOKEN_KEY);
    removeItem(isAdmin ? ADMIN_AUTH_DATA_KEY : USER_AUTH_DATA_KEY);
    window.close();
    // If the tab was not opened by script it cannot close itself
    window.location.href = "/";
  };

  return (
    <div className={`loginAsBanner ${info.readOnly ? "loginAsBannerReadOnly" : ""}`}>
      <span className="loginAsBannerText">
        {expired ? "Expired: " : ""}Logged in as <b>{info.name || (isAdmin ? "estate admin" : "tenant")}</b>
        {info.estate?.name ? ` (${info.estate.name})` : ""} by {info.impersonatedBy}
        {info.readOnly ? " · View only" : ""}
      </span>
      <button type="button" onClick={leave}>
        Leave
      </button>
    </div>
  );
};

export default LoginAsBanner;
