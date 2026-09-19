import { LoadingOutlined } from "@ant-design/icons";
import { notification } from "antd";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { adminAuthSignIn } from "../../../apiservice/admin-AuthService";
import { IAdminAuthType } from "../../../apiservice/admin-AuthService.type";
import { authSignIn } from "../../../apiservice/authService";
import { IAuthType } from "../../../apiservice/authService.type";
import TitleBar from "../../../components/LayoutComponent/TitleBar/titleBar";
import TopBar from "../../../components/LayoutComponent/TopBar/topBar";
import useFormatApiRequest from "../../../hooks/formatApiRequest";
import {
  USER_TOKEN_KEY,
  USER_AUTH_DATA_KEY,
  ADMIN_AUTH_DATA_KEY,
  ADMIN_TOKEN_KEY,
} from "../../../hooks/useAuth";
import { useAppDispatch } from "../../../Redux/reduxCustomHook";
import { storePlainString, storeJSON } from "../../../utils/localStorage";
import "../Auth.css";
type NotificationType = "success" | "info" | "warning" | "error";

const AuthSignIn = () => {
  const [formLoading, setFormLoading] = useState<boolean>(false);
  const [loadApi, setLoadApi] = useState(false);
  const [user, setUser] = useState<any>({});
  const [selectedUserType, setSelectedUserType] = useState<number>(2);
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
    setLoadApi(true);
    setFormLoading(true);
  };

  // A custom hook to format the login Api
  const result = useFormatApiRequest(
    () => (selectedUserType === 1 ? authSignIn(user) : adminAuthSignIn(user)),
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
      const signinResult: IAuthType & IAdminAuthType = result.data;

      setTimeout(() => {
        if (selectedUserType === 1) {
          storePlainString(USER_TOKEN_KEY, signinResult?.data?.token || "");
          storeJSON(USER_AUTH_DATA_KEY, signinResult);
          dispatch({ type: "AUTH_ADD_DATA", payload: signinResult });
          navigate("/users");
        } else if (selectedUserType === 2) {
          storePlainString(ADMIN_TOKEN_KEY, signinResult?.data?.token || "");
          storeJSON(ADMIN_AUTH_DATA_KEY, signinResult);
          dispatch({ type: "ADMIN_AUTH_ADD_DATA", payload: signinResult });
          if (signinResult.data?.credentials?.adminRole?.id === 1) {
            navigate("/admin");
          } else {
            navigate("/admin/Buildings");
          }
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

      <TopBar showProfile={false}></TopBar>

      <div className="w3-col" style={{ marginTop: "20px" }}>
        <TitleBar title="Choose Account Type"></TitleBar>
      </div>
      <div className="w3-content">
        <div className="w3-container">
          {/* PreForm */}
          <div style={{ paddingTop: "20px" }}>
            {/* <div className="w3-col l6 s6 m6" style={{ padding: "15px" }}>
              <div
                className={
                  "w3-col authSelectorBg w3-round-large w3-center " +
                  (selectedUserType === 1 ? "authSelectorBgSelected " : "")
                }
                onClick={() => {
                  setSelectedUserType(1);
                }}
              >
                <div className="w3-col w3-center">
                  <img
                    src="/images/auth/avatar.png"
                    style={{ width: "100%", maxWidth: "100px" }}
                    alt=""
                  />
                  <br />
                  <div className="w3-text-white w3-center myfont1">Tenant</div>
                </div>
              </div>
            </div> */}

            <div className="w3-col l6 s6 m6" style={{ padding: "15px" }}>
              <div
                className={
                  "w3-col authSelectorBg w3-round-large w3-center " +
                  (selectedUserType === 2 ? "authSelectorBgSelected " : "")
                }
                onClick={() => {
                  setSelectedUserType(2);
                }}
              >
                <div className="w3-col w3-center">
                  <img
                    src="/images/auth/avatar.png"
                    style={{ width: "100%", maxWidth: "100px" }}
                    alt=""
                  />
                  <br />
                  <div className="w3-text-white w3-center myfont1">
                    LandLord
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Form */}
          <div style={{ paddingTop: "20px" }}>
            <form onSubmit={handleSubmit}>
              <div className="w3-col w3-margin-top w3-margin-bottom">
                <h5 className="adminLoginFormInputHeader myfont1">
                  Login into your account
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
