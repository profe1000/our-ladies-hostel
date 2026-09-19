import { ExclamationCircleFilled } from "@ant-design/icons";
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
      <div className="w3-content">
        <div className="w3-container">
          <div className="w3-col  w3-padding adminOccupantCard w3-round-large w3-margin-bottom  w3-margin-top">
            <div className="w3-col w3-margin-bottom w3-margin-top w3-bottombar">
              <h3 className="w3-medium myfont1">
                <b>
                  {" "}
                  {selectedBuilding.title}, {selectedApartment.title} - Occupant{" "}
                </b>
              </h3>
            </div>
          </div>
        </div>
        {selectedApartment?.isOccupied ? (
          <>
            {/* Form Header */}
            <AdminTenantDetails></AdminTenantDetails>
          </>
        ) : (
          <div className="w3-container">
            <div className="w3-col  w3-padding adminOccupantCard w3-center w3-round-large w3-margin-bottom  w3-margin-top">
              <p className="w3-margin-top">
                This Unit do not have any occupant
              </p>
              <p className="w3-margin-top w3-margin-bottom">
                <button
                  onClick={() => {
                    navigateToPage(
                      "/admin/apartment-tenant/add/" + selectedApartment.id
                    );
                  }}
                  className="w3-btn  w3-round-large myfont1 w3-small editOccupantBtn"
                >
                  Add Occupant
                </button>{" "}
              </p>
            </div>
          </div>
        )}

        <div className="w3-container">
          <div className="w3-col  w3-padding adminOccupantCard w3-round-large w3-margin-bottom  w3-margin-top">
            <p className="w3-margin-top">Action</p>
            <p className="w3-margin-top w3-margin-bottom">
              <button
                onClick={() => {
                  navigateToPage(
                    "/admin/apartment-tenant-history/" + selectedApartment.id
                  );
                }}
                className="w3-btn w3-margin-top   w3-round-large myfont1 w3-small editOccupantBtn"
              >
                Occupant History
              </button>{" "}
              {selectedApartment?.isOccupied ? (
                <>
                  &nbsp;
                  <button
                    onClick={() => {
                      showRemoveOccupantApiConfirm();
                    }}
                    className="w3-btn w3-margin-top  w3-round-large myfont1 w3-small editOccupantBtn"
                  >
                    Remove Occupant
                  </button>
                  &nbsp;
                  <button
                    onClick={() => {
                      showExtendOccupantApiConfirm();
                    }}
                    className="w3-btn w3-margin-top  w3-round-large myfont1 w3-small editOccupantBtn"
                  >
                    Extend Rent
                  </button>
                  &nbsp;
                  <button
                    onClick={() => {
                      setShowResetPassword(true);
                    }}
                    className="w3-btn w3-margin-top  w3-round-large myfont1 w3-small editOccupantBtn"
                  >
                    Reset Password
                  </button>
                  {showResetPassword && (
                    <div className="w3-col w3-margin-top">
                      Set New Password <br />
                      <div className="w3-col w3-margin-bottom">
                        <div className="w3-col l12 s12 m12 w3-margin-top">
                          <input
                            required
                            name="password"
                            value={payload?.password || ""}
                            onChange={handleInputChange}
                            className="w3-input w3-border w3-col w3-text-white w3-round-large regFormInput"
                            placeholder="Password (Optional)"
                            type="password"
                          />
                        </div>{" "}
                        <br />
                      </div>
                      <button
                        onClick={() => {
                          showResetPasswordApiConfirm();
                        }}
                        className="w3-btn w3-margin-top  w3-round-large myfont1 w3-small editOccupantBtn"
                      >
                        Set New Password
                      </button>
                    </div>
                  )}
                </>
              ) : (
                ""
              )}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminUnitOccupantComp;
