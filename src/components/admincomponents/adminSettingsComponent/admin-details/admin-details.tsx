import { ExclamationCircleFilled } from "@ant-design/icons";
import { Modal } from "antd";
import { useState } from "react";
import { adminUpdateTenantPasswordApi } from "../../../../apiservice/admin-General-ApiService";
import { IAdminUsersData } from "../../../../apiservice/admin-General-ApiService.type";
import useFormatApiRequest from "../../../../hooks/formatApiRequest";
import { useAppSelector } from "../../../../Redux/reduxCustomHook";
import { RootState } from "../../../../Redux/store";
import { appZIndex } from "../../../../utils/appconst";
import { convertToShortDate } from "../../../../utils/date.utils";
import "./admin-details.css";

export const AdminDetails: React.FC<{}> = () => {
  const selectedAdmin: IAdminUsersData = useAppSelector(
    (state: RootState) => state?.AdminSelectedAdmin
  );

  const [loadResetAdminPasswordApi, setResetAdminPasswordApi] = useState(false);

  const { confirm } = Modal;

  // Reset Admin Password
  const showResetPasswordApiConfirm = () => {
    confirm({
      title: "Are you sure you want to reset this Admin Password",
      icon: <ExclamationCircleFilled rev={undefined} />,
      content: "",
      centered: true,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      zIndex: appZIndex.modal,
      onOk() {
        console.log("OK");
        setResetAdminPasswordApi(true);
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  // A custom hook to  Reset Admin Password
  const resetAdminPasswordApiResult = useFormatApiRequest(
    () => adminUpdateTenantPasswordApi(selectedAdmin.id, {}),
    loadResetAdminPasswordApi,
    () => {
      setResetAdminPasswordApi(false);
    },
    () => {
      processResetAdminPasswordApi();
    }
  );

  // Process The Extension of Admin
  const processResetAdminPasswordApi = async () => {
    if (resetAdminPasswordApiResult.httpState === "SUCCESS") {
      alert("This Admin Password Have being reset");
    } else if (resetAdminPasswordApiResult.httpState === "ERROR") {
      alert(
        resetAdminPasswordApiResult.data?.response?.data?.message ||
          resetAdminPasswordApiResult.errorMsg ||
          "Error"
      );
    }
  };

  return (
    <div className="w3-container w3-margin-top">
      <div className="w3-content">
        {/* Form Header */}
        <div className="w3-col w3-margin-bottom w3-bottombar">
          <h3 className="w3-medium myfont1">
            <b> Admin Full Details </b>
          </h3>
        </div>

        {/* FullName */}
        <div className="w3-col w3-margin-bottom  w3-border-bottom profileBorder">
          <p className="w3-small myfont1">FULLNAME</p>
          <p>
            <b className="myfont1"> {selectedAdmin.fullName}</b>
          </p>
        </div>

        {/* Phone Number*/}
        <div className="w3-col w3-margin-bottom  w3-border-bottom profileBorder">
          <p className="w3-small myfont1">PHONE NUMBER</p>
          <p>
            <b className="myfont1"> {selectedAdmin.phoneNumber}</b>
          </p>
        </div>

        {/* Email */}
        <div className="w3-col w3-margin-bottom  w3-border-bottom profileBorder">
          <p className="w3-small myfont1">EMAIL</p>
          <p>
            <b className="myfont1"> {selectedAdmin.email}</b>
          </p>
        </div>

        {/* Date Joined */}
        <div className="w3-col w3-margin-bottom  w3-border-bottom profileBorder">
          <p className="w3-small myfont1">Date Joined</p>
          <p>
            <b className="myfont1 w3-text-red">
              {convertToShortDate(selectedAdmin.dateCreated)}
            </b>
          </p>
        </div>

        <div>
          <button
            onClick={() => {
              showResetPasswordApiConfirm();
            }}
            className="w3-btn w3-margin-top  w3-round-large myfont1 w3-small editOccupantBtn"
          >
            Reset Password
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDetails;
