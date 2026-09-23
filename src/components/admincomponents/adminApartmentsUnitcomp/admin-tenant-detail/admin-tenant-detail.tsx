import {
  CalendarOutlined,
  EditOutlined,
  SafetyCertificateOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import {
  IAdminOccupantData,
  IAdminTenantsData,
} from "../../../../apiservice/admin-General-ApiService.type";
import { useAppSelector } from "../../../../Redux/reduxCustomHook";
import { RootState } from "../../../../Redux/store";
import { convertToShortDate } from "../../../../utils/date.utils";
import "./admin-tenant-detail.css";

export const AdminTenantDetails: React.FC<{}> = () => {
  const selectedTenant: IAdminTenantsData = useAppSelector(
    (state: RootState) => state?.AdminSelectedTenant
  );

  const selectedOccupant: IAdminOccupantData = useAppSelector(
    (state: RootState) => state?.AdminSelectedOccupant
  );
  const navigate = useNavigate();

  // Navigate to the next Page
  const navigateToEdit = async () => {
    navigate(`/admin/apartment-tenant/edit/${selectedTenant.id}`);
  };

  const navigateToEditDate = async () => {
    navigate(`/admin/apartment-tenant-occupancy/edit/${selectedTenant.id}`);
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
    { label: "Number Of Occupants", value: selectedTenant?.noOfOccupants },
    { label: "Number Of Vehicles", value: selectedTenant?.noOfVehicles },
    { label: "Old Address", value: selectedTenant?.address, full: true },
    { label: "Reason", value: selectedTenant?.reason, full: true },
  ];

  const guarantors = (selectedTenant?.tenantGuarantors || []).filter(
    (guarantor) => guarantor?.fullName
  );

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
    </>
  );
};

export default AdminTenantDetails;
