import { LeftOutlined, LoadingOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { authSetNewPassword } from "../../../apiservice/authService";
import useFormatApiRequest from "../../../hooks/formatApiRequest";
import "../Auth.css";

const AuthSetNewPassword = () => {
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formLoading, setFormLoading] = useState<boolean>(false);
  const [loadApi, setLoadApi] = useState(false);
  const [user, setUser] = useState({});
  const [notificationMessage, setNotificationMessage] = useState<any | null>(
    null
  );

  const navigate = useNavigate();
  const query = useLocation();

  // This is use to Update The Params Value
  useEffect(() => {
    const search = query.search;
    const token = new URLSearchParams(search).get("token");
    console.log(token);
    if (token) {
      setToken(token);
    }
  }, []);

  // Use to collect Password Change
  const handlePasswordChange = (event: any) => {
    setPassword(event.target.value);
  };

  // Use to Submit Form
  const handleSubmit = (event: any) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setNotificationMessage({
        type: "error",
        message: "",
        description: "Password do not match",
        background: "#FFC2B7",
      });
      return;
    }

    setUser({
      password: password,
      token: token,
    });
    setLoadApi(true);
    setFormLoading(true);
    // setPassword("");
  };

  // Use to collect Confirm Password Change
  const handleConfirmPasswordChange = (event: any) => {
    setConfirmPassword(event.target.value);
  };

  // A custom hook to format the login Api
  const result = useFormatApiRequest(
    () => authSetNewPassword(user),
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
      // Handle Success Here
      setNotificationMessage({
        type: "info",
        message: "",
        description: "Your Password Has being changed",
        background: "#D9FFB5",
      });
      setTimeout(() => {
        navigate("/userauth/signin");
      }, 1000);
    } else if (result.httpState === "ERROR") {
      setFormLoading(false);
      //Handle Error Here
      setNotificationMessage({
        type: "info",
        message: "",
        description:
          result.data?.response?.data?.message ||
          result.errorMsg ||
          "Login Error",
        background: "#FFC2B7",
      });
    }
  };

  return (
    <>
      <div>
        <div style={{ paddingTop: "20px" }}>
          <span className="getStartedText">Set New Password</span>
          <span className="w3-right">
            <Link to="/">
              <LeftOutlined style={{ zoom: "1.5" }} rev={undefined} />
            </Link>
          </span>
        </div>
        <div style={{ paddingTop: "60px" }}>
          <form onSubmit={handleSubmit}>
            <div className="w3-col w3-margin-bottom"></div>
            <div className="w3-col w3-margin-bottom w3-margin-top"></div>
            <div className="w3-col w3-margin-bottom w3-margin-top">
              <button
                disabled={formLoading}
                className="w3-btn w3-col submitButton"
              >
                <span className="submitButtonText">
                  {!formLoading ? (
                    "Set Password"
                  ) : (
                    <LoadingOutlined rev={undefined} />
                  )}
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AuthSetNewPassword;
