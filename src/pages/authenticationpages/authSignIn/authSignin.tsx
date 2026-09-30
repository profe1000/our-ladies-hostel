import { LoadingOutlined } from "@ant-design/icons";
import { notification } from "antd";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { adminAuthSignIn } from "../../../apiservice/admin-AuthService";
import { IAdminAuthType } from "../../../apiservice/admin-AuthService.type";
import TitleBar from "../../../components/LayoutComponent/TitleBar/titleBar";
import TopBar from "../../../components/LayoutComponent/TopBar/topBar";
import useFormatApiRequest from "../../../hooks/formatApiRequest";
import { ADMIN_AUTH_DATA_KEY, ADMIN_TOKEN_KEY } from "../../../hooks/useAuth";
import { useAppDispatch } from "../../../Redux/reduxCustomHook";
import { storePlainString, storeJSON } from "../../../utils/localStorage";
import "../Auth.css";
import { isSuperAdminRole } from "../../../utils/admin.utils";
import { clearLoginAs, ESTATE_SLUG_KEY, estatePath } from "../../../utils/estate";
import { getString } from "../../../utils/localStorage";
type NotificationType = "success" | "info" | "warning" | "error";

const AuthSignIn = () => {
  const [formLoading, setFormLoading] = useState<boolean>(false);
  const [loadApi, setLoadApi] = useState(false);
  const [user, setUser] = useState<any>({});
  const [notificationMessage, setNotificationMessage] = useState<any | null>(
    null
  );
  const [api, contextHolder] = notification.useNotification();

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Use to collect Site Description Change
  const handleInputChange = (event: any) => {
    const name = event.target.name;
    const value = event.target.value;
    setUser((values: any) => ({ ...values, [name]: value }));
  };

  // Use to Submit Form
  const handleSubmit = (event: any) => {
    event.preventDefault();
    // A real sign in must use this device's own uuid, not one left by a "login as" session
    clearLoginAs(true);
    setLoadApi(true);
    setFormLoading(true);
  };

  // A custom hook to format the login Api
  const result = useFormatApiRequest(
    () => adminAuthSignIn(user),
    loadApi,
    () => {
      setLoadApi(false);
    },
    () => {
      processApi();
    }
  );

  // Process Api
  const processApi = async () => {
    if (result.httpState === "SUCCESS") {
      setFormLoading(false);
      const signinResult: IAdminAuthType = result.data;

      setTimeout(() => {
        storePlainString(ADMIN_TOKEN_KEY, signinResult?.data?.token || "");
        storeJSON(ADMIN_AUTH_DATA_KEY, signinResult);
        dispatch({ type: "ADMIN_AUTH_ADD_DATA", payload: signinResult });
        if (isSuperAdminRole(signinResult.data?.credentials?.adminRole)) {
          navigate("/admin");
        } else {
          navigate("/admin/Buildings");
        }
      }, 1500);

      // Handle Success Here
      openNotificationWithIcon("info", "", "Login Success", "#D9FFB5");
    } else if (result.httpState === "ERROR") {
      setFormLoading(false);
      //Handle Error Here
      openNotificationWithIcon(
        "info",
        "",
        result.data?.response?.data?.message ||
          result.errorMsg ||
          "Login Error",
        "#FFC2B7"
      );
    }
  };

  // Show Notification
  const openNotificationWithIcon = (
    type: NotificationType,
    message: string,
    description: string,
    background?: string
  ) => {
    api[type]({
      message,
      description,
      placement: "bottomRight",
      style: { background },
    });
  };

  return (
    <>
      {/* " The context is use to hold the notification from ant design" */}
      {contextHolder}

      <TopBar showProfile={false} saasBrand></TopBar>

      <div className="w3-col" style={{ marginTop: "20px" }}>
        <TitleBar title="Estate Admin Sign In"></TitleBar>
      </div>
      <div className="w3-content">
        <div className="w3-container">
          {/* Form */}
          <div style={{ paddingTop: "20px" }}>
            <form onSubmit={handleSubmit}>
              <div className="w3-col w3-margin-top w3-margin-bottom">
                <h5 className="adminLoginFormInputHeader myfont1">
                  Sign in to manage your estate
                </h5>
              </div>

              {/* Email */}
              <div className="w3-col w3-margin-top w3-margin-bottom">
                <div className="w3-col l12 s12 m12">
                  {/* <span className="w3-small w3-text-white myfont1">Email</span> */}
                  <input
                    required
                    name="email"
                    value={user?.email || ""}
                    onChange={handleInputChange}
                    className="w3-input w3-col w3-text-white loginFormInput"
                    placeholder="Email Address"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="w3-col w3-margin-top w3-margin-bottom">
                <div className="w3-col l12 s12 m12">
                  {/* <span className="w3-small w3-text-white myfont1">Email</span> */}
                  <input
                    required
                    name="password"
                    type={"password"}
                    value={user?.password || ""}
                    onChange={handleInputChange}
                    className="w3-input w3-col w3-text-white loginFormInput"
                    placeholder="Password"
                  />
                </div>
              </div>

              {/* Forget Password */}
              {/* <div className="w3-col w3-margin-bottom w3-right-align">
              <Link className="w3-text-white" to="/auth/user-forget-password">
                <u> Forget Password </u>
              </Link>
            </div> */}

              {/* Login Button */}
              <div className="w3-col w3-margin-bottom">
                <button
                  disabled={formLoading}
                  className="w3-btn w3-col w3-round-large loginButton"
                >
                  <span className="w3-text-white">
                    {!formLoading ? (
                      "Login"
                    ) : (
                      <LoadingOutlined rev={undefined} />
                    )}
                  </span>
                </button>
              </div>

              {/* Tenants have their own sign in page on their estate's page */}
              <div
                className="w3-col w3-margin-top w3-small myfont1"
                style={{ color: "rgba(255,255,255,0.7)" }}
              >
                Are you a tenant?{" "}
                {getString(ESTATE_SLUG_KEY) ? (
                  <Link to={estatePath("/login")} className="w3-text-white">
                    <u>Sign in as a tenant</u>
                  </Link>
                ) : (
                  "Sign in from your estate's page, using the link in your welcome email."
                )}
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

export default AuthSignIn;
