import { LoadingOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useFormatApiRequest from "../../../../hooks/formatApiRequest";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../../Redux/reduxCustomHook";
import PaystackPop from "@paystack/inline-js";
import { RootState } from "../../../../Redux/store";
import "./tenantPayment.css";
import {
  ITenantBuildingsData,
  ITenantApartmentData,
  ITenantRegistrationData,
  ITenantPaymentResult,
  ITenantRentPaymentDetailsApi,
  IUserSettingsData,
} from "../../../../apiservice/tenant-general-apiService.type.";
import {
  tenantGetSettingsApi,
  tenantRentPaymentApi,
  tenantRentPaymentDetailsApi,
} from "../../../../apiservice/tenant-general-apiService";
import { formatCurrency } from "../../../../utils/basic.utils";
import { ILoadState } from "../../../../utils/loading.utils.";
import { Spin, Result, Button, Empty } from "antd";

export const TenantPaymentForm: React.FC<{}> = () => {
  const [loadApi, setLoadApi] = useState(false);
  const [payLoad, setpayLoad] = useState<any>({});
  const [formLoading, setFormLoading] = useState<boolean>(false);
  const [agreePayment, setAgreePayment] = useState<boolean>(false);

  const [rentPaymentDetailsLoadState, setRentPaymentDetailsLoadState] =
    useState<ILoadState>("loading");

  const [loadRentPaymentDetails, setLoadRentPaymentDetails] = useState(true);

  const [tenantPaymentResultData, setTenantPaymentResultData] =
    useState<ITenantPaymentResult | null>(null);

  // For Navigator/Redux
  const selectedBuilding: ITenantBuildingsData = useAppSelector(
    (state: RootState) => state?.TenantSelectedBuilding
  );

  const selectedApartment: ITenantApartmentData = useAppSelector(
    (state: RootState) => state?.TenantSelectedApartment
  );

  const tenantRegistrationData: ITenantRegistrationData = useAppSelector(
    (state: RootState) => state?.TenantRegistrationResultData
  );

  const userSettingsData: IUserSettingsData = useAppSelector(
    (state: RootState) => state?.TenantSettingsData
  );

  const [rentPrice, setrentPrice] = useState<number>(selectedApartment?.price);
  const [cautionPrice, setCautionPrice] = useState<number>(0);
  const [legalPrice, setLegalPrice] = useState<number>(0);

  const [servicePrice, setServicePrice] = useState<number>(0);
  const [totalPrice, settotalPrice] = useState<number>(0);

  const params = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // useEffect(() => {
  //   setrentPrice(selectedApartment?.price);
  //   setCautionPrice(selectedApartment?.price * 0.1);
  //   setLegalPrice(selectedApartment?.price * 0.1);
  //   setServicePrice(selectedApartment?.price * 0.1);
  //   settotalPrice(
  //     Number(rentPrice) +
  //       Number(legalPrice) +
  //       Number(cautionPrice) +
  //       Number(servicePrice)
  //   );
  // }, []);

  const fetchSettings = async () => {
    try {
      const response = await tenantGetSettingsApi();
      dispatch({
        type: "USER_ADD_SETTINGS",
        payload: response?.data || {},
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  // Load The Rengt Payment Details
  const rentPaymentDetailsDataResult = useFormatApiRequest(
    () =>
      tenantRentPaymentDetailsApi(tenantRegistrationData.token, {
        apartmentId: selectedApartment.id || 1,
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

      settotalPrice(result?.data?.total);
      setCautionPrice(
        result?.data?.details["Caution Fee"] || selectedApartment?.price * 0.1
      );

      setLegalPrice(
        result?.data?.details["Legal Fee"] || selectedApartment?.price * 0.1
      );

      setServicePrice(
        result?.data?.details["Service Charge"] ||
          selectedApartment?.price * 0.1
      );
      setRentPaymentDetailsLoadState("completed");
    } else if (rentPaymentDetailsDataResult.httpState === "ERROR") {
      setRentPaymentDetailsLoadState("error");
    } else if (rentPaymentDetailsDataResult.httpState === "LOADING") {
      setRentPaymentDetailsLoadState("loading");
    }
  };

  // Use to collect Input change Change
  const handleInputChange = (event: any) => {
    const name = event.target.name;
    const value =
      name === "agreePayment" ? event.target.checked : event.target.value;
    setpayLoad((values: any) => ({ ...values, [name]: value }));
    console.log(event.target.checked);
  };

  // Use to Submit Form
  const handleSubmit = (event: any) => {
    event.preventDefault();
    if (!payLoad.agreePayment) {
      alert("Please Agree That you accept the tenant Agreement.");
      return;
    }
    setLoadApi(true);
    setFormLoading(true);
  };

  // A custom hook to save form data
  const result = useFormatApiRequest(
    () =>
      tenantRentPaymentApi(tenantRegistrationData.token, {
        amount: totalPrice,
        apartmentId: selectedApartment.id || params?.id || 0,
      }),
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
      setTenantPaymentResultData(result.data);
      // console.log(result.data);

      // payWithPayStack(result.data?.paystackMetadata);

      alert("Your Payment is under review, Thank you");
      navigate("/");

      // Handle Success Here
    } else if (result.httpState === "ERROR") {
      setFormLoading(false);
      alert(result.data?.response?.data?.message || result.errorMsg);
      //Handle Error Here
    }
  };

  const payWithPayStack = (meta: any) => {
    const paystack = new PaystackPop();
    // console.log(meta);
    paystack.newTransaction({
      key: process.env.REACT_APP_PAYSTACK_PK,
      email:
        tenantRegistrationData.credentials.email ||
        "annonymouslinkmie@gmail.com",
      amount: totalPrice * 100 || 0,
      currency: "NGN",
      metadata: meta || {},
      onSuccess: (transaction) => {
        alert("Your Payment was succesful, Thank you.");
        navigate("/");
      },
      onCancel: () => {
        console.log("Pop Up closed");
        alert("Sorry we could not process your payment");
      },
    });
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
          <div className="w3-container">
            <div className="w3-content">
              <form onSubmit={handleSubmit}>
                {/* Forms Here */}
                <div className="w3-col">
                  {/* Pre Form Text */}
                  <div className="w3-col w3-margin-bottom">
                    <p className="w3-text-white w3-center">
                      <b>{`${selectedBuilding.title} - ${selectedApartment.title}`}</b>
                    </p>
                    <p className="w3-text-white regPreFormText myfont1">
                      {selectedBuilding.description}
                    </p>
                  </div>

                  <div className="w3-col w3-margin-bottom">
                    <p>
                      <input
                        name="agreePayment"
                        onChange={handleInputChange}
                        className="w3-check"
                        type="checkbox"
                        value={payLoad?.agreePayment || false}
                      />
                      <span className="w3-text-white regPreFormText myfont1">
                        &nbsp; Click box to agree to the above tenance
                      </span>
                    </p>
                    <p>
                      <br />
                      <span className="agreementBtn w3-round-large">
                        <a
                          href={
                            tenantRegistrationData.credentials.agreementFormUrl
                          }
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

                  <div className="w3-col w3-margin-bottom">
                    <h2 className="w3-col myfont1 w3-medium w3-text-white">
                      Payment Summary
                    </h2>
                    <br /> <br />
                    <span className="w3-text-yellow  w3-col myfont1 amountToPayText">
                      Rent
                    </span>
                    <br />
                    <p className=" w3-text-white w3-col myfont1">
                      {" "}
                      {formatCurrency(rentPrice || 0)}{" "}
                    </p>
                    <br /> <br />
                    <span className="w3-text-yellow   w3-col myfont1 amountToPayText">
                      Legal Fees
                    </span>
                    <br />
                    <p className="w3-text-white w3-col myfont1">
                      {" "}
                      {formatCurrency(legalPrice || 0)}{" "}
                    </p>
                    <br /> <br />
                    <span className="w3-text-yellow  w3-col myfont1 amountToPayText">
                      Caution Fees
                    </span>
                    <br />
                    <p className="w3-text-white w3-col myfont1">
                      {" "}
                      {formatCurrency(cautionPrice || 0)}{" "}
                    </p>
                  </div>

                  <div className="w3-col w3-margin-bottom">
                    <span className="w3-text-yellow  w3-col myfont1 amountToPayText">
                      Service Fees
                    </span>
                    <br />
                    <p className="w3-text-white w3-col myfont1">
                      {" "}
                      {formatCurrency(servicePrice || 0)}{" "}
                    </p>
                  </div>

                  {/* Amount To Pay */}
                  <div className="w3-col w3-margin-bottom">
                    <div className="w3-col l12 s12 m12">
                      <span className="w3-text-yellow   w3-col myfont1 amountToPayText">
                        Total Amount to Pay
                      </span>
                      <br />
                      <input
                        required
                        name="amountToPay"
                        readOnly
                        value={formatCurrency(totalPrice || 0)}
                        className="w3-input w3-border w3-col w3-text-white w3-round-large w3-border-yellow regFormInputPayment"
                        placeholder="Amount To Pay"
                      />
                    </div>
                  </div>
                </div>

                <div className="w3-col w3-margin-bottom w3-text-white">
                  <div className="w3-card w3-round w3-padding bankAccountBg w3-border">
                    <h2 className="w3-large">
                      {" "}
                      <b> Account Details </b>
                    </h2>
                    <br />
                    <p> Bank Name : {userSettingsData?.bankName} </p>
                    <br />
                    <p> Account Name : {userSettingsData?.accountName} </p>
                    <br />
                    <p> Account Number : {userSettingsData?.accountNumber} </p>
                    <br />
                  </div>
                </div>

                {/* Button Here */}

                <div className="w3-col w3-margin-bottom">
                  <button
                    className="w3-btn regButton w3-col w3-round-large"
                    disabled={formLoading || !payLoad.agreePayment}
                  >
                    {!formLoading ? (
                      "I have Made Payment"
                    ) : (
                      <LoadingOutlined rev={undefined} />
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default TenantPaymentForm;
