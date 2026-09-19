import { LeftOutlined, LoadingOutlined } from "@ant-design/icons";
import { Input } from "antd";
import { useState } from "react";
import { Link } from "react-router-dom";
import { authResetPassword } from "../../../apiservice/authService";
import useFormatApiRequest from "../../../hooks/formatApiRequest";
import "../Auth.css";

const AuthForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [isPasswordSent, setisPasswordSent] = useState(false);
  const [formLoading, setFormLoading] = useState<boolean>(false);
  const [loadApi, setLoadApi] = useState(false);
  const [user, setUser] = useState({});
  const [notificationMessage, setNotificationMessage] = useState<any | null>(
    null
  );

  // Use to collect Email Change
  const handleEmailChange = (event: any) => {
    setEmail(event.target.value);
  };

  // Use to Submit Form
  const handleSubmit = (event: any) => {
    event.preventDefault();

    setUser({
      email: email,
    });
    setLoadApi(true);
    setFormLoading(true);
  };

  // A custom hook to format the login Api
  const result = useFormatApiRequest(
    () => authResetPassword(user),
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
        description: "Password Reset Email has being sent",
        background: "#D9FFB5",
      });
      setisPasswordSent(true);
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
        <div className="w3-col" style={{ paddingTop: "40px" }}>
          <span className="getStartedText">
            {isPasswordSent ? "Check your email" : "Forget Password"}
          </span>
          <span className="w3-right">
            <Link to="/userauth/signin">
              <LeftOutlined style={{ zoom: "1.5" }} rev={undefined} />
            </Link>
          </span>
        </div>
        <div
          className="w3-col"
          style={{ paddingTop: "60px", marginBottom: "60px" }}
        >
          {isPasswordSent ? (
            <div>
              <p>
                A link as been sent to your email to continue the process of
                setting up ypur password <br />
                <br />
                <p className="w3-hide">
                  Resend Email in {"1:00"} <br />
                  <span onClick={handleSubmit}> Resend Email </span>{" "}
                </p>
              </p>
              <div className="w3-col w3-margin-bottom w3-margin-top">
                <button
                  onClick={() => {
                    setisPasswordSent(false);
                  }}
                  className="w3-btn w3-col submitButton"
                >
                  <span className="submitButtonText">Resend Link</span>
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="w3-col w3-margin-bottom">
                <Input
                  required
                  value={email}
                  onChange={handleEmailChange}
                  className="w3-col inputField"
                  placeholder="Email Address or UserName"
                />
              </div>
              <div className="w3-col w3-margin-bottom w3-margin-top">
                <button
                  disabled={formLoading}
                  className="w3-btn w3-col submitButton"
                >
                  <span className="submitButtonText">
                    {!formLoading ? (
                      "Verfiy Email"
                    ) : (
                      <LoadingOutlined rev={undefined} />
                    )}
                  </span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
};

export default AuthForgetPassword;
