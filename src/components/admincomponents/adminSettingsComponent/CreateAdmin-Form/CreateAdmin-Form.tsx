import { LoadingOutlined, MailOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import "./CreateAdmin-Form.css";
import { Input } from "antd";

import useFormatApiRequest from "../../../../hooks/formatApiRequest";
import { sampleApiCall } from "../../../../apiservice/authService";
import {
  adminAddAdminApi,
  adminEditAdmintApi,
  adminGetAdminRolesApi,
} from "../../../../apiservice/admin-General-ApiService";

type ICreateAdminForm = {
  adminUserData?: any | null;
  isEditMode?: boolean;
  refreshPage?: () => void;
};

const CreateAdminForm: React.FC<ICreateAdminForm> = ({
  adminUserData,
  isEditMode = false,
  refreshPage,
}) => {
  const [formLoading, setFormLoading] = useState<boolean>(false);
  const [user, setUser] = useState<any>({});
  const [loadApi, setLoadApi] = useState(false);

  const [loadAdminRoleDataApi, setLoadAdminRoleDataApi] = useState(true);
  const [adminRoleData, setAdminRoleData] = useState<any[]>([]);

  const [notificationMessage, setNotificationMessage] = useState<any | null>(
    null
  );

  const adminButtonText = isEditMode ? "Edit Admin" : "Create Admin";

  // This is use to Update Form if in Edit Mode
  useEffect(() => {
    setUser({
      ...adminUserData,
      userName: adminUserData?.username,
      roleId: adminUserData?.role?.id,
    });
  }, []);

  // Use to collect Site Description Change
  const handleInputChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setUser((values) => ({ ...values, [name]: value }));
  };

  // Use to Submit Form
  const handleSubmit = (event: any) => {
    event.preventDefault();
    setUser({
      ...user,
      isSuperAdmin: user?.roleId === 1 ? true : false,
    });
    setFormLoading(true);
    setLoadApi(true);
  };

  // A custom hook to format the Sign Up Api
  const result = useFormatApiRequest(
    () =>
      isEditMode
        ? adminEditAdmintApi(user, adminUserData?.id)
        : adminAddAdminApi(user),
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

      alert(isEditMode ? "Admin Updated " : "Admin Created Succesful");
      if (!isEditMode) {
        setUser({});
      }
    } else if (result.httpState === "ERROR") {
      setFormLoading(false);

      alert(result.data?.response?.data?.message || result.errorMsg || "Error");
    }
  };

  // A custom hook to Load Admin Role from the server
  const adminRoleResult = useFormatApiRequest(
    () => adminGetAdminRolesApi(),
    loadAdminRoleDataApi,
    () => {
      setLoadAdminRoleDataApi(loadAdminRoleDataApi);
    },
    () => {
      processAdminRoleResultApi();
    }
  );

  // Process Admin Role Result
  const processAdminRoleResultApi = async () => {
    if (adminRoleResult.httpState === "SUCCESS") {
      setAdminRoleData(adminRoleResult.data?.data);
      // console.log(adminRoleResult.data);
    } else if (adminRoleResult.httpState === "ERROR") {
      // console.log(adminRoleResult.errorMsg);
    }
  };

  return (
    <>
      <div className="w3-content">
        <div className="w3-container w3-margin-top">
          <h4>
            {" "}
            {!isEditMode ? (
              <span> Create Admin</span>
            ) : (
              <span> Edit Admin</span>
            )}
          </h4>
        </div>

        <div className="w3-col w3-padding">
          <div style={{ paddingTop: "10px" }}>
            <form className="adminForm" onSubmit={handleSubmit}>
              {/* First Name */}
              <div className="w3-col w3-margin-bottom">
                <div className="w3-col l12 s12 m12">
                  <span className="w3-small w3-text-white myfont1">
                    {" "}
                    FirstName{" "}
                  </span>
                  <input
                    required
                    name="firstName"
                    value={user?.firstName || ""}
                    onChange={handleInputChange}
                    className="w3-input w3-border w3-col w3-text-white w3-round-large regFormInput "
                    placeholder="First Name"
                  />
                </div>
              </div>

              {/* Last Name */}
              <div className="w3-col w3-margin-bottom">
                <div className="w3-col l12 s12 m12">
                  <span className="w3-small w3-text-white myfont1">
                    Last Name
                  </span>
                  <input
                    required
                    name="lastName"
                    value={user?.lastName || ""}
                    onChange={handleInputChange}
                    className="w3-input w3-border w3-col w3-text-white w3-round-large regFormInput "
                    placeholder="Last Name"
                  />
                </div>
              </div>

              {/* Email */}
              {!isEditMode && (
                <div className="w3-col w3-margin-bottom">
                  <div className="w3-col l12 s12 m12">
                    <span className="w3-small w3-text-white myfont1">
                      Email
                    </span>
                    <input
                      required
                      name="email"
                      value={user?.email || ""}
                      onChange={handleInputChange}
                      className="w3-input w3-border w3-col w3-text-white w3-round-large regFormInput"
                      placeholder="Email"
                      type="email"
                    />
                  </div>
                </div>
              )}

              {/* Phone Number */}
              <div className="w3-col w3-margin-bottom">
                <div className="w3-col l12 s12 m12">
                  <span className="w3-small w3-text-white myfont1">
                    Phone Number
                  </span>
                  <input
                    required
                    name="phoneNumber"
                    value={user?.phoneNumber || ""}
                    onChange={handleInputChange}
                    className="w3-input w3-border w3-col w3-text-white w3-round-large regFormInput"
                    placeholder="Phone Number"
                    type="tel" // Using type="tel" for phone number input
                  />
                </div>
              </div>

              {/* User Name */}
              {!isEditMode && (
                <div className="w3-col w3-margin-bottom">
                  <div className="w3-col l12 s12 m12">
                    <span className="w3-small w3-text-white myfont1">
                      User Name
                    </span>
                    <input
                      required
                      name="userName"
                      value={user?.userName || ""}
                      onChange={handleInputChange}
                      className="w3-input w3-border w3-col w3-text-white w3-round-large regFormInput"
                      placeholder="User Name"
                      type="userName"
                    />
                  </div>
                </div>
              )}

              {/* Password */}
              {!isEditMode && (
                <div className="w3-col w3-margin-bottom">
                  <div className="w3-col l12 s12 m12">
                    <span className="w3-small w3-text-white myfont1">
                      Password
                    </span>
                    <input
                      required
                      name="password"
                      value={user?.password || ""}
                      onChange={handleInputChange}
                      className="w3-input w3-border w3-col w3-text-white w3-round-large regFormInput"
                      placeholder="Password"
                      type="password"
                    />
                  </div>
                </div>
              )}

              {/* Role ID */}
              <div className="w3-col w3-margin-bottom w3-round-large w3-border-yellow w3-margin-top">
                <span className="w3-small w3-text-white myfont1">
                  {" "}
                  Admin Role{" "}
                </span>
                <select
                  required
                  name="adminRoleId"
                  value={user?.adminRoleId || ""}
                  onChange={handleInputChange}
                  className="w3-input w3-border w3-col w3-text-white w3-round-large regFormInput"
                >
                  <option value="">Select User Role</option>
                  {adminRoleData.map((item: any, index: number) => (
                    <option key={index} value={item.id}>
                      {item.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="w3-col w3-margin-bottom w3-margin-top">
                <button
                  disabled={formLoading}
                  className="w3-btn regButton w3-col w3-round-large"
                >
                  <span className="submitButtonText">
                    {!formLoading ? (
                      adminButtonText
                    ) : (
                      <LoadingOutlined rev={undefined} />
                    )}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateAdminForm;
