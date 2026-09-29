import {
  BookOutlined,
  LoadingOutlined,
  SafetyCertificateOutlined,
  TeamOutlined,
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
import { formatCurrency } from "../../../../utils/basic.utils";
import {
  guarantorFields,
  guarantorsToCollect,
  personalFields,
  renderField,
  schoolFields,
  secondaryOccupantFields,
  toFormData,
} from "./registrationFields";
import "./tenantRegistration.css";

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
        admissionNumber: "UNILAG/2026/0001",
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

  // Extra rent for a secondary occupant. 0 means this apartment doesn't allow one
  const secondaryPrice = selectedApartment?.secondaryPrice || 0;
  const hasSecondaryOccupant = secondaryPrice > 0 && !!payLoad?.hasSecondaryOccupant;

  // Keep the apartment in sync (it may be reloaded after a page refresh)
  useEffect(() => {
    setpayLoad((values: any) => ({
      ...values,
      apartmentId: selectedApartment?.id,
      // An apartment without a secondary price can't have a secondary occupant
      hasSecondaryOccupant: secondaryPrice > 0 ? !!values.hasSecondaryOccupant : false,
    }));
  }, [selectedApartment?.id, secondaryPrice]);

  // Use to collect Input change Change
  const handleInputChange = (event: any) => {
    const name = event.target.name;
    const value =
      event.target.type === "file" ? event.target.files?.[0] : event.target.value;
    setpayLoad((values: any) => ({ ...values, [name]: value }));
  };

  // Use to collect Input change Change
  const handleInputChangeForArray = (event: any, index) => {
    const name = event.target.name;
    const value =
      event.target.type === "file" ? event.target.files?.[0] : event.target.value;
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
    () => tenantRegistrationApi(toFormData(payLoad)),
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
      alert(
        "Your form has been submitted. An email will be sent to you shortly to make payment."
      );
      navigate("/", { replace: true });
      // Handle Success Here
    } else if (result.httpState === "ERROR") {
      setFormLoading(false);
      alert(result.data?.response?.data?.message || result.errorMsg);
      //Handle Error Here
    }
  };

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

          {/* School Information */}
          <section className="regSection">
            <div className="regSectionHeader">
              <span className="regSectionIcon">
                <BookOutlined />
              </span>
              <div>
                <h3 className="regSectionTitle myfont3">School Information</h3>
                <p className="regSectionHint myfont1">
                  Upload clear photos of your passport and JAMB admission
                  letter.
                </p>
              </div>
            </div>
            <div className="regGrid">
              {schoolFields.map((field) =>
                renderField(
                  field,
                  payLoad?.[field.name] || "",
                  handleInputChange,
                  `reg-${field.name}`
                )
              )}
            </div>
          </section>

          {/* Secondary Occupant, only for apartments that allow one */}
          {secondaryPrice > 0 && (
            <section className="regSection">
              <div className="regSectionHeader">
                <span className="regSectionIcon">
                  <TeamOutlined />
                </span>
                <div>
                  <h3 className="regSectionTitle myfont3">
                    Secondary Occupant
                  </h3>
                  <p className="regSectionHint myfont1">
                    You can share this apartment with one other person for an
                    extra {formatCurrency(secondaryPrice)} per year.
                  </p>
                </div>
              </div>
              <div className="regGrid">
                <div className="regField regFieldFull">
                  <label
                    htmlFor="reg-hasSecondaryOccupant"
                    className="regLabel myfont1"
                  >
                    Will someone share this apartment with you?
                    <span className="regRequired">*</span>
                  </label>
                  <select
                    id="reg-hasSecondaryOccupant"
                    name="hasSecondaryOccupant"
                    value={hasSecondaryOccupant ? "yes" : "no"}
                    onChange={(e) =>
                      setpayLoad((values: any) => ({
                        ...values,
                        hasSecondaryOccupant: e.target.value === "yes",
                      }))
                    }
                    className="w3-input w3-text-white regFormInput myfont1"
                  >
                    <option value="no">No, just me</option>
                    <option value="yes">
                      Yes, add a secondary occupant (+
                      {formatCurrency(secondaryPrice)})
                    </option>
                  </select>
                </div>

                {hasSecondaryOccupant &&
                  secondaryOccupantFields.map((field) =>
                    renderField(
                      field,
                      payLoad?.[field.name] || "",
                      handleInputChange,
                      `reg-${field.name}`
                    )
                  )}

                <div className="regField regFieldFull regPriceSummary myfont1">
                  <div className="regPriceRow">
                    <span>Rent</span>
                    <span>{formatCurrency(selectedApartment?.price)}</span>
                  </div>
                  {hasSecondaryOccupant && (
                    <div className="regPriceRow">
                      <span>Secondary occupant</span>
                      <span>+{formatCurrency(secondaryPrice)}</span>
                    </div>
                  )}
                  <div className="regPriceRow regPriceTotal myfont3">
                    <span>Total rent per year</span>
                    <span>
                      {formatCurrency(
                        (selectedApartment?.price || 0) +
                          (hasSecondaryOccupant ? secondaryPrice : 0)
                      )}
                    </span>
                  </div>
                  <span className="regSectionHint">
                    Service charge and one-off fees are added when you pay.
                  </span>
                </div>
              </div>
            </section>
          )}

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
                    Someone who can vouch for you, such as a parent or
                    guardian.
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
