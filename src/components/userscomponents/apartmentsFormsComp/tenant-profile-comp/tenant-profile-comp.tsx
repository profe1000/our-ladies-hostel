import { ExclamationCircleFilled } from "@ant-design/icons";
import { Button, Empty, Modal, Result, Spin } from "antd";
import { useState } from "react";
import { IAuthType } from "../../../../apiservice/authService.type";
import {
  tenantRentPaymentApi,
  tenantRentPaymentDetailsApi,
} from "../../../../apiservice/tenant-general-apiService";
import {
  ITenantPaymentResult,
  ITenantRentPaymentDetailsApi,
} from "../../../../apiservice/tenant-general-apiService.type.";
import useFormatApiRequest from "../../../../hooks/formatApiRequest";
import { useAppSelector } from "../../../../Redux/reduxCustomHook";
import { RootState } from "../../../../Redux/store";
import { appZIndex } from "../../../../utils/appconst";
import PaystackPop from "@paystack/inline-js";
import "./tenant-profile-comp.css";
import { useNavigate } from "react-router";
import { convertToShortDate } from "../../../../utils/date.utils";
import { ILoadState } from "../../../../utils/loading.utils.";
import { formatCurrency } from "../../../../utils/basic.utils";

export const TenantProfileComp: React.FC<{}> = () => {
  const authData: IAuthType = useAppSelector(
    (state: RootState) => state?.AuthData
  );
  const [loadExtendOccupantApi, setLoadExtendOccupantApi] = useState(false);
  const [nextPaymentAmount, setNextPaymentAmount] = useState(1000000);
  const [currentApartmentId, setCurrentApartmentId] = useState(1);

  const [rentPaymentDetailsLoadState, setRentPaymentDetailsLoadState] =
    useState<ILoadState>("loading");
  const [loadRentPaymentDetails, setLoadRentPaymentDetails] = useState(true);

  const [rentPrice, setrentPrice] = useState<number>(0);
  const [servicePrice, setServicePrice] = useState<number>(0);
  const [totalPrice, settotalPrice] = useState<number>(0);

  const navigate = useNavigate();

  const [tenantPaymentResultData, setTenantPaymentResultData] =
    useState<ITenantPaymentResult | null>(null);

  const { confirm } = Modal;

  // Load The Rengt Payment Details
  const rentPaymentDetailsDataResult = useFormatApiRequest(
    () =>
      tenantRentPaymentDetailsApi(authData.data?.token || "", {
        apartmentId:
          authData.data?.credentials?.activeOccupant?.apartmentId || 0,
      }),
    loadRentPaymentDetails,
    () => {
      setLoadRentPaymentDetails(false);
    },
    () => {
      processRentPaymentDetailsResult();
    }
  );

  // Process The Current Rent Payment Details Result
  const processRentPaymentDetailsResult = async () => {
    if (rentPaymentDetailsDataResult.httpState === "SUCCESS") {
      const result: ITenantRentPaymentDetailsApi =
        rentPaymentDetailsDataResult.data;

      setrentPrice(result?.data?.details["Apartment Price"] || 0);
      setServicePrice(result?.data?.details["Service Charge"] || 0);
      settotalPrice(result?.data?.total);

      setRentPaymentDetailsLoadState("completed");
    } else if (rentPaymentDetailsDataResult.httpState === "ERROR") {
      setRentPaymentDetailsLoadState("error");
    } else if (rentPaymentDetailsDataResult.httpState === "LOADING") {
      setRentPaymentDetailsLoadState("loading");
    }
  };

  // Extend Occupant from Apartment
  const showExtendOccupantApiConfirm = () => {
    confirm({
      title: "Are you sure you want to Renew Your Rent",
      icon: <ExclamationCircleFilled rev={undefined} />,
      content: "",
      centered: true,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      zIndex: appZIndex.modal,
      onOk() {
        console.log("OK");
        setCurrentApartmentId(
          authData.data?.credentials?.activeOccupant?.apartmentId || 0
        );

        // This should be replace with what The Backend set as next rent payment
        setNextPaymentAmount(totalPrice);
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
      tenantRentPaymentApi(authData.data?.token || "", {
        amount: nextPaymentAmount,
        apartmentId: currentApartmentId,
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
      setTenantPaymentResultData(extendOccupantApiResult.data);
      payWithPayStack();
    } else if (extendOccupantApiResult.httpState === "ERROR") {
      alert(
        extendOccupantApiResult.data?.response?.data?.message ||
          extendOccupantApiResult.errorMsg ||
          "Error"
      );
    }
  };

  const payWithPayStack = () => {
    const paystack = new PaystackPop();
    paystack.newTransaction({
      key: process.env.REACT_APP_PAYSTACK_PK,
      email: authData.data?.credentials?.email || "annonymouslinkmie@gmail.com",
      amount: nextPaymentAmount * 100 || 0,
      currency: "NGN",
      metadata: tenantPaymentResultData?.paystackMetadata || {},
      onSuccess: (transaction) => {
        alert("Your Rent Payment is successful");
      },
      onCancel: () => {
        console.log("Pop Up closed");
        alert("Sorry we could not process your payment");
      },
    });
  };

  // Navigate to the next Page
  const navigateToPage = async (page: string) => {
    navigate(page, { replace: true });
  };

  return (
    <>
      <div>
        {/* " Show Loading Indicator" */}
        {rentPaymentDetailsLoadState === "loading" && (
          <div
            className="w3-col w3-center w3-padding-bottom"
            style={{ paddingTop: "100px" }}
          >
            <Spin size="large" />
          </div>
        )}

        {/* " Show Loading Error" */}
        {rentPaymentDetailsLoadState === "error" && (
          <div className="w3-col w3-padding-bottom">
            <Result
              status="500"
              title={<span className="w3-text-white">Error</span>}
              subTitle={
                <span className="w3-text-white">
                  Sorry, something went wrong, it could be a network Related
                  error
                </span>
              }
              extra={
                <Button
                  onClick={() => setLoadRentPaymentDetails(true)}
                  type="primary"
                >
                  Reload
                </Button>
              }
            />
          </div>
        )}

        {/* " Show No data" */}
        {rentPaymentDetailsLoadState === "noData" && (
          <div className="w3-margin-top">
            <Empty></Empty>
          </div>
        )}

        {/* " Show No data" */}
        {rentPaymentDetailsLoadState === "completed" && (
          <>
            {" "}
            <div className="w3-container">
              <div className="w3-col  profileCard w3-padding adminOccupantCard w3-round-large w3-margin-bottom  w3-margin-top">
                {/* FullName */}
                <div className="w3-col w3-margin-bottom  w3-border-bottom profileBorder">
                  <p className="w3-small myfont1">FULLNAME</p>
                  <p>
                    <b className="myfont1 normaliseCap">
                      {" "}
                      {authData.data?.credentials.fullName}
                    </b>
                  </p>
                </div>

                {/* Phone Number*/}
                <div className="w3-col w3-margin-bottom  w3-border-bottom profileBorder">
                  <p className="w3-small myfont1">PHONE NUMBER</p>
                  <p>
                    <b className="myfont1 normaliseCap">
                      {authData.data?.credentials.phoneNumber}
                    </b>
                  </p>
                </div>

                {/* Email */}
                <div className="w3-col w3-margin-bottom  w3-border-bottom profileBorder">
                  <p className="w3-small myfont1">EMAIL</p>
                  <p>
                    <b className="myfont1">
                      {" "}
                      {authData.data?.credentials.email}
                    </b>
                  </p>
                </div>

                {/* Rent*/}
                <div className="w3-col w3-margin-bottom  w3-border-bottom profileBorder">
                  <p className="w3-small myfont1">Rent Active </p>
                  <p>
                    <b className="myfont1 w3-text-green normaliseCap">
                      {authData.data?.credentials.activeOccupant?.active + ""}
                    </b>
                  </p>
                </div>

                {/* Last Rent Payment */}
                <div className="w3-col w3-margin-bottom  w3-border-bottom profileBorder">
                  <p className="w3-small myfont1 normaliseCap">
                    Last Rent Payment{" "}
                  </p>
                  <p>
                    <b className="myfont1">
                      {convertToShortDate(
                        authData.data?.credentials.activeOccupant?.startDate ||
                          ""
                      )}
                    </b>
                  </p>
                </div>

                {/* Next Rent Payment */}
                <div className="w3-col w3-margin-bottom  w3-border-bottom profileBorder">
                  <p className="w3-small myfont1">Next Rent Payment </p>
                  <p>
                    <b className="myfont1 w3-text-red normaliseCap">
                      {convertToShortDate(
                        authData.data?.credentials.activeOccupant?.endDate || ""
                      )}
                    </b>
                  </p>
                </div>

                {/* Rent*/}
                <div className="w3-col w3-margin-bottom  w3-border-bottom profileBorder">
                  <p className="w3-small myfont1">Next Rent Amount </p>
                  <p>
                    <b className="myfont1 w3-text-green normaliseCap">
                      {formatCurrency(rentPrice) + ""}
                    </b>
                  </p>
                </div>

                {/* Service Charge */}
                <div className="w3-col w3-margin-bottom  w3-border-bottom profileBorder">
                  <p className="w3-small myfont1">
                    Next Service Charge Amount{" "}
                  </p>
                  <p>
                    <b className="myfont1 w3-text-green normaliseCap">
                      {formatCurrency(servicePrice) + ""}
                    </b>
                  </p>
                </div>

                <div className="w3-col w3-margin-bottom  w3-border-bottom profileBorder">
                  <p className="w3-small myfont1">Agreement Form</p>
                  <p>
                    <span className="agreementBtn w3-round-large">
                      <a
                        href={authData.data?.credentials.agreementFormUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="w3-text-white"
                        style={{ textDecoration: "none" }}
                      >
                        DownLoad Agreement
                      </a>
                    </span>
                  </p>
                </div>
              </div>
            </div>
            <div className="w3-container">
              <div className="w3-col  profileCard w3-padding adminOccupantCard w3-round-large w3-margin-bottom  w3-margin-top">
                <button
                  onClick={() => {
                    showExtendOccupantApiConfirm();
                  }}
                  className="w3-btn w3-margin-top  w3-round-large myfont1 w3-small editOccupantBtn"
                >
                  Renew Rent
                </button>
                &nbsp; &nbsp;
                <button
                  onClick={() => {
                    navigateToPage("/users/changePassword");
                  }}
                  className="w3-btn w3-margin-top  w3-round-large myfont1 w3-small editOccupantBtn"
                >
                  Change Password
                </button>
                &nbsp; &nbsp;
                <button
                  onClick={() => {
                    navigateToPage("/auth");
                  }}
                  className="w3-btn w3-margin-top  w3-round-large myfont1 w3-small editOccupantBtn"
                >
                  Logout
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default TenantProfileComp;
