import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  CheckOutlined,
  CloseOutlined,
  ExclamationCircleFilled,
  HomeOutlined,
  InfoCircleOutlined,
  LoadingOutlined,
  SafetyCertificateOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button, Modal, Result, Spin } from "antd";
import {
  adminGetApartmentRequestSingleApi,
  adminUpdateApartmentRequestStatusApi,
} from "../../../apiservice/admin-General-ApiService";
import { IAdminApartmentRequestData } from "../../../apiservice/admin-General-ApiService.type";
import { appZIndex } from "../../../utils/appconst";
import { formatCurrency } from "../../../utils/basic.utils";
import { convertToShortDate } from "../../../utils/date.utils";
import { ILoadState } from "../../../utils/loading.utils.";
import {
  getInitials,
  getRequestName,
  getRequestStatus,
  getRequestStatusClass,
} from "./tenantRequest.utils";
import "./adminTenantRequests.css";

// Fields shown in their own sections, so they are skipped in "Other details"
const knownFields = new Set([
  "id",
  "firstName",
  "lastName",
  "fullName",
  "email",
  "phoneNumber",
  "gender",
  "maritalStatus",
  "religion",
  "occupation",
  "address",
  "nin",
  "reason",
  "noOfOccupants",
  "noOfVehicles",
  "apartmentId",
  "apartment",
  "statusId",
  "status",
  "guarantors",
  "tenantGuarantors",
  "dateCreated",
  "dateModified",
]);

// "noOfOccupants" => "No Of Occupants"
const toLabel = (key: string) =>
  key
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .replace(/^./, (char) => char.toUpperCase());

