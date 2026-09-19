import { LoadingOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { sampleApiCall } from "../../../../apiservice/authService";
import { tenantRegistrationApi } from "../../../../apiservice/tenant-general-apiService";
import {
  ITenantApartmentData,
  ITenantBuildingsData,
  ITenantRegistration,
} from "../../../../apiservice/tenant-general-apiService.type.";
import useFormatApiRequest from "../../../../hooks/formatApiRequest";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../../Redux/reduxCustomHook";
import { RootState } from "../../../../Redux/store";
import "./tenantRegistration.css";

export const TenantRegistrationForm: React.FC<{}> = () => {
  const [loadApi, setLoadApi] = useState(false);
  const [payLoad, setpayLoad] = useState<any>({});
  const [formLoading, setFormLoading] = useState<boolean>(false);

  // For Navigator/Redux
  const selectedBuilding: ITenantBuildingsData = useAppSelector(
    (state: RootState) => state?.TenantSelectedBuilding
  );

  const selectedApartment: ITenantApartmentData = useAppSelector(
    (state: RootState) => state?.TenantSelectedApartment
  );

  const params = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    setpayLoad({ apartmentId: selectedApartment.id, guarantors: [{}, {}] });
    // setpayLoad({
    //   apartmentId: selectedApartment.id,
    //   firstName: "John",
    //   lastName: "Doe",
    //   email: "john.doe@example.com",
    //   phoneNumber: "+2348012345678",
    //   nin: "12345678901",
    //   address: "123 Sample Street, Lagos, Nigeria",
    //   gender: "male",
    //   maritalStatus: "single",
    //   religion: "christian",
    //   reason: "Work relocation to the area",
    //   occupation: "Software Engineer",
    //   noOfOccupants: "2",
    //   noOfVehicles: "1",
    //   guarantors: [
    //     {
    //       fullName: "Jane Smith",
    //       address: "456 Guarantor Avenue, Abuja, Nigeria",
    //       phoneNumber: "+2348087654321",
    //       occupation: "Business Analyst",
    //     },
    //     {
    //       fullName: "Michael Johnson",
    //       address: "789 Reference Road, Port Harcourt, Nigeria",
    //       phoneNumber: "+2348098765432",
    //       occupation: "Civil Engineer",
    //     },
    //   ],
    // });
  }, []);

  // Use to collect Input change Change
  const handleInputChange = (event: any) => {
    const name = event.target.name;
    const value = event.target.value;
    setpayLoad((values: any) => ({ ...values, [name]: value }));
  };

  // Use to collect Input change Change
  const handleInputChangeForArray = (event: any, index) => {
    const name = event.target.name;
    const value = event.target.value;
    payLoad.guarantors[index][name] = value;

    setpayLoad((values: any) => ({
      ...values,
      guarantors: [...payLoad.guarantors],
    }));
    // console.log(payLoad);
  };

  // Use to Submit Form
  const handleSubmit = (event: any) => {
    event.preventDefault();
    setLoadApi(true);
    setFormLoading(true);
  };

  // A custom hook to save form data
  const result = useFormatApiRequest(
    () => tenantRegistrationApi(payLoad),
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
      const registrationResult: ITenantRegistration = result.data;
      dispatch({
        type: "TENANT_ADD_REGISTRATION_RESULT_DATA",
        payload: registrationResult.data,
      });
      alert("Your form have being saved, please proceed to make payment");
      navigate(`/landing/user-tenant-payment/${selectedApartment.id}`);
      // Handle Success Here
    } else if (result.httpState === "ERROR") {
      setFormLoading(false);
      alert(result.data?.response?.data?.message || result.errorMsg);
      //Handle Error Here
    }
  };

  return (
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
            {/* Personal Information  */}
            <div className="w3-col w3-margin-bottom">
              <h3 className="w3-text-white myfont1 w3-medium">
                <b> Personal Information </b>
              </h3>
            </div>
            {/* First Name */}
            <div className="w3-col w3-margin-bottom">
              <div className="w3-col l12 s12 m12">
                <span className="w3-small w3-text-white myfont1">
                  {" "}
                  FirstName{" "}
                </span>
                <input
                  required
                  name="firstName"
                  value={payLoad?.firstName || ""}
                  onChange={handleInputChange}
                  className="w3-input w3-border w3-col w3-text-white w3-round-large regFormInput "
                  placeholder="First Name"
                />
              </div>
            </div>
            {/* Last Name */}
            <div className="w3-col w3-margin-bottom">
              <div className="w3-col l12 s12 m12">
                <span className="w3-small w3-text-white myfont1">
                  Last Name
                </span>
                <input
                  required
                  name="lastName"
                  value={payLoad?.lastName || ""}
                  onChange={handleInputChange}
                  className="w3-input w3-border w3-col w3-text-white w3-round-large regFormInput "
                  placeholder="Last Name"
                />
              </div>
            </div>
            {/* Email */}
            <div className="w3-col w3-margin-bottom">
              <div className="w3-col l12 s12 m12">
                <span className="w3-small w3-text-white myfont1">Email</span>
                <input
                  required
                  name="email"
                  value={payLoad?.email || ""}
                  onChange={handleInputChange}
                  className="w3-input w3-border w3-col w3-text-white w3-round-large regFormInput"
                  placeholder="Email"
                  type="email"
                />
              </div>
            </div>
            {/* Phone Number */}
            <div className="w3-col w3-margin-bottom">
              <div className="w3-col l12 s12 m12">
                <span className="w3-small w3-text-white myfont1">
                  Phone Number
                </span>
                <input
                  required
                  name="phoneNumber"
                  value={payLoad?.phoneNumber || ""}
                  onChange={handleInputChange}
                  className="w3-input w3-border w3-col w3-text-white w3-round-large regFormInput "
                  placeholder="PhoneNumber"
                  type="tel"
                />
              </div>
            </div>

            {/* NIN */}
            <div className="w3-col w3-margin-bottom">
              <div className="w3-col l12 s12 m12">
                <span className="w3-small w3-text-white myfont1">NIN</span>
                <input
                  required
                  maxLength={11}
                  minLength={11}
                  name="nin"
                  value={payLoad?.nin || ""}
                  onChange={handleInputChange}
                  className="w3-input w3-border w3-col w3-text-white w3-round-large regFormInput "
                  placeholder="National Identification Number"
                  type="number"
                />
              </div>
            </div>

            {/* Address */}
            <div className="w3-col w3-margin-bottom">
              <div className="w3-col l12 s12 m12">
                <span className="w3-small w3-text-white myfont1">Address</span>
                <input
                  required
                  name="address"
                  value={payLoad?.address || ""}
                  onChange={handleInputChange}
                  className="w3-input w3-border w3-col w3-text-white w3-round-large regFormInput "
                  placeholder="Address"
                />
              </div>
            </div>
            {/* Gender  */}
            <div className="w3-col w3-margin-bottom">
              <div className="w3-col l12 s12 m12">
                <span className="w3-small w3-text-white myfont1">Gender</span>
                <select
                  name="gender"
                  value={payLoad?.gender || ""}
                  onChange={handleInputChange}
                  required
                  className="w3-input w3-border w3-col w3-text-white w3-round-large regFormInput "
                >
                  <option value=""> Select Gender </option>
                  <option value="male"> Male</option>
                  <option value="female"> Female </option>
                </select>
              </div>
            </div>
            {/* Marital Status */}
            <div className="w3-col w3-margin-bottom">
              <div className="w3-col l12 s12 m12">
                <span className="w3-small w3-text-white myfont1">
                  Marital Status
                </span>
                <select
                  name="maritalStatus"
                  value={payLoad?.maritalStatus || ""}
                  onChange={handleInputChange}
                  className="w3-input w3-border w3-col w3-text-white w3-round-large regFormInput"
                  required
                >
                  <option value=""> Select </option>
                  <option value="single"> Single </option>
                  <option value="married"> Married </option>
                </select>
              </div>
            </div>
            {/* Religion */}
            <div className="w3-col w3-margin-bottom">
              <div className="w3-col l12 s12 m12">
                <span className="w3-small w3-text-white myfont1">Religion</span>
                <select
                  name="religion"
                  value={payLoad?.religion || ""}
                  onChange={handleInputChange}
                  className="w3-input w3-border w3-col w3-text-white w3-round-large regFormInput"
                >
                  <option value=""> Select Religion </option>
                  <option value="christain">Christian</option>
                  <option value="muslim">Muslim</option>
                  <option value="others">Others</option>
                </select>
              </div>
            </div>
            {/* Reason */}
            <div className="w3-col w3-margin-bottom">
              <div className="w3-col l12 s12 m12">
                <span className="w3-small w3-text-white myfont1">Reason</span>
                <input
                  required
                  name="reason"
                  value={payLoad?.reason || ""}
                  onChange={handleInputChange}
                  className="w3-input w3-border w3-col w3-text-white w3-round-large regFormInput"
                  placeholder="Reason"
                />
              </div>
            </div>

            {/* Occupation */}
            <div className="w3-col w3-margin-bottom">
              <div className="w3-col l12 s12 m12">
                <span className="w3-small w3-text-white myfont1">
                  Occupation
                </span>
                <input
                  required
                  name="occupation"
                  value={payLoad?.occupation || ""}
                  onChange={handleInputChange}
                  className="w3-input w3-border w3-col w3-text-white w3-round-large regFormInput"
                  placeholder="Occupation"
                />
              </div>
            </div>

            {/* No. of Occupants */}
            <div className="w3-col w3-margin-bottom">
              <div className="w3-col l12 s12 m12">
                <span className="w3-small w3-text-white myfont1">
                  No. of Occupants
                </span>
                <input
                  required
                  name="noOfOccupants"
                  value={payLoad?.noOfOccupants || ""}
                  onChange={handleInputChange}
                  className="w3-input w3-border w3-col w3-text-white w3-round-large regFormInput"
                  placeholder="Number of Occupants"
                  type="number"
                />
              </div>
            </div>
            {/* No. of Vehicles */}
            <div className="w3-col w3-margin-bottom">
              <div className="w3-col l12 s12 m12">
                <span className="w3-small w3-text-white myfont1">
                  No. of Vehicles
                </span>
                <input
                  required
                  name="noOfVehicles"
                  value={payLoad?.noOfVehicles || ""}
                  onChange={handleInputChange}
                  className="w3-input w3-border w3-col w3-text-white w3-round-large regFormInput"
                  placeholder="Number of Vehicles"
                  type="number"
                />
              </div>
            </div>
            {/* Gurantor Header One */}
            <div className="w3-col w3-margin-bottom">
              <h3 className="w3-text-white myfont1 w3-medium">
                <b> Gurantor 1</b>
              </h3>
            </div>
            {/* Full Name */}
            <div className="w3-col w3-margin-bottom">
              <div className="w3-col l12 s12 m12">
                <span className="w3-small w3-text-white myfont1">
                  Full Name
                </span>
                <input
                  required
                  name="fullName"
                  value={payLoad?.guarantors?.[0]?.fullName || ""}
                  onChange={(e) => {
                    handleInputChangeForArray(e, 0);
                  }}
                  className="w3-input w3-border w3-col w3-text-white w3-round-large regFormInput"
                  placeholder="Full Name"
                />
              </div>
            </div>
            {/* Address */}
            <div className="w3-col w3-margin-bottom">
              <div className="w3-col l12 s12 m12">
                <span className="w3-small w3-text-white myfont1">Address</span>
                <input
                  required
                  name="address"
                  value={payLoad?.guarantors?.[0]?.address || ""}
                  onChange={(e) => {
                    handleInputChangeForArray(e, 0);
                  }}
                  className="w3-input w3-border w3-col w3-text-white w3-round-large regFormInput"
                  placeholder="Address"
                />
              </div>
            </div>
            {/* Phone Number */}
            <div className="w3-col w3-margin-bottom">
              <div className="w3-col l12 s12 m12">
                <span className="w3-small w3-text-white myfont1">
                  Phone Number
                </span>
                <input
                  required
                  name="phoneNumber"
                  value={payLoad?.guarantors?.[0]?.phoneNumber || ""}
                  onChange={(e) => {
                    handleInputChangeForArray(e, 0);
                  }}
                  className="w3-input w3-border w3-col w3-text-white w3-round-large regFormInput"
                  placeholder="Phone Number"
                  type="tel" // Using type="tel" for phone number input
                />
              </div>
            </div>
            {/* Occupation */}
            <div className="w3-col w3-margin-bottom">
              <div className="w3-col l12 s12 m12">
                <span className="w3-small w3-text-white myfont1">
                  Occupation
                </span>
                <input
                  required
                  name="occupation"
                  value={payLoad?.guarantors?.[0]?.occupation || ""}
                  onChange={(e) => {
                    handleInputChangeForArray(e, 0);
                  }}
                  className="w3-input w3-border w3-col w3-text-white w3-round-large regFormInput"
                  placeholder="Occupation"
                />
              </div>
            </div>
            {/* Gurantor Header Two */}
            {/* <div className="w3-col w3-margin-bottom">
            <h3 className="w3-text-white myfont1 w3-medium">
              <b> Gurantor 2</b>
            </h3>
          </div> */}
            {/* Full Name */}
            {/* <div className="w3-col w3-margin-bottom">
            <div className="w3-col l12 s12 m12">
              <span className="w3-small w3-text-white myfont1">Full Name</span>
              <input
                required
                name="fullName"
                value={payLoad?.guarantors?.[1]?.fullName || ""}
                onChange={(e) => {
                  handleInputChangeForArray(e, 1);
                }}
                className="w3-input w3-border w3-col w3-text-white w3-round-large regFormInput"
                placeholder="Full Name"
              />
            </div>
          </div> */}
            {/* Address */}
            {/* <div className="w3-col w3-margin-bottom">
            <div className="w3-col l12 s12 m12">
              <span className="w3-small w3-text-white myfont1">Address</span>
              <input
                required
                name="address"
                value={payLoad?.guarantors?.[1]?.address || ""}
                onChange={(e) => {
                  handleInputChangeForArray(e, 1);
                }}
                className="w3-input w3-border w3-col w3-text-white w3-round-large regFormInput"
                placeholder="Address"
              />
            </div>
          </div> */}
            {/* Phone Number */}
            {/* <div className="w3-col w3-margin-bottom">
            <div className="w3-col l12 s12 m12">
              <span className="w3-small w3-text-white myfont1">
                Phone Number
              </span>
              <input
                required
                name="phoneNumber"
                value={payLoad?.guarantors?.[1]?.phoneNumber || ""}
                onChange={(e) => {
                  handleInputChangeForArray(e, 1);
                }}
                className="w3-input w3-border w3-col w3-text-white w3-round-large regFormInput"
                placeholder="Phone Number"
                type="tel" // Using type="tel" for phone number input
              />
            </div>
          </div> */}
            {/* Occupation */}
            {/* <div className="w3-col w3-margin-bottom">
            <div className="w3-col l12 s12 m12">
              <span className="w3-small w3-text-white myfont1">Occupation</span>
              <input
                required
                name="occupation"
                value={payLoad?.guarantors?.[1]?.occupation || ""}
                onChange={(e) => {
                  handleInputChangeForArray(e, 1);
                }}
                className="w3-input w3-border w3-col w3-text-white w3-round-large regFormInput"
                placeholder="Occupation"
              />
            </div>
          </div> */}
          </div>

          {/* Button Here */}

          <div className="w3-col regButtonSpace">
            <br />
          </div>

          <div className="w3-padding regButtonHolder">
            <div className="w3-content">
              <button
                className="w3-btn regButton w3-col w3-round-large"
                disabled={formLoading}
              >
                {!formLoading ? (
                  "Register"
                ) : (
                  <LoadingOutlined rev={undefined} />
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TenantRegistrationForm;
