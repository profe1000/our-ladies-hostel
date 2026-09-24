import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  AppstoreOutlined,
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
import {
  IAdminApartmentData,
  IAdminApartmentRequestData,
  IAdminBuildingsData,
} from "../../../apiservice/admin-General-ApiService.type";
import {
  tenantApartmentDetailsApi,
  tenantBuildingDetailsApi,
} from "../../../apiservice/tenant-general-apiService";
import { appZIndex } from "../../../utils/appconst";
import { formatCurrency } from "../../../utils/basic.utils";
import { convertToShortDate } from "../../../utils/date.utils";
import {
  AdminFilePreviewModal,
  AdminFileThumbnail,
  IPreviewFile,
} from "../adminFilePreview/adminFilePreview";
import { ILoadState } from "../../../utils/loading.utils.";
import {
  getInitials,
  getRequestName,
  getRequestStatus,
  getRequestStatusClass,
  getRequestStatusLabel,
} from "./tenantRequest.utils";
import "../adminContextHeader/adminContextHeader.css";
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
  "admissionNumber",
  "passportImageUrl",
  "admissionLetterUrl",
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
  // Index into `allFiles` of the file open in the pop-up
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);
  const [buildingPhotoOpen, setBuildingPhotoOpen] = useState(false);
  // Looked up when the request only returns ids
  const [fetchedApartment, setFetchedApartment] =
    useState<Partial<IAdminApartmentData>>();
  const [fetchedBuilding, setFetchedBuilding] =
    useState<Partial<IAdminBuildingsData>>();

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

  // Resolve the apartment/building from whatever shape the API returns
  const apartment = request?.apartment?.title
    ? request.apartment
    : fetchedApartment || request?.apartment;
  const buildingId =
    request?.building?.id ??
    request?.buildingId ??
    request?.apartment?.building?.id ??
    request?.apartment?.buildingId ??
    fetchedApartment?.buildingId;
  const building =
    request?.building?.title
      ? request.building
      : request?.apartment?.building?.title
      ? request.apartment.building
      : fetchedBuilding;

  // Look up the apartment when only its id is returned
  useEffect(() => {
    const apartmentId = request?.apartmentId ?? request?.apartment?.id;
    if (!request || request?.apartment?.title || apartmentId === undefined) {
      return;
    }
    tenantApartmentDetailsApi(apartmentId)
      .then((response) => setFetchedApartment(response?.data))
      .catch((error) => console.error("Error fetching apartment:", error));
  }, [request]);

  // Look up the building when only its id is returned
  useEffect(() => {
    if (building || buildingId === undefined) return;
    tenantBuildingDetailsApi(buildingId)
      .then((response) => setFetchedBuilding(response?.data))
      .catch((error) => console.error("Error fetching building:", error));
  }, [buildingId, !!building]);

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
          ? "The applicant will be emailed a link to pay online with Paystack or by bank transfer."
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
  // Once paid, the tenant is an occupant and the request can no longer change
  const isCompleted = status.toLowerCase().startsWith("complet");
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
    {
      label: "Matric/Admission Number",
      value: request.admissionNumber,
      plain: true,
    },
    { label: "Number Of Occupants", value: request.noOfOccupants },
    { label: "Number Of Vehicles", value: request.noOfVehicles },
    { label: "Address", value: request.address, full: true },
    { label: "Reason", value: request.reason, full: true },
  ].filter((detail) => detail.value !== undefined && detail.value !== null);

  const documents = [
    { label: "Passport Photograph", url: request.passportImageUrl },
    { label: "JAMB Admission Letter", url: request.admissionLetterUrl },
  ].filter((document) => document.url);

  // Guarantor photographs
  const guarantorFiles = guarantors.map((guarantor, index) =>
    guarantor.imageUrl
      ? { label: `Guarantor ${index + 1} Photograph`, url: guarantor.imageUrl }
      : null
  );

  // Every file on this request, in page order, so the pop-up can step
  // through all of them
  const allFiles: IPreviewFile[] = [
    ...(documents as IPreviewFile[]),
    ...(guarantorFiles.filter(Boolean) as IPreviewFile[]),
  ];
  const openFile = (url?: string) => {
    const index = allFiles.findIndex((file) => file.url === url);
    if (index >= 0) setPreviewIndex(index);
  };

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
                {getRequestStatusLabel(status)}
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
              disabled={!!savingStatus || status === "Accepted" || isCompleted}
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
              disabled={!!savingStatus || status === "Rejected" || isCompleted}
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
            <InfoCircleOutlined />{" "}
            {isCompleted
              ? "The tenant has paid and this request is complete."
              : status === "Accepted"
              ? "This request has been accepted. The tenant has been emailed a link to pay, and will show under pending payments until they pay with Paystack or you approve their bank transfer."
              : `This request has already been ${status.toLowerCase()}. You can still change it if needed.`}
          </p>
        )}

        {/* Building & apartment requested */}
        {(apartment || request.apartmentId || buildingId !== undefined) && (
          <>
            <h4 className="adminSubheading myfont1">Apartment Requested</h4>
            <div className="adminCtxCard reqBuildingCard">
              {building?.imageUrl ? (
                <button
                  type="button"
                  className="reqBuildingImageBtn"
                  aria-label={`View photo of ${building.title}`}
                  onClick={() =>
                    setBuildingPhotoOpen(true)
                  }
                >
                  <img
                    className="adminCtxImage"
                    src={building.imageUrl}
                    alt={building.title || "Building"}
                  />
                </button>
              ) : (
                <div className="adminCtxImage adminCtxImagePlaceholder">
                  <HomeOutlined />
                </div>
              )}

              <div className="adminCtxBody">
                {/* Building */}
                <div className="adminCtxBuilding">
                  <span className="adminCtxEyebrow myfont1">Building</span>
                  <h2 className="adminCtxTitle myfont5">
                    {building?.title ||
                      (buildingId !== undefined
                        ? "Loading building..."
                        : "Building not provided")}
                  </h2>
                  {building?.description && (
                    <p className="adminCtxText myfont1">
                      {building.description}
                    </p>
                  )}
                  <div className="adminCtxChips myfont1">
                    {building?.price !== undefined && (
                      <span className="adminCtxChip">
                        {formatCurrency(building.price)}
                      </span>
                    )}
                    {building?.noOfApartments !== undefined && (
                      <span className="adminCtxChip">
                        <AppstoreOutlined /> {building.noOfApartments} Units
                      </span>
                    )}
                    {!!building?.serviceCharge && (
                      <span className="adminCtxChip">
                        {formatCurrency(building.serviceCharge)} service
                      </span>
                    )}
                  </div>
                  {building?.id && (
                    <Link
                      to={`/admin/apartment/${building.id}`}
                      className="reqBuildingLink myfont1"
                    >
                      View building units ›
                    </Link>
                  )}
                </div>

                {/* Apartment */}
                <div className="adminCtxApartment">
                  <span className="adminCtxEyebrow myfont1">Apartment</span>
                  <div className="adminCtxApartmentRow">
                    <h3 className="adminCtxApartmentTitle myfont3">
                      {apartment?.title ||
                        (request.apartmentId
                          ? `Apartment #${request.apartmentId}`
                          : "-")}
                    </h3>
                    {apartment?.isOccupied !== undefined && (
                      <span
                        className={`adminStatusPill myfont1 ${
                          apartment.isOccupied
                            ? "adminStatusOccupied"
                            : "adminStatusVacant"
                        }`}
                      >
                        {apartment.isOccupied ? "Occupied" : "Vacant"}
                      </span>
                    )}
                  </div>
                  <div className="adminCtxChips myfont1">
                    {apartment?.price !== undefined && (
                      <span className="adminCtxChip">
                        Rent {formatCurrency(apartment.price)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
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

        {/* Uploaded documents */}
        {documents.length > 0 && (
          <>
            <h4 className="adminSubheading myfont1">Documents</h4>
            <div className="adminDocumentGrid">
              {(documents as IPreviewFile[]).map((document) => (
                <AdminFileThumbnail
                  key={document.label}
                  file={document}
                  onOpen={() => openFile(document.url)}
                />
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
              {guarantor.imageUrl && (
                <div className="adminDocumentGrid">
                  <AdminFileThumbnail
                    file={{
                      label: "Guardian Photograph",
                      url: guarantor.imageUrl,
                    }}
                    onOpen={() => openFile(guarantor.imageUrl)}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Building photo pop-up */}
      {building?.imageUrl && (
        <AdminFilePreviewModal
          files={[
            { label: building.title || "Building", url: building.imageUrl },
          ]}
          openIndex={buildingPhotoOpen ? 0 : null}
          onChange={(index) => setBuildingPhotoOpen(index !== null)}
        />
      )}

      {/* Document / photo pop-up */}
      <AdminFilePreviewModal
        files={allFiles}
        openIndex={previewIndex}
        onChange={setPreviewIndex}
      />
    </div>
  );
};

export default AdminTenantRequestDetails;
