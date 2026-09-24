import {
  BankOutlined,
  CheckOutlined,
  CopyOutlined,
  FileTextOutlined,
  LoadingOutlined,
  WalletOutlined,
} from "@ant-design/icons";
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
  const [copiedField, setCopiedField] = useState<string>("");

  const [rentPaymentDetailsLoadState, setRentPaymentDetailsLoadState] =
    useState<ILoadState>("loading");

  const [loadRentPaymentDetails, setLoadRentPaymentDetails] = useState(true);

  const [tenantPaymentResultData, setTenantPaymentResultData] =
    useState<ITenantPaymentResult | null>(null);

  // For Navigator/Redux
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

  // Keep the rent in sync (the apartment may be reloaded after a refresh)
  useEffect(() => {
    if (selectedApartment?.price) setrentPrice(selectedApartment.price);
  }, [selectedApartment?.price]);

  // Load The Rengt Payment Details
  const rentPaymentDetailsDataResult = useFormatApiRequest(
    () =>
      tenantRentPaymentDetailsApi(tenantRegistrationData?.token, {
        apartmentId: selectedApartment.id || params?.id || 1,
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
  };

  // Copy bank details to the clipboard
  const copyToClipboard = async (field: string, value?: string | number) => {
    if (value === undefined || value === null || value === "") return;
    try {
      await navigator.clipboard.writeText(String(value));
      setCopiedField(field);
      setTimeout(() => setCopiedField(""), 2000);
    } catch (error) {
      console.error("Could not copy:", error);
    }
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
      tenantRentPaymentApi(tenantRegistrationData?.token, {
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
    paystack.newTransaction({
      key: process.env.REACT_APP_PAYSTACK_PK,
      email:
        tenantRegistrationData?.credentials?.email ||
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

  const paymentLines = [
    { label: "Rent", value: rentPrice },
    { label: "Legal Fee", value: legalPrice },
    { label: "Caution Fee", value: cautionPrice },
    { label: "Service Charge", value: servicePrice },
  ];

  const bankDetails = [
    { key: "bankName", label: "Bank Name", value: userSettingsData?.bankName },
    {
      key: "accountName",
      label: "Account Name",
      value: userSettingsData?.accountName,
    },
    {
      key: "accountNumber",
      label: "Account Number",
      value: userSettingsData?.accountNumber,
      copy: true,
    },
  ];

  const agreementUrl = tenantRegistrationData?.credentials?.agreementFormUrl;

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

        {/* " Show Payment Form" */}
        {rentPaymentDetailsLoadState === "completed" && (
          <div className="w3-container">
            <div className="w3-content payFormWrapper">
              <form onSubmit={handleSubmit}>
                <div className="payGrid">
                  {/* Payment Summary */}
                  <section className="paySection">
                    <div className="paySectionHeader">
                      <span className="paySectionIcon">
                        <WalletOutlined />
                      </span>
                      <div>
                        <h3 className="paySectionTitle myfont3">
                          Payment Summary
                        </h3>
                        <p className="paySectionHint myfont1">
                          Breakdown of what you are paying for.
                        </p>
                      </div>
                    </div>

                    <div className="payLines">
                      {paymentLines.map((line) => (
                        <div className="payLine myfont1" key={line.label}>
                          <span className="payLineLabel">{line.label}</span>
                          <span className="payLineValue">
                            {formatCurrency(line.value || 0)}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="payTotal">
                      <span className="payTotalLabel myfont1">
                        Total Amount to Pay
                      </span>
                      <span className="payTotalValue myfont5">
                        {formatCurrency(totalPrice || 0)}
                      </span>
                    </div>
                  </section>

                  {/* Bank Transfer Details */}
                  <section className="paySection">
                    <div className="paySectionHeader">
                      <span className="paySectionIcon">
                        <BankOutlined />
                      </span>
                      <div>
                        <h3 className="paySectionTitle myfont3">
                          Pay by Bank Transfer
                        </h3>
                        <p className="paySectionHint myfont1">
                          Transfer the total amount to the account below.
                        </p>
                      </div>
                    </div>

                    <div className="payBankList">
                      {bankDetails.map((detail) => (
                        <div className="payBankRow" key={detail.key}>
                          <div className="payBankText">
                            <span className="payBankLabel myfont1">
                              {detail.label}
                            </span>
                            <span className="payBankValue myfont3">
                              {detail.value || "-"}
                            </span>
                          </div>
                          {detail.copy && detail.value && (
                            <button
                              type="button"
                              className="payCopyBtn myfont1"
                              onClick={() =>
                                copyToClipboard(detail.key, detail.value)
                              }
                            >
                              {copiedField === detail.key ? (
                                <>
                                  <CheckOutlined /> Copied
                                </>
                              ) : (
                                <>
                                  <CopyOutlined /> Copy
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      ))}
                      <div className="payBankRow payBankAmount">
                        <div className="payBankText">
                          <span className="payBankLabel myfont1">
                            Amount
                          </span>
                          <span className="payBankValue myfont3">
                            {formatCurrency(totalPrice || 0)}
                          </span>
                        </div>
                        <button
                          type="button"
                          className="payCopyBtn myfont1"
                          onClick={() => copyToClipboard("amount", totalPrice)}
                        >
                          {copiedField === "amount" ? (
                            <>
                              <CheckOutlined /> Copied
                            </>
                          ) : (
                            <>
                              <CopyOutlined /> Copy
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </section>
                </div>

                {/* Tenancy Agreement */}
                <section className="paySection">
                  <div className="paySectionHeader">
                    <span className="paySectionIcon">
                      <FileTextOutlined />
                    </span>
                    <div>
                      <h3 className="paySectionTitle myfont3">
                        Tenancy Agreement
                      </h3>
                      <p className="paySectionHint myfont1">
                        Please read the agreement before confirming payment.
                      </p>
                    </div>
                  </div>

                  <div className="payAgreement">
                    {agreementUrl && (
                      <a
                        href={agreementUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="payAgreementBtn myfont1"
                      >
                        <FileTextOutlined /> Download Agreement
                      </a>
                    )}

                    <label className="payCheck myfont1">
                      <input
                        name="agreePayment"
                        type="checkbox"
                        checked={!!payLoad?.agreePayment}
                        onChange={handleInputChange}
                      />
                      <span className="payCheckBox" aria-hidden="true">
                        <CheckOutlined />
                      </span>
                      <span>
                        I have read and agree to the tenancy agreement.
                      </span>
                    </label>
                  </div>
                </section>

                {/* Button Here */}
                <div className="w3-col payButtonSpace">
                  <br />
                </div>

                <div className="w3-padding payButtonHolder">
                  <div className="w3-content">
                    <button
                      className="w3-btn payButton w3-col w3-round-large myfont3"
                      disabled={formLoading || !payLoad.agreePayment}
                    >
                      {!formLoading ? (
                        "I have Made Payment"
                      ) : (
                        <LoadingOutlined rev={undefined} />
                      )}
                    </button>
                  </div>
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
