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

  return (
    <div className="w3-container">
      <div className="w3-content">
        <div className="w3-col  w3-padding adminTenantCard w3-round-large w3-margin-bottom  w3-margin-top">
          <div className="w3-col w3-margin-bottom w3-margin-top  w3-right-align">
            <button
              onClick={() => {
                navigateToEdit();
              }}
              className="w3-btn  w3-round-large myfont1 w3-small editOccupantBtn"
            >
              Edit Details
            </button>
            &nbsp;
            <button
              onClick={() => {
                navigateToEditDate();
              }}
              className="w3-btn  w3-round-large myfont1 w3-small editOccupantBtn"
            >
              Edit Date
            </button>
          </div>

          {/* FullName */}
          <div className="w3-col w3-margin-bottom  w3-border-bottom profileBorder">
            <p className="w3-small myfont1">FULLNAME</p>
            <p>
              <b className="myfont1"> {selectedTenant.fullName}</b>
            </p>
          </div>

          {/* Phone Number*/}
          <div className="w3-col w3-margin-bottom  w3-border-bottom profileBorder">
            <p className="w3-small myfont1">PHONE NUMBER</p>
            <p>
              <b className="myfont1 normaliseCap">
                {selectedTenant.phoneNumber}
              </b>
            </p>
          </div>

          {/* Email */}
          <div className="w3-col w3-margin-bottom  w3-border-bottom profileBorder">
            <p className="w3-small myfont1">EMAIL</p>
            <p>
              <b className="myfont1"> {selectedTenant.email}</b>
            </p>
          </div>

          {/* Gender */}
          <div className="w3-col w3-margin-bottom  w3-border-bottom profileBorder">
            <p className="w3-small myfont1">Gender</p>
            <p>
              <b className="myfont1 normaliseCap"> {selectedTenant.gender}</b>
            </p>
          </div>

          {/* Marital Status */}
          <div className="w3-col w3-margin-bottom  w3-border-bottom profileBorder">
            <p className="w3-small myfont1">Marital Status</p>
            <p>
              <b className="myfont1 normaliseCap">
                {" "}
                {selectedTenant.maritalStatus}
              </b>
            </p>
          </div>

          {/* Religion */}
          <div className="w3-col w3-margin-bottom  w3-border-bottom profileBorder">
            <p className="w3-small myfont1">Religion</p>
            <p>
              <b className="myfont1 normaliseCap"> {selectedTenant.religion}</b>
            </p>
          </div>

          {/* Reason */}
          <div className="w3-col w3-margin-bottom  w3-border-bottom profileBorder">
            <p className="w3-small myfont1">Reason</p>
            <p>
              <b className="myfont1 normaliseCap"> {selectedTenant.reason}</b>
            </p>
          </div>

          {/* Address */}
          <div className="w3-col w3-margin-bottom  w3-border-bottom profileBorder">
            <p className="w3-small myfont1">Old Address</p>
            <p>
              <b className="myfont1 normaliseCap"> {selectedTenant.address}</b>
            </p>
          </div>

          {/* Number Of Occupant */}
          <div className="w3-col w3-margin-bottom  w3-border-bottom profileBorder">
            <p className="w3-small myfont1">Number Of Occupant</p>
            <p>
              <b className="myfont1 normaliseCap">
                {" "}
                {selectedTenant.noOfOccupants}
              </b>
            </p>
          </div>

          {/* Number Of Vehicles */}
          <div className="w3-col w3-margin-bottom  w3-border-bottom profileBorder">
            <p className="w3-small myfont1">Number Of Vehicles</p>
            <p>
              <b className="myfont1 normaliseCap">
                {" "}
                {selectedTenant.noOfVehicles}
              </b>
            </p>
          </div>

          {/* Gurantor Header One */}
          <div className="w3-col w3-margin-bottom">
            <h3 className="w3-text-white myfont1 w3-medium">
              <b> Gurantor 1</b>
            </h3>
          </div>

          {/* First Guarantor's Full Name */}
          <div className="w3-col w3-margin-bottom  w3-border-bottom profileBorder">
            <p className="w3-small myfont1">First Guarantor's Full Name</p>
            <p>
              <b className="myfont1 normaliseCap">
                {selectedTenant?.tenantGuarantors?.[0]?.fullName}
              </b>
            </p>
          </div>

          {/* First Guarantor's Address */}
          <div className="w3-col w3-margin-bottom  w3-border-bottom profileBorder">
            <p className="w3-small myfont1">First Guarantor's Address</p>
            <p>
              <b className="myfont1 normaliseCap">
                {selectedTenant?.tenantGuarantors?.[0]?.address}
              </b>
            </p>
          </div>

          {/* First Guarantor's Phone Number */}
          <div className="w3-col w3-margin-bottom  w3-border-bottom profileBorder">
            <p className="w3-small myfont1">First Guarantor's Phone Number</p>
            <p>
              <b className="myfont1 normaliseCap">
                {selectedTenant?.tenantGuarantors?.[0]?.phoneNumber}
              </b>
            </p>
          </div>

          {/* First Guarantor's Occupation */}
          <div className="w3-col w3-margin-bottom  w3-border-bottom profileBorder">
            <p className="w3-small myfont1">First Guarantor's Occupation</p>
            <p>
              <b className="myfont1 normaliseCap">
                {selectedTenant?.tenantGuarantors?.[0]?.occupation}
              </b>
            </p>
          </div>

          {/* Rent*/}
          <div className="w3-col w3-margin-bottom  w3-border-bottom profileBorder">
            <p className="w3-small myfont1">Rent Active </p>
            <p>
              <b className="myfont1 w3-text-green normaliseCap">
                {selectedTenant.activated + ""}
              </b>
            </p>
          </div>

          {/* Last Rent Payment */}
          <div className="w3-col w3-margin-bottom  w3-border-bottom profileBorder">
            <p className="w3-small myfont1">Last Rent Payment </p>
            <p>
              <b className="myfont1 normaliseCap">
                {convertToShortDate(selectedOccupant?.startDate)}
              </b>
            </p>
          </div>

          {/* Next Rent Payment */}
          <div className="w3-col w3-margin-bottom  w3-border-bottom profileBorder">
            <p className="w3-small myfont1">Next Rent Payment </p>
            <p>
              <b className="myfont1 w3-text-red normaliseCap">
                {convertToShortDate(selectedOccupant?.endDate)}
              </b>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminTenantDetails;
