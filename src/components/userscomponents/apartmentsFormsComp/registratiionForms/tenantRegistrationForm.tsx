import {
  LoadingOutlined,
  SafetyCertificateOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { tenantRegistrationApi } from "../../../../apiservice/tenant-general-apiService";
import {
  ITenantApartmentData,
  ITenantRegistration,
} from "../../../../apiservice/tenant-general-apiService.type.";
import useFormatApiRequest from "../../../../hooks/formatApiRequest";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../../Redux/reduxCustomHook";
import { RootState } from "../../../../Redux/store";
import "./tenantRegistration.css";

type IFormField = {
  name: string;
  label: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  fullWidth?: boolean;
  options?: { value: string; label: string }[];
};

const personalFields: IFormField[] = [
  { name: "firstName", label: "First Name", placeholder: "First Name" },
  { name: "lastName", label: "Last Name", placeholder: "Last Name" },
  { name: "email", label: "Email", placeholder: "Email", type: "email" },
  {
    name: "phoneNumber",
    label: "Phone Number",
    placeholder: "Phone Number",
    type: "tel",
  },
  {
    name: "nin",
    label: "NIN",
    placeholder: "National Identification Number",
    type: "number",
    minLength: 11,
    maxLength: 11,
  },
  {
    name: "occupation",
    label: "Occupation",
    placeholder: "Occupation",
  },
  {
    name: "address",
    label: "Address",
    placeholder: "Address",
    fullWidth: true,
  },
  {
    name: "gender",
    label: "Gender",
    options: [
      { value: "", label: "Select Gender" },
      { value: "male", label: "Male" },
      { value: "female", label: "Female" },
    ],
  },
  {
    name: "maritalStatus",
    label: "Marital Status",
    options: [
      { value: "", label: "Select" },
      { value: "single", label: "Single" },
      { value: "married", label: "Married" },
    ],
  },
  {
    name: "religion",
    label: "Religion",
    required: false,
    options: [
      { value: "", label: "Select Religion" },
      { value: "christain", label: "Christian" },
      { value: "muslim", label: "Muslim" },
      { value: "others", label: "Others" },
    ],
  },
  {
    name: "noOfOccupants",
    label: "No. of Occupants",
    placeholder: "Number of Occupants",
    type: "number",
  },
  {
    name: "noOfVehicles",
    label: "No. of Vehicles",
    placeholder: "Number of Vehicles",
    type: "number",
  },
  {
    name: "reason",
    label: "Reason",
    placeholder: "Why are you looking for accommodation?",
    fullWidth: true,
  },
];

const guarantorFields: IFormField[] = [
  { name: "fullName", label: "Full Name", placeholder: "Full Name" },
  {
    name: "phoneNumber",
    label: "Phone Number",
    placeholder: "Phone Number",
    type: "tel",
  },
  { name: "occupation", label: "Occupation", placeholder: "Occupation" },
  { name: "address", label: "Address", placeholder: "Address" },
];

// Guarantors to collect (index into payLoad.guarantors)
const guarantorsToCollect = [0,1];

// TODO(remove): TEMPORARY TEST DATA - delete this block and the
// `testPrefill` use below once testing is done. It only applies to
// `npm start` (development), never to a production build.
const testPrefill =
  process.env.NODE_ENV === "development"
    ? {
        firstName: "Test",
        lastName: "Tenant",
        email: "test.tenant.apt28@example.com",
        phoneNumber: "+2348012345678",
        nin: "12345678901",
        occupation: "Student",
        address: "12 Sample Street, Lagos, Nigeria",
        gender: "female",
        maritalStatus: "single",
        religion: "christain",
        noOfOccupants: "1",
        noOfVehicles: "0",
        reason: "Test registration from the development environment",
        guarantors: [
          {
            fullName: "Jane Guarantor",
            phoneNumber: "+2348087654321",
            occupation: "Teacher",
            address: "45 Guarantor Avenue, Abuja, Nigeria",
          },
          {
            fullName: "John Guarantor",
            phoneNumber: "+2348098765432",
            occupation: "Engineer",
            address: "78 Reference Road, Port Harcourt, Nigeria",
          },
        ],
      }
    : {};

export const TenantRegistrationForm: React.FC<{}> = () => {
  const [loadApi, setLoadApi] = useState(false);
  const [payLoad, setpayLoad] = useState<any>({
    guarantors: [{}, {}],
    ...JSON.parse(JSON.stringify(testPrefill)), // TODO(remove): temporary test data
  });
  const [formLoading, setFormLoading] = useState<boolean>(false);

  // For Navigator/Redux
  const selectedApartment: ITenantApartmentData = useAppSelector(
    (state: RootState) => state?.TenantSelectedApartment
  );

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // Keep the apartment in sync (it may be reloaded after a page refresh)
  useEffect(() => {
    setpayLoad((values: any) => ({
      ...values,
      apartmentId: selectedApartment?.id,
    }));
  }, [selectedApartment?.id]);

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

  // Render a single input/select field
  const renderField = (
    field: IFormField,
    value: string,
    onChange: (event: any) => void,
    id: string
  ) => (
    <div
      key={id}
      className={`regField ${field.fullWidth ? "regFieldFull" : ""}`}
    >
      <label htmlFor={id} className="regLabel myfont1">
        {field.label}
        {field.required !== false && <span className="regRequired">*</span>}
      </label>
      {field.options ? (
        <select
          id={id}
          name={field.name}
          value={value}
          onChange={onChange}
          required={field.required !== false}
          className="w3-input w3-text-white regFormInput myfont1"
        >
          {field.options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={id}
          name={field.name}
          value={value}
          onChange={onChange}
          required={field.required !== false}
          type={field.type || "text"}
          minLength={field.minLength}
          maxLength={field.maxLength}
          placeholder={field.placeholder}
          className="w3-input w3-text-white regFormInput myfont1"
        />
      )}
    </div>
  );

  return (
    <div className="w3-container">
      <div className="w3-content regFormWrapper">
        <form onSubmit={handleSubmit}>
          {/* Personal Information */}
          <section className="regSection">
            <div className="regSectionHeader">
              <span className="regSectionIcon">
                <UserOutlined />
              </span>
              <div>
                <h3 className="regSectionTitle myfont3">
                  Personal Information
                </h3>
                <p className="regSectionHint myfont1">
                  Tell us about yourself. Fields marked * are required.
                </p>
              </div>
            </div>
            <div className="regGrid">
              {personalFields.map((field) =>
                renderField(
                  field,
                  payLoad?.[field.name] || "",
                  handleInputChange,
                  `reg-${field.name}`
                )
              )}
            </div>
          </section>

          {/* Guarantors */}
          {guarantorsToCollect.map((index) => (
            <section className="regSection" key={index}>
              <div className="regSectionHeader">
                <span className="regSectionIcon">
                  <SafetyCertificateOutlined />
                </span>
                <div>
                  <h3 className="regSectionTitle myfont3">
                    Guarantor {index + 1}
                  </h3>
                  <p className="regSectionHint myfont1">
                    Someone who can vouch for you.
                  </p>
                </div>
              </div>
              <div className="regGrid">
                {guarantorFields.map((field) =>
                  renderField(
                    field,
                    payLoad?.guarantors?.[index]?.[field.name] || "",
                    (e) => handleInputChangeForArray(e, index),
                    `reg-guarantor-${index}-${field.name}`
                  )
                )}
              </div>
            </section>
          ))}

          {/* Button Here */}
          <div className="w3-col regButtonSpace">
            <br />
          </div>

          <div className="w3-padding regButtonHolder">
            <div className="w3-content">
              <button
                className="w3-btn regButton w3-col w3-round-large myfont3"
                disabled={formLoading || !payLoad?.apartmentId}
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
