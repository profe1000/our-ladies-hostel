import { LoadingOutlined } from "@ant-design/icons";
import { notification } from "antd";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authSignIn } from "../../../apiservice/authService";
import TitleBar from "../../../components/LayoutComponent/TitleBar/titleBar";
import TopBar from "../../../components/LayoutComponent/TopBar/topBar";
import useEstateBranding from "../../../hooks/useEstateBranding";
import { USER_AUTH_DATA_KEY, USER_TOKEN_KEY } from "../../../hooks/useAuth";
import { useAppDispatch } from "../../../Redux/reduxCustomHook";
import { clearLoginAs, estatePath } from "../../../utils/estate";
import { storeJSON, storePlainString } from "../../../utils/localStorage";
import "../../authenticationpages/Auth.css";

/**
 * Tenant sign in for one estate, at /e/:slug/login. Tenant accounts belong to an estate,
 * so the estate in the URL (sent as X-Estate) decides which accounts are checked
 */
const TenantSignIn = () => {
  const [user, setUser] = useState<{ email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);
  const [api, contextHolder] = notification.useNotification();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const branding = useEstateBranding();

  const handleInputChange = (event: any) => {
    const { name, value } = event.target;
    setUser((values) => ({ ...values, [name]: value }));
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    setLoading(true);
    // A real sign in must use this device's own uuid, not one left by a "login as" session
    clearLoginAs(false);
    try {
      const result = await authSignIn(user);
      storePlainString(USER_TOKEN_KEY, result?.data?.token || "");
      storeJSON(USER_AUTH_DATA_KEY, result);
      dispatch({ type: "AUTH_ADD_DATA", payload: result });
      navigate("/users", { replace: true });
    } catch (error: any) {
      setLoading(false);
      api.info({
        message: "",
        description: error?.response?.data?.message || "Login Error",
        placement: "bottomRight",
        style: { background: "#FFC2B7" },
      });
    }
  };

  return (
    <>
      {contextHolder}

      <TopBar showProfile={false}></TopBar>

      <div className="w3-col" style={{ marginTop: "20px" }}>
        <TitleBar title="Tenant Sign In"></TitleBar>
      </div>
      <div className="w3-content">
        <div className="w3-container">
          <div style={{ paddingTop: "20px" }}>
            <form onSubmit={handleSubmit}>
              <div className="w3-col w3-margin-top w3-margin-bottom">
                <h5 className="adminLoginFormInputHeader myfont1">
                  {branding?.name ? `Sign in to your ${branding.name} account` : "Sign in to your tenant account"}
                </h5>
              </div>

              <div className="w3-col w3-margin-top w3-margin-bottom">
                <input
                  required
                  name="email"
                  type="email"
                  autoComplete="username"
                  value={user.email || ""}
                  onChange={handleInputChange}
                  className="w3-input w3-col w3-text-white loginFormInput"
                  placeholder="Email Address"
                />
              </div>

              <div className="w3-col w3-margin-top w3-margin-bottom">
                <input
                  required
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  value={user.password || ""}
                  onChange={handleInputChange}
                  className="w3-input w3-col w3-text-white loginFormInput"
                  placeholder="Password"
                />
              </div>

              <div className="w3-col w3-margin-bottom">
                <button disabled={loading} className="w3-btn w3-col w3-round-large loginButton">
                  <span className="w3-text-white">{!loading ? "Login" : <LoadingOutlined />}</span>
                </button>
              </div>

              <div className="w3-col w3-margin-top w3-small myfont1" style={{ color: "rgba(255,255,255,0.7)" }}>
                Your login details were emailed to you after your first payment.
                <br />
                Not a tenant yet?{" "}
                <Link to={estatePath()} className="w3-text-white">
                  <u>Browse available units</u>
                </Link>
              </div>

              <div className="w3-col w3-margin-bottom">
                <br />
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default TenantSignIn;
