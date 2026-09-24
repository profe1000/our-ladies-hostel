import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  BankOutlined,
  CheckOutlined,
  CopyOutlined,
  CreditCardOutlined,
  HomeOutlined,
  LoadingOutlined,
  WalletOutlined,
} from "@ant-design/icons";
import { Button, Result, Spin } from "antd";
import PaystackPop from "@paystack/inline-js";
import TopBar from "../../../components/LayoutComponent/TopBar/topBar";
import {
  tenantGetPaymentLinkApi,
  tenantPaymentLinkTransferNoticeApi,
} from "../../../apiservice/tenant-general-apiService";
import { ITenantPaymentLinkData } from "../../../apiservice/tenant-general-apiService.type.";
import { formatCurrency } from "../../../utils/basic.utils";
import { ILoadState } from "../../../utils/loading.utils.";
// Shares the summary card and payment styles with the registration/payment pages
import "../UserRegistrationForm/UserRegistrationForm.css";
import "../../../components/userscomponents/apartmentsFormsComp/paymentForms/tenantPayment.css";
import "./PaymentLinkPage.css";

// Paystack confirms payments to the server a few seconds after the popup closes
const CONFIRM_POLL_MS = 3000;
const CONFIRM_POLL_ATTEMPTS = 10;

export const PaymentLinkPage = () => {
  const { token = "" } = useParams();
  const [payment, setPayment] = useState<ITenantPaymentLinkData | null>(null);
  const [loadState, setLoadState] = useState<ILoadState>("loading");
  const [confirming, setConfirming] = useState(false);
  const [sendingNotice, setSendingNotice] = useState(false);
  const [noticeSent, setNoticeSent] = useState(false);
  const [copiedField, setCopiedField] = useState("");

  const loadPayment = useCallback(async () => {
    try {
      const result = await tenantGetPaymentLinkApi(token);
      setPayment(result.data);
      setLoadState("completed");
      return result.data;
    } catch (error: any) {
      setLoadState(error?.response?.status === 404 ? "noData" : "error");
      return null;
    }
  }, [token]);

  useEffect(() => {
    loadPayment();
  }, [loadPayment]);

  // Wait for the Paystack webhook to mark the payment as accepted
  const waitForConfirmation = async () => {
    setConfirming(true);
    for (let attempt = 0; attempt < CONFIRM_POLL_ATTEMPTS; attempt++) {
      await new Promise((resolve) => setTimeout(resolve, CONFIRM_POLL_MS));
      const latest = await loadPayment();
      if (latest?.paymentStatus === "Accepted") break;
    }
    setConfirming(false);
  };

  const payWithPaystack = () => {
    if (!payment) return;
    const paystack = new PaystackPop();
    paystack.newTransaction({
      key: process.env.REACT_APP_PAYSTACK_PK,
      email: payment.tenant.email,
      amount: Math.round(payment.amount * 100),
      currency: "NGN",
      metadata: payment.paystackMetadata,
      onSuccess: () => {
        waitForConfirmation();
      },
      onCancel: () => {
        alert("Payment was not completed. You can try again at any time.");
      },
    });
  };

  const sendTransferNotice = async () => {
    setSendingNotice(true);
    try {
      await tenantPaymentLinkTransferNoticeApi(token);
      setNoticeSent(true);
    } catch (error: any) {
      alert(
        error?.response?.data?.message ||
          "Sorry, we could not send your notice. Please try again."
      );
    } finally {
      setSendingNotice(false);
    }
  };

  const copyToClipboard = async (field: string, value?: string) => {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      setCopiedField(field);
      setTimeout(() => setCopiedField(""), 2000);
    } catch (error) {
      console.error("Could not copy:", error);
    }
  };

  if (loadState === "loading") {
    return (
      <>
        <TopBar />
        <div className="w3-center payLinkLoading">
          <Spin size="large" />
        </div>
      </>
    );
  }

  if (loadState !== "completed" || !payment) {
    return (
      <>
        <TopBar />
        <Result
          status={loadState === "noData" ? "404" : "500"}
          title={
            <span className="w3-text-white">
              {loadState === "noData" ? "Payment link not found" : "Error"}
            </span>
          }
          subTitle={
            <span className="w3-text-white">
              {loadState === "noData"
                ? "Please check the link in your email."
                : "Sorry, something went wrong. It could be a network error."}
            </span>
          }
          extra={
            loadState !== "noData" && (
              <Button type="primary" onClick={() => loadPayment()}>
                Reload
              </Button>
            )
          }
        />
      </>
    );
  }

  const building = payment.apartment?.building;
  const isPaid = payment.paymentStatus === "Accepted";
  const isRejected = payment.paymentStatus === "Rejected";

  const paymentLines = [
    { label: "Rent", value: payment.rent },
    ...payment.charges.map((charge) => ({
      label: charge.title,
      value: charge.amount,
    })),
    { label: "Service Charge", value: payment.serviceCharge },
  ];

  const bankDetails = [
    { key: "bankName", label: "Bank Name", value: payment.bankAccount?.bankName },
    {
      key: "accountName",
      label: "Account Name",
      value: payment.bankAccount?.accountName,
    },
    {
      key: "accountNumber",
      label: "Account Number",
      value: payment.bankAccount?.accountNumber,
      copy: true,
    },
  ];

  return (
    <>
      <TopBar />

      <div className="w3-content regPageWrapper">
        {/* Apartment & Building */}
        <div className="regSummaryCard">
          {building?.imageUrl && (
            <img
              className="regSummaryImage"
              src={building.imageUrl}
              alt={building.title || "Building"}
            />
          )}
          <div className="regSummaryContent">
            <span className="regSummaryEyebrow myfont1">
              Hello {payment.tenant.firstName || payment.tenant.fullName}, you
              are paying for
            </span>
            <h2 className="regSummaryTitle myfont5">
              {payment.apartment?.title}
            </h2>
            {building && (
              <p className="regSummaryBuilding myfont1">
                <HomeOutlined /> {building.title}
              </p>
            )}
            {building?.description && (
              <p className="regSummaryText myfont1">{building.description}</p>
            )}
          </div>
        </div>
      </div>

      <div className="w3-container">
        <div className="w3-content payFormWrapper">
          {/* Payment status */}
          {(isPaid || isRejected || confirming) && (
            <div
              className={`payLinkStatus myfont1 ${
                isPaid
                  ? "payLinkStatusPaid"
                  : isRejected
                  ? "payLinkStatusRejected"
                  : ""
              }`}
            >
              {isPaid && (
                <>
                  <CheckOutlined /> Your payment has been confirmed. Your login
                  details have been sent to {payment.tenant.email}.
                </>
              )}
              {isRejected && (
                <>This payment was declined. Please contact us for help.</>
              )}
              {!isPaid && !isRejected && confirming && (
                <>
                  <LoadingOutlined /> Payment received. Confirming it with
                  Paystack...
                </>
              )}
            </div>
          )}

          <div className="payGrid">
            {/* Payment Summary */}
            <section className="paySection">
              <div className="paySectionHeader">
                <span className="paySectionIcon">
                  <WalletOutlined />
                </span>
                <div>
                  <h3 className="paySectionTitle myfont3">Payment Summary</h3>
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
                  {isPaid ? "Total Paid" : "Total Amount to Pay"}
                </span>
                <span className="payTotalValue myfont5">
                  {formatCurrency(payment.amount || 0)}
                </span>
              </div>
            </section>

            {/* Pay online */}
            {!isPaid && !isRejected && (
              <section className="paySection">
                <div className="paySectionHeader">
                  <span className="paySectionIcon">
                    <CreditCardOutlined />
                  </span>
                  <div>
                    <h3 className="paySectionTitle myfont3">Pay Online</h3>
                    <p className="paySectionHint myfont1">
                      Pay securely by card, bank or USSD with Paystack. Your
                      payment is confirmed immediately.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  className="w3-btn payButton w3-round-large myfont3 payLinkButton"
                  onClick={payWithPaystack}
                  disabled={confirming}
                >
                  {confirming ? (
                    <LoadingOutlined />
                  ) : (
                    `Pay ${formatCurrency(payment.amount || 0)} with Paystack`
                  )}
                </button>
              </section>
            )}
          </div>

          {/* Bank Transfer */}
          {!isPaid && !isRejected && (
            <section className="paySection">
              <div className="paySectionHeader">
                <span className="paySectionIcon">
                  <BankOutlined />
                </span>
                <div>
                  <h3 className="paySectionTitle myfont3">
                    Or Pay by Bank Transfer
                  </h3>
                  <p className="paySectionHint myfont1">
                    Transfer the total amount to the account below. Our team
                    will confirm your payment.
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
                        onClick={() => copyToClipboard(detail.key, detail.value)}
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
              </div>
              {noticeSent ? (
                <p className="payLinkNotice myfont1">
                  <CheckOutlined /> Thank you. We will confirm your transfer and
                  email your login details to {payment.tenant.email}.
                </p>
              ) : (
                <button
                  type="button"
                  className="w3-btn payLinkSecondaryButton w3-round-large myfont3"
                  onClick={sendTransferNotice}
                  disabled={sendingNotice}
                >
                  {sendingNotice ? <LoadingOutlined /> : "I have made the transfer"}
                </button>
              )}
            </section>
          )}
        </div>
      </div>
    </>
  );
};

export default PaymentLinkPage;
