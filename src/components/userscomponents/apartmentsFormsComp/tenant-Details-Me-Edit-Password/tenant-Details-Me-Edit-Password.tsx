import { LoadingOutlined } from "@ant-design/icons";
import { Button, Result } from "antd";
import { useState } from "react";
import { changeAdminPassword } from "../../../../apiservice/admin-AuthService";
import { authChangePassword } from "../../../../apiservice/authService";
import useFormatApiRequest from "../../../../hooks/formatApiRequest";
import "./tenant-Details-Me-Edit-Password.css";

type ITenantDetailsMeEditPassword = {
  onFormSuccess?: () => void;
  onFormFailure?: (err?: string) => void;
};

export const TenantDetailsMeEditPassword: React.FC<
  ITenantDetailsMeEditPassword
> = ({ onFormFailure, onFormSuccess }) => {
  const [loadApi, setLoadApi] = useState(false);
  const [payLoad, setpayLoad] = useState<any>({});
  const [formLoading, setFormLoading] = useState<boolean>(false);
  const [showFormResult, setShowFormResult] = useState(false);

  // Use to collect Input change Change
  const handleInputChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setpayLoad((values) => ({ ...values, [name]: value }));
  };

  // Use to Submit Form
  const handleSubmit = (event: any) => {
    event.preventDefault();
    if (payLoad?.newPassword !== payLoad?.confirmPassword) {
      alert("Your password do not match");
      return;
    }
    setLoadApi(true);
    setFormLoading(true);
  };

  // A custom hook to Process Form
  const result = useFormatApiRequest(
    () => authChangePassword(payLoad),
    loadApi,
    () => {
      setLoadApi(false);
    },
    () => {
      processFormApi();
    }
  );

  // Process Api
  const processFormApi = async () => {
    if (result.httpState === "SUCCESS") {
      setFormLoading(false);
      // setShowFormResult(true);
      alert("Your Password Have been Updated");
      // Handle Success Here
    } else if (result.httpState === "ERROR") {
      setFormLoading(false);
      // if (onFormFailure) {
      //   onFormFailure(result.data?.response?.data?.message || result.errorMsg);
      // }
      alert(result.data?.response?.data?.message || result.errorMsg);
      //Handle Error Here
    }
  };

  return (
    <div>
      {/* Profile Form */}
      {!showFormResult && (
        <div className="w3-container w3-col">
          <div>
            <form onSubmit={handleSubmit}>
              {/* Forms Here */}

              <div className="w3-border-bottom w3-padding">
                <h3 className="adminDetailsHeaderText"> Change Password </h3>
              </div>

              {/* Old Password */}
              <div className="w3-col w3-margin-bottom w3-margin-top">
                <div className="w3-col l12 s12 m12">
                  <span className="w3-text-white w3-small w3-round myfont1">
                    Old Password
                  </span>
                </div>
                <div className="w3-col l12 s12 m12">
                  <input
                    required
                    name="oldPassword"
                    value={payLoad?.oldPassword || ""}
                    onChange={handleInputChange}
                    className="w3-input w3-border w3-col w3-text-white w3-border-white w3-round-large  AdminFormInput"
                    placeholder="Old Password"
                    type="password" // Assuming this is a password input field
                  />
                </div>
              </div>

              {/* New Password */}
              <div className="w3-col w3-margin-bottom">
                <div className="w3-col l12 s12 m12">
                  <span className="w3-text-white w3-small w3-round myfont1">
                    New Password
                  </span>
                </div>
                <div className="w3-col l12 s12 m12">
                  <input
                    required
                    name="newPassword"
                    value={payLoad?.newPassword || ""}
                    onChange={handleInputChange}
                    className="w3-input w3-border w3-col w3-text-white w3-border-white w3-round-large  AdminFormInput"
                    placeholder="New Password"
                    type="password" // Assuming this is a password input field
                  />
                </div>
              </div>

              {/* Confirm Password */}
              <div className="w3-col w3-margin-bottom">
                <div className="w3-col l12 s12 m12">
                  <span className="w3-text-white w3-small w3-round myfont1">
                    Confirm Password
                  </span>
                </div>
                <div className="w3-col l12 s12 m12">
                  <input
                    required
                    name="confirmPassword"
                    value={payLoad?.confirmPassword || ""}
                    onChange={handleInputChange}
                    className="w3-input w3-border w3-col w3-text-white w3-border-white w3-round-large  AdminFormInput"
                    placeholder="Confirm Password"
                    type="password" // Assuming this is a password input field
                  />
                </div>
              </div>

              {/* Button Here */}
              <div className="w3-col w3-margin-bottom w3-margin-top">
                <button
                  disabled={formLoading}
                  className="w3-btn regButton w3-col w3-round-large"
                >
                  <span className="submitButtonText">
                    {!formLoading ? (
                      "Change Password"
                    ) : (
                      <LoadingOutlined rev={undefined} />
                    )}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showFormResult && (
        <div>
          <Result
            status="success"
            title=""
            subTitle={<span>You have succesfully Updated your passsword</span>}
            extra={[
              <Button
                onClick={() => {
                  setShowFormResult(false);
                }}
                type="primary"
                key="console"
              >
                Okay
              </Button>,
            ]}
          />
        </div>
      )}
    </div>
  );
};

export default TenantDetailsMeEditPassword;
