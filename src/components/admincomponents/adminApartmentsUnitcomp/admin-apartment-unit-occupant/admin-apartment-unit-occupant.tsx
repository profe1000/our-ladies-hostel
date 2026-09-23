import {
  CalendarOutlined,
  ExclamationCircleFilled,
  HistoryOutlined,
  KeyOutlined,
  SettingOutlined,
  UserAddOutlined,
  UserDeleteOutlined,
} from "@ant-design/icons";
import { Modal } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  adminExtendOccupantApi,
  adminRemoveOccupantApi,
  adminUpdateTenantPasswordApi,
} from "../../../../apiservice/admin-General-ApiService";
import {
  IAdminApartmentData,
  IAdminBuildingsData,
  IAdminOccupantData,
  IAdminTenantsData,
} from "../../../../apiservice/admin-General-ApiService.type";
import useFormatApiRequest from "../../../../hooks/formatApiRequest";
import { useAppSelector } from "../../../../Redux/reduxCustomHook";
import { RootState } from "../../../../Redux/store";
import { appZIndex } from "../../../../utils/appconst";
import AdminTenantDetails from "../admin-tenant-detail/admin-tenant-detail";
import "./admin-apartment-unit-occupant.css";

export const AdminUnitOccupantComp: React.FC<{}> = () => {
  const [loadRemoveOccupantApi, setLoadRemoveOccupantApi] = useState(false);
  const [loadExtendOccupantApi, setLoadExtendOccupantApi] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [loadResetOccupantPasswordApi, setResetOccupantPasswordApi] =
    useState(false);

  const [payload, setPayload] = useState<any>({});

  const { confirm } = Modal;

  // Use to collect Site Description Change
  const handleInputChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setPayload((values) => ({ ...values, [name]: value }));
  };

  const selectedBuilding: IAdminBuildingsData = useAppSelector(
    (state: RootState) => state?.AdminSelectedBuilding
  );

  const selectedApartment: IAdminApartmentData = useAppSelector(
    (state: RootState) => state?.AdminSelectedApartment
  );

  const selectedTenant: IAdminTenantsData = useAppSelector(
    (state: RootState) => state?.AdminSelectedTenant
  );

  const selectedOccupant: IAdminOccupantData = useAppSelector(
    (state: RootState) => state?.AdminSelectedOccupant
  );
  const navigate = useNavigate();

  // Remove Occupant from Apartment
  const showRemoveOccupantApiConfirm = () => {
    confirm({
      title:
        "Are you sure you want to Remove this Occupant from this Apartment, This cannot be undone",
      icon: <ExclamationCircleFilled rev={undefined} />,
      content: "",
      centered: true,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      zIndex: appZIndex.modal,
      onOk() {
        console.log("OK");
        setLoadRemoveOccupantApi(true);
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  // A custom hook to  Remove Admin
  const removeOccupantApiResult = useFormatApiRequest(
    () => adminRemoveOccupantApi(selectedOccupant.id),
    loadRemoveOccupantApi,
    () => {
      setLoadRemoveOccupantApi(false);
    },
    () => {
      processRemoveOccupantApi();
    }
  );

  // Process The Removal
  const processRemoveOccupantApi = async () => {
    if (removeOccupantApiResult.httpState === "SUCCESS") {
      alert("This Occupant Have being removed from this apartment");
      navigate(-1);
    } else if (removeOccupantApiResult.httpState === "ERROR") {
      alert(
        removeOccupantApiResult.data?.response?.data?.message ||
          removeOccupantApiResult.errorMsg ||
          "Error"
      );
    }
  };

  // Extend Occupant from Apartment
  const showExtendOccupantApiConfirm = () => {
    confirm({
      title:
        "Are you sure you want to Extend this Occupant in this Apartment, This cannot be undone",
      icon: <ExclamationCircleFilled rev={undefined} />,
      content: "",
      centered: true,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      zIndex: appZIndex.modal,
      onOk() {
        console.log("OK");
        setLoadExtendOccupantApi(true);
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  // A custom hook to  Extend Admin
  const extendOccupantApiResult = useFormatApiRequest(
    () =>
      adminExtendOccupantApi({
        tenantId: selectedTenant.id,
        apartmentId: selectedApartment.id,
        amountPaid: selectedApartment.price,
      }),
    loadExtendOccupantApi,
    () => {
      setLoadExtendOccupantApi(false);
    },
    () => {
      processExtendOccupantApi();
    }
  );

  // Process The Extension
  const processExtendOccupantApi = async () => {
    if (extendOccupantApiResult.httpState === "SUCCESS") {
      alert("This Occupant Rent have being extended by 1 Year");
    } else if (extendOccupantApiResult.httpState === "ERROR") {
      alert(
        extendOccupantApiResult.data?.response?.data?.message ||
          extendOccupantApiResult.errorMsg ||
          "Error"
      );
    }
  };

  // Reset Occupant Password
  const showResetPasswordApiConfirm = () => {
    confirm({
      title: "Are you sure you want to reset this occupant Password",
      icon: <ExclamationCircleFilled rev={undefined} />,
      content: "",
      centered: true,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      zIndex: appZIndex.modal,
      onOk() {
        console.log("OK");
        setResetOccupantPasswordApi(true);
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  // A custom hook to  Reset Occupant Password
  const resetOccupantPasswordApiResult = useFormatApiRequest(
    () => adminUpdateTenantPasswordApi(selectedTenant.id, payload),
    loadResetOccupantPasswordApi,
    () => {
      setResetOccupantPasswordApi(false);
    },
    () => {
      processResetOccupantPasswordApi();
    }
  );

  // Process The Extension of Occupant
  const processResetOccupantPasswordApi = async () => {
    if (resetOccupantPasswordApiResult.httpState === "SUCCESS") {
      alert("This Occupant Password Have being reset");
    } else if (resetOccupantPasswordApiResult.httpState === "ERROR") {
      alert(
        resetOccupantPasswordApiResult.data?.response?.data?.message ||
          resetOccupantPasswordApiResult.errorMsg ||
          "Error"
      );
    }
  };

  // Navigate to the next Page
  const navigateToPage = async (pageName) => {
    navigate(pageName);
  };

  return (
    <>
      <div className="w3-content adminPageBody">
        {selectedApartment?.isOccupied ? (
          <>
            {/* Current Occupant Details */}
            <AdminTenantDetails></AdminTenantDetails>
          </>
        ) : (
          <div className="adminPanel adminEmpty">
            <span className="adminEmptyIcon">
              <UserAddOutlined />
            </span>
            <p className="myfont1">
              {selectedApartment?.title || "This unit"} does not have an
              occupant yet.
            </p>
            <button
              type="button"
              onClick={() => {
                navigateToPage(
                  "/admin/apartment-tenant/add/" + selectedApartment.id
                );
              }}
              className="adminBtn adminBtnPrimary"
            >
              <UserAddOutlined /> Add Occupant
            </button>
          </div>
        )}

        {/* Actions */}
        <div className="adminPanel">
          <div className="adminPanelHeader">
            <h3 className="adminPanelTitle myfont3">
              <span className="adminPanelIcon">
                <SettingOutlined />
              </span>
              Actions
            </h3>
          </div>

          <div className="adminBtnRow">
            <button
              type="button"
              onClick={() => {
                navigateToPage(
                  "/admin/apartment-tenant-history/" + selectedApartment.id
                );
              }}
              className="adminBtn"
            >
              <HistoryOutlined /> Occupant History
            </button>
            {selectedApartment?.isOccupied && (
              <>
                <button
                  type="button"
                  onClick={() => {
                    showExtendOccupantApiConfirm();
                  }}
                  className="adminBtn"
                >
                  <CalendarOutlined /> Extend Rent
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowResetPassword(!showResetPassword);
                  }}
                  className="adminBtn"
                >
                  <KeyOutlined /> Reset Password
                </button>
                <button
                  type="button"
                  onClick={() => {
                    showRemoveOccupantApiConfirm();
                  }}
                  className="adminBtn adminBtnDanger"
                >
                  <UserDeleteOutlined /> Remove Occupant
                </button>
              </>
            )}
          </div>

          {selectedApartment?.isOccupied && showResetPassword && (
            <div className="adminResetPassword">
              <label
                htmlFor="occupant-new-password"
                className="adminDetailLabel myfont1"
              >
                Set New Password
              </label>
              <div className="adminResetPasswordRow">
                <input
                  id="occupant-new-password"
                  required
                  name="password"
                  value={payload?.password || ""}
                  onChange={handleInputChange}
                  className="w3-input w3-text-white adminInput"
                  placeholder="New password"
                  type="password"
                />
                <button
                  type="button"
                  onClick={() => {
                    showResetPasswordApiConfirm();
                  }}
                  className="adminBtn adminBtnPrimary"
                >
                  Save Password
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminUnitOccupantComp;
