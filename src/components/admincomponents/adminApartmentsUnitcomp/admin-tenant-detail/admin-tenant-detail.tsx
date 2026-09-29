import {
  CalendarOutlined,
  EditOutlined,
  FileTextOutlined,
  HomeOutlined,
  SafetyCertificateOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminGetTenantSingleApi } from "../../../../apiservice/admin-General-ApiService";
import {
  IAdminOccupantData,
  IAdminTenantsData,
} from "../../../../apiservice/admin-General-ApiService.type";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../../Redux/reduxCustomHook";
import { RootState } from "../../../../Redux/store";
import { formatCurrency } from "../../../../utils/basic.utils";
import { convertToShortDate } from "../../../../utils/date.utils";
import {
  AdminFilePreviewModal,
  AdminFileThumbnail,
  IPreviewFile,
} from "../../adminFilePreview/adminFilePreview";
import "../../adminTenantRequests/adminTenantRequests.css";
import "./admin-tenant-detail.css";

type IAdminTenantDetails = {
  // Load this tenant instead of the one selected on the apartment page
  tenantId?: string | number;
  // The tenancy to show dates for (defaults to the selected occupant)
  occupant?: Partial<IAdminOccupantData>;
};

export const AdminTenantDetails: React.FC<IAdminTenantDetails> = ({
  tenantId,
  occupant,
}) => {
  const storedTenant: IAdminTenantsData = useAppSelector(
    (state: RootState) => state?.AdminSelectedTenant
  );
  const storedOccupant: IAdminOccupantData = useAppSelector(
    (state: RootState) => state?.AdminSelectedOccupant
  );
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const id = tenantId ?? storedTenant?.id;
  // The apartment page only has the tenant's summary, so load the full record
  // (documents, guarantor photos, secondary occupant)
  const [loadedTenant, setLoadedTenant] = useState<IAdminTenantsData>();
  // Index into `allFiles` of the file open in the pop-up
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);

  useEffect(() => {
    if (id === undefined || id === null) return;
    let cancelled = false;
    adminGetTenantSingleApi(id)
      .then((response) => {
        if (cancelled || !response?.data) return;
        setLoadedTenant(response.data);
        // Keep the edit pages in sync with what is shown here
        dispatch({ type: "ADMIN_ADD_SELECTED_TENANT", payload: response.data });
      })
      .catch((error) => console.error("Error fetching tenant:", error));
    return () => {
      cancelled = true;
    };
  }, [id]);

  const selectedTenant: IAdminTenantsData | undefined =
    loadedTenant || (tenantId === undefined ? storedTenant : undefined);
  const selectedOccupant = occupant || storedOccupant;
  const activeOccupant = selectedTenant?.activeOccupant;

  // Navigate to the next Page
  const navigateToEdit = async () => {
    navigate(`/admin/apartment-tenant/edit/${selectedTenant?.id}`);
  };

  const navigateToEditDate = async () => {
    navigate(`/admin/apartment-tenant-occupancy/edit/${selectedTenant?.id}`);
  };

  // Build initials for the avatar e.g "Jane Doe" => "JD"
  const initials = (selectedTenant?.fullName || "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((name) => name[0].toUpperCase())
    .join("");

  const personalDetails = [
    { label: "Phone Number", value: selectedTenant?.phoneNumber },
    { label: "Email", value: selectedTenant?.email, plain: true },
    { label: "Gender", value: selectedTenant?.gender },
    { label: "Marital Status", value: selectedTenant?.maritalStatus },
    { label: "Religion", value: selectedTenant?.religion },
    { label: "Occupation", value: selectedTenant?.occupation },
    { label: "NIN", value: selectedTenant?.nin, plain: true },
    {
      label: "Matric/Admission Number",
      value: selectedTenant?.admissionNumber,
      plain: true,
    },
    { label: "Number Of Occupants", value: selectedTenant?.noOfOccupants },
    { label: "Number Of Vehicles", value: selectedTenant?.noOfVehicles },
    { label: "Old Address", value: selectedTenant?.address, full: true },
    { label: "Reason", value: selectedTenant?.reason, full: true },
  ];

  const guarantors = (selectedTenant?.tenantGuarantors || []).filter(
    (guarantor) => guarantor?.fullName
  );

  const documents = [
    { label: "Passport Photograph", url: selectedTenant?.passportImageUrl },
    { label: "JAMB Admission Letter", url: selectedTenant?.admissionLetterUrl },
    { label: "Tenancy Agreement", url: selectedTenant?.agreementFormUrl },
  ].filter((document) => document.url) as IPreviewFile[];

  const secondaryDocuments = selectedTenant?.hasSecondaryOccupant
    ? ([
        {
          label: "Secondary Occupant Passport",
          url: selectedTenant?.secondaryPassportImageUrl,
        },
        {
          label: "Secondary Occupant Admission Letter",
          url: selectedTenant?.secondaryAdmissionLetterUrl,
        },
      ].filter((document) => document.url) as IPreviewFile[])
    : [];

  const guarantorFiles = guarantors
    .map((guarantor, index) =>
      guarantor.imageUrl
        ? { label: `Guarantor ${index + 1} Photograph`, url: guarantor.imageUrl }
        : null
    )
    .filter(Boolean) as IPreviewFile[];

  // Every file for this tenant, in page order, so the pop-up can step through them
  const allFiles: IPreviewFile[] = [
    ...documents,
    ...secondaryDocuments,
    ...guarantorFiles,
  ];
  const openFile = (url?: string) => {
    const index = allFiles.findIndex((file) => file.url === url);
    if (index >= 0) setPreviewIndex(index);
  };

  const renderFiles = (files: IPreviewFile[]) => (
    <div className="adminDocumentGrid">
      {files.map((file) => (
        <AdminFileThumbnail
          key={file.label}
          file={file}
          onOpen={() => openFile(file.url)}
        />
      ))}
    </div>
  );

  const apartmentTitle = [
    activeOccupant?.apartment?.building?.title,
    activeOccupant?.apartment?.title,
  ]
    .filter(Boolean)
    .join(" · ");

  if (!selectedTenant) {
    return (
      <div className="adminPanel adminEmpty">
        <p className="myfont1">Loading tenant...</p>
      </div>
    );
  }

  return (
    <>
      {/* Tenant Profile */}
      <div className="adminPanel">
        <div className="adminPanelHeader">
          <div className="adminTenantHead">
            <span className="adminAvatar adminAvatarLarge">
              {initials || <UserOutlined />}
            </span>
            <div>
              <h3 className="adminTenantName myfont3">
                {selectedTenant?.fullName}
              </h3>
              <span
                className={`adminStatusPill myfont1 ${
                  selectedTenant?.activated
                    ? "adminStatusVacant"
                    : "adminStatusDue"
                }`}
              >
                {selectedTenant?.activated ? "Rent active" : "Rent inactive"}
              </span>
              {apartmentTitle && (
                <span className="adminListSub myfont1 reqSubmitted">
                  <HomeOutlined /> {apartmentTitle}
                </span>
              )}
            </div>
          </div>
          <div className="adminBtnRow">
            <button
              type="button"
              onClick={() => {
                navigateToEdit();
              }}
              className="adminBtn"
            >
              <EditOutlined /> Edit Details
            </button>
            <button
              type="button"
              onClick={() => {
                navigateToEditDate();
              }}
              className="adminBtn"
            >
              <CalendarOutlined /> Edit Date
            </button>
          </div>
        </div>

        {/* Rent Period */}
        <div className="adminDetailGrid adminRentGrid">
          <div className="adminDetailItem">
            <span className="adminDetailLabel myfont1">Last Rent Payment</span>
            <span className="adminDetailValue myfont3">
              {selectedOccupant?.startDate
                ? convertToShortDate(selectedOccupant.startDate)
                : "-"}
            </span>
          </div>
          <div className="adminDetailItem adminDetailHighlight">
            <span className="adminDetailLabel myfont1">Next Rent Payment</span>
            <span className="adminDetailValue myfont3">
              {selectedOccupant?.endDate
                ? convertToShortDate(selectedOccupant.endDate)
                : "-"}
            </span>
          </div>
          {selectedTenant?.nextPaymentAmount !== undefined &&
            selectedTenant?.nextPaymentAmount !== null && (
              <div className="adminDetailItem">
                <span className="adminDetailLabel myfont1">Next Rent</span>
                <span className="adminDetailValue myfont3">
                  {formatCurrency(selectedTenant.nextPaymentAmount)}
                </span>
              </div>
            )}
        </div>

        {/* Personal Details */}
        <h4 className="adminSubheading myfont1">Personal Details</h4>
        <div className="adminDetailGrid">
          {personalDetails.map((detail) => (
            <div
              key={detail.label}
              className={`adminDetailItem ${
                detail.full ? "adminDetailFull" : ""
              }`}
            >
              <span className="adminDetailLabel myfont1">{detail.label}</span>
              <span
                className={`adminDetailValue myfont1 ${
                  detail.plain ? "" : "adminCapitalize"
                }`}
              >
                {detail.value ?? "-"}
              </span>
            </div>
          ))}
        </div>

        {/* Documents */}
        <h4 className="adminSubheading myfont1">
          <FileTextOutlined /> Documents
        </h4>
        {documents.length > 0 ? (
          renderFiles(documents)
        ) : (
          <p className="adminListSub myfont1">No documents uploaded yet.</p>
        )}
      </div>

      {/* Secondary Occupant */}
      {selectedTenant?.hasSecondaryOccupant && (
        <div className="adminPanel">
          <div className="adminPanelHeader">
            <h3 className="adminPanelTitle myfont3">
              <span className="adminPanelIcon">
                <TeamOutlined />
              </span>
              Secondary Occupant
            </h3>
          </div>
          <div className="adminDetailGrid">
            <div className="adminDetailItem">
              <span className="adminDetailLabel myfont1">Full Name</span>
              <span className="adminDetailValue myfont1 adminCapitalize">
                {selectedTenant.secondaryFullName || "-"}
              </span>
            </div>
            <div className="adminDetailItem">
              <span className="adminDetailLabel myfont1">
                Matric/Admission Number
              </span>
              <span className="adminDetailValue myfont1">
                {selectedTenant.secondaryAdmissionNumber || "-"}
              </span>
            </div>
          </div>
          {secondaryDocuments.length > 0 ? (
            renderFiles(secondaryDocuments)
          ) : (
            <p className="adminListSub myfont1">No documents uploaded yet.</p>
          )}
        </div>
      )}

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
              {guarantor.imageUrl &&
                renderFiles([
                  { label: "Guardian Photograph", url: guarantor.imageUrl },
                ])}
            </div>
          ))}
        </div>
      )}

      {/* Document / photo pop-up */}
      <AdminFilePreviewModal
        files={allFiles}
        openIndex={previewIndex}
        onChange={setPreviewIndex}
      />
    </>
  );
};

export default AdminTenantDetails;