export const AdminTenantRequestDetails = () => {
  const params = useParams();
  const [loadState, setLoadState] = useState<ILoadState>("loading");
  const [request, setRequest] = useState<IAdminApartmentRequestData>();
  const [savingStatus, setSavingStatus] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  // Load the request
  useEffect(() => {
    let cancelled = false;
    setLoadState("loading");
    adminGetApartmentRequestSingleApi(params?.id)
      .then((response) => {
        if (cancelled) return;
        setRequest(response?.data);
        setLoadState(response?.data ? "completed" : "noData");
      })
      .catch((error) => {
        if (cancelled) return;
        console.error("Error fetching tenant request:", error);
        setLoadState("error");
      });
    return () => {
      cancelled = true;
    };
  }, [params?.id, reloadKey]);

  // Accept or reject the request
  const updateStatus = async (statusId: string) => {
    setSavingStatus(statusId);
    try {
      await adminUpdateApartmentRequestStatusApi(params?.id, { statusId });
      alert(`This request has been ${statusId.toLowerCase()}.`);
      setReloadKey((key) => key + 1);
    } catch (error: any) {
      alert(
        error?.response?.data?.message ||
          error?.message ||
          "Sorry, the request status could not be updated."
      );
    } finally {
      setSavingStatus("");
    }
  };

  const confirmStatus = (statusId: string) => {
    Modal.confirm({
      title:
        statusId === "Accepted"
          ? "Accept this tenant request?"
          : "Reject this tenant request?",
      content:
        statusId === "Accepted"
          ? "The applicant will be notified to make payment."
          : "The applicant's request will be declined.",
      icon: <ExclamationCircleFilled />,
      centered: true,
      okText: statusId === "Accepted" ? "Accept" : "Reject",
      okType: statusId === "Accepted" ? "primary" : "danger",
      cancelText: "Cancel",
      zIndex: appZIndex.modal,
      onOk: () => updateStatus(statusId),
    });
  };

  if (loadState === "loading") {
    return (
      <div className="w3-col w3-center" style={{ padding: "80px 0" }}>
        <Spin size="large" />
      </div>
    );
  }

  if (loadState === "error" || loadState === "noData" || !request) {
    return (
      <Result
        status={loadState === "noData" ? "404" : "500"}
        title={<span className="w3-text-white">Request not found</span>}
        subTitle={
          <span className="w3-text-white">
            Sorry, we could not load this tenant request.
          </span>
        }
        extra={
          <Button type="primary" onClick={() => setReloadKey((k) => k + 1)}>
            Reload
          </Button>
        }
      />
    );
  }

  const name = getRequestName(request);
  const status = getRequestStatus(request);
  const isPending = status.toLowerCase().startsWith("pend");
  const apartment = request.apartment;
  const building = apartment?.building;
  const guarantors = (request.guarantors || request.tenantGuarantors || [])
    .filter((guarantor) => guarantor?.fullName);

  const personalDetails = [
    { label: "Email", value: request.email, plain: true },
    { label: "Phone Number", value: request.phoneNumber },
    { label: "Gender", value: request.gender },
    { label: "Marital Status", value: request.maritalStatus },
    { label: "Religion", value: request.religion },
    { label: "Occupation", value: request.occupation },
    { label: "NIN", value: request.nin },
    { label: "Number Of Occupants", value: request.noOfOccupants },
    { label: "Number Of Vehicles", value: request.noOfVehicles },
    { label: "Address", value: request.address, full: true },
    { label: "Reason", value: request.reason, full: true },
  ].filter((detail) => detail.value !== undefined && detail.value !== null);

  // Anything else the API returns (simple values only)
  const otherDetails = Object.entries(request).filter(
    ([key, value]) =>
      !knownFields.has(key) &&
      value !== null &&
      value !== "" &&
      ["string", "number", "boolean"].includes(typeof value)
  );

  return (
    <div className="w3-content adminPageBody">
      <nav className="adminCtxCrumbs myfont1" aria-label="Breadcrumb">
        <Link to="/admin/tenant-requests">Tenant Requests</Link>
        <span className="adminCtxCrumbSep">›</span>
        <span className="adminCtxCrumbCurrent">{name}</span>
      </nav>

      {/* Applicant */}
      <div className="adminPanel">
        <div className="adminPanelHeader">
          <div className="adminTenantHead">
            <span className="adminAvatar adminAvatarLarge">
              {getInitials(name) || <UserOutlined />}
            </span>
            <div>
              <h3 className="adminTenantName myfont3">{name}</h3>
              <span
                className={`adminStatusPill myfont1 ${getRequestStatusClass(
                  status
                )}`}
              >
                {status}
              </span>
              {request.dateCreated && (
                <span className="adminListSub myfont1 reqSubmitted">
                  Submitted {convertToShortDate(request.dateCreated)}
                </span>
              )}
            </div>
          </div>

          <div className="adminBtnRow">
            <button
              type="button"
              disabled={!!savingStatus || status === "Accepted"}
              onClick={() => confirmStatus("Accepted")}
              className="adminBtn adminBtnPrimary"
            >
              {savingStatus === "Accepted" ? (
                <LoadingOutlined />
              ) : (
                <CheckOutlined />
              )}{" "}
              Accept
            </button>
            <button
              type="button"
              disabled={!!savingStatus || status === "Rejected"}
              onClick={() => confirmStatus("Rejected")}
              className="adminBtn adminBtnDanger"
            >
              {savingStatus === "Rejected" ? (
                <LoadingOutlined />
              ) : (
                <CloseOutlined />
              )}{" "}
              Reject
            </button>
          </div>
        </div>

        {!isPending && (
          <p className="adminListSub myfont1 reqDecided">
            <InfoCircleOutlined /> This request has already been{" "}
            {status.toLowerCase()}. You can still change it if needed.
          </p>
        )}

        {/* Apartment requested */}
        {(apartment || request.apartmentId) && (
          <>
            <h4 className="adminSubheading myfont1">Apartment Requested</h4>
            <div className="adminDetailGrid">
              <div className="adminDetailItem">
                <span className="adminDetailLabel myfont1">Apartment</span>
                <span className="adminDetailValue myfont3">
                  {apartment?.title || `Apartment #${request.apartmentId}`}
                </span>
              </div>
              <div className="adminDetailItem">
                <span className="adminDetailLabel myfont1">Building</span>
                <span className="adminDetailValue myfont1">
                  <HomeOutlined /> {building?.title || "-"}
                </span>
              </div>
              {apartment?.price !== undefined && (
                <div className="adminDetailItem">
                  <span className="adminDetailLabel myfont1">Rent</span>
                  <span className="adminDetailValue myfont1">
                    {formatCurrency(apartment.price)}
                  </span>
                </div>
              )}
              {apartment?.isOccupied !== undefined && (
                <div className="adminDetailItem">
                  <span className="adminDetailLabel myfont1">
                    Current Status
                  </span>
                  <span className="adminDetailValue myfont1">
                    {apartment.isOccupied ? "Occupied" : "Vacant"}
                  </span>
                </div>
              )}
            </div>
          </>
        )}

        {/* Personal details */}
        {personalDetails.length > 0 && (
          <>
            <h4 className="adminSubheading myfont1">Personal Details</h4>
            <div className="adminDetailGrid">
              {personalDetails.map((detail) => (
                <div
                  key={detail.label}
                  className={`adminDetailItem ${
                    detail.full ? "adminDetailFull" : ""
                  }`}
                >
                  <span className="adminDetailLabel myfont1">
                    {detail.label}
                  </span>
                  <span
                    className={`adminDetailValue myfont1 ${
                      detail.plain ? "" : "adminCapitalize"
                    }`}
                  >
                    {String(detail.value)}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Any other fields from the API */}
        {otherDetails.length > 0 && (
          <>
            <h4 className="adminSubheading myfont1">Other Details</h4>
            <div className="adminDetailGrid">
              {otherDetails.map(([key, value]) => (
                <div key={key} className="adminDetailItem">
                  <span className="adminDetailLabel myfont1">
                    {toLabel(key)}
                  </span>
                  <span className="adminDetailValue myfont1">
                    {String(value)}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Guarantors */}
      {guarantors.length > 0 && (
        <div className="adminPanel">
          <div className="adminPanelHeader">
            <h3 className="adminPanelTitle myfont3">
              <span className="adminPanelIcon">
                <SafetyCertificateOutlined />
              </span>
              Guarantors
            </h3>
          </div>
          {guarantors.map((guarantor, index) => (
            <div key={guarantor.id || index} className="adminGuarantor">
              <h4 className="adminSubheading myfont1">
                Guarantor {index + 1}
              </h4>
              <div className="adminDetailGrid">
                <div className="adminDetailItem">
                  <span className="adminDetailLabel myfont1">Full Name</span>
                  <span className="adminDetailValue myfont1 adminCapitalize">
                    {guarantor.fullName}
                  </span>
                </div>
                <div className="adminDetailItem">
                  <span className="adminDetailLabel myfont1">
                    Phone Number
                  </span>
                  <span className="adminDetailValue myfont1">
                    {guarantor.phoneNumber || "-"}
                  </span>
                </div>
                <div className="adminDetailItem">
                  <span className="adminDetailLabel myfont1">Occupation</span>
                  <span className="adminDetailValue myfont1 adminCapitalize">
                    {guarantor.occupation || "-"}
                  </span>
                </div>
                <div className="adminDetailItem">
                  <span className="adminDetailLabel myfont1">Address</span>
                  <span className="adminDetailValue myfont1 adminCapitalize">
                    {guarantor.address || "-"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminTenantRequestDetails;
