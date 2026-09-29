import {
  BookOutlined,
  CalendarOutlined,
  LoadingOutlined,
  SafetyCertificateOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { adminAddTenantApi } from "../../../../apiservice/admin-General-ApiService";
import {
  IAdminAddTenantResult,
  IAdminApartmentData,
  IAdminBuildingsData,
} from "../../../../apiservice/admin-General-ApiService.type";
import useFormatApiRequest from "../../../../hooks/formatApiRequest";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../../Redux/reduxCustomHook";
import { RootState } from "../../../../Redux/store";
import { formatCurrency } from "../../../../utils/basic.utils";
import {
  getInputValue,
  guarantorFields,
  guarantorsToCollect,
  IFormField,
  personalFields,
  renderField,
  schoolFields,
  secondaryOccupantFields,
  toFormData,
} from "../../../userscomponents/apartmentsFormsComp/registratiionForms/registrationFields";
import "../../../userscomponents/apartmentsFormsComp/registratiionForms/tenantRegistration.css";

// Only admins set these. Documents are optional here, as the admin may not have them yet
const accountFields: IFormField[] = [
  {
    name: "password",
    label: "Password",
    placeholder: "Leave empty to generate one and email it",
    type: "password",
    required: false,
  },
];

const tenancyFields: IFormField[] = [
  { name: "entryDate", label: "Date of Entry", type: "date" },
  {
    name: "amountPaid",
    label: "Amount Paid",
    type: "number",
    required: false,
  },
];

// Documents are optional when an admin adds a tenant
const optionalFiles = (fields: IFormField[]) =>
  fields.map((field) =>
    field.type === "file" ? { ...field, required: false } : field
  );

export const AdminTenantRegistrationForm: React.FC<{}> = () => {
  const [loadApi, setLoadApi] = useState(false);
  const [payLoad, setpayLoad] = useState<any>({ guarantors: [{}, {}] });
  const [formLoading, setFormLoading] = useState<boolean>(false);

  // For Navigator/Redux
  const selectedBuilding: IAdminBuildingsData = useAppSelector(
    (state: RootState) => state?.AdminSelectedBuilding
  );

  const selectedApartment: IAdminApartmentData = useAppSelector(
    (state: RootState) => state?.AdminSelectedApartment
  );

  const params = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // Extra rent for a secondary occupant. 0 means this apartment doesn't allow one
  const secondaryPrice = selectedApartment?.secondaryPrice || 0;
  const hasSecondaryOccupant =
    secondaryPrice > 0 && !!payLoad?.hasSecondaryOccupant;
  const totalRent =
    (selectedApartment?.price || 0) +
    (hasSecondaryOccupant ? secondaryPrice : 0);

  // Use to collect Input change Change
  const handleInputChange = (event: any) => {
    const [name, value] = getInputValue(event);
    setpayLoad((values: any) => ({ ...values, [name]: value }));
  };

  // Use to collect Input change Change
  const handleInputChangeForArray = (event: any, index: number) => {
    const [name, value] = getInputValue(event);
    setpayLoad((values: any) => {
      const guarantors = [...values.guarantors];
      guarantors[index] = { ...guarantors[index], [name]: value };
      return { ...values, guarantors };
    });
  };

  // Use to Submit Form
  const handleSubmit = (event: any) => {
    event.preventDefault();
    setLoadApi(true);
    setFormLoading(true);
  };

  // A custom hook to save form data
  const result = useFormatApiRequest(
    () =>
      adminAddTenantApi(
        toFormData({
          ...payLoad,
          hasSecondaryOccupant,
          apartmentId: selectedApartment.id || params?.id,
        })
      ),
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
      const tenantResult: IAdminAddTenantResult = result.data;

      // Update Selected Tenant Data
      dispatch({
        type: "ADMIN_ADD_SELECTED_TENANT",
        payload: tenantResult?.data,
      });

      // Update Selected Apartment Occupied State
      dispatch({
        type: "ADMIN_ADD_SELECTED_APARTMENT",
        payload: { ...selectedApartment, isOccupied: true },
      });
      setFormLoading(false);
      alert("New Occupant Have being added");
      navigate(-1);
      setpayLoad({ guarantors: [{}, {}] });
      // Handle Success Here
    } else if (result.httpState === "ERROR") {
      setFormLoading(false);
      alert(result.data?.response?.data?.message || result.errorMsg);
      //Handle Error Here
    }
  };

  const renderSection = (
    icon: React.ReactNode,
    title: string,
    hint: string,
    children: React.ReactNode
  ) => (
    <section className="regSection">
      <div className="regSectionHeader">
        <span className="regSectionIcon">{icon}</span>
        <div>
          <h3 className="regSectionTitle myfont3">{title}</h3>
          <p className="regSectionHint myfont1">{hint}</p>
        </div>
      </div>
      <div className="regGrid">{children}</div>
    </section>
  );

  const renderFields = (fields: IFormField[]) =>
    fields.map((field) =>
      renderField(
        field,
        payLoad?.[field.name] || "",
        handleInputChange,
        `admin-reg-${field.name}`
      )
    );

  return (
    <div className="w3-container">
      <div className="w3-content regFormWrapper">
        <form onSubmit={handleSubmit}>
          {/* Pre Form Text */}
          <div className="w3-margin-bottom">
            <p className="w3-text-white w3-center">
              <b>
                Add Occupant to{" "}
                {`${selectedBuilding.title} - ${selectedApartment.title}`}
              </b>
            </p>
            <p className="w3-text-white regPreFormText myfont1">
              {selectedBuilding.description}
            </p>
          </div>

          {renderSection(
            <UserOutlined />,
            "Personal Information",
            "The tenant's details. Fields marked * are required.",
            renderFields([...personalFields, ...accountFields])
          )}

          {renderSection(
            <BookOutlined />,
            "School Information",
            "Passport and JAMB admission letter photos can be added later.",
            renderFields(optionalFiles(schoolFields))
          )}

          {/* Secondary Occupant, only for apartments that allow one */}
          {secondaryPrice > 0 &&
            renderSection(
              <TeamOutlined />,
              "Secondary Occupant",
              `This apartment can be shared with one other person for an extra ${formatCurrency(
                secondaryPrice
              )} per year.`,
              <>
                <div className="regField regFieldFull">
                  <label
                    htmlFor="admin-reg-hasSecondaryOccupant"
                    className="regLabel myfont1"
                  >
                    Will someone share this apartment with the tenant?
                    <span className="regRequired">*</span>
                  </label>
                  <select
                    id="admin-reg-hasSecondaryOccupant"
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
                    <option value="no">No</option>
                    <option value="yes">
                      Yes, add a secondary occupant (+
                      {formatCurrency(secondaryPrice)})
                    </option>
                  </select>
                </div>
                {hasSecondaryOccupant &&
                  renderFields(optionalFiles(secondaryOccupantFields))}
              </>
            )}

          {/* Guarantors */}
          {guarantorsToCollect.map((index) => (
            <div key={index}>
              {renderSection(
                <SafetyCertificateOutlined />,
                `Guarantor ${index + 1}`,
                "Someone who can vouch for the tenant, such as a parent or guardian.",
                optionalFiles(guarantorFields).map((field) =>
                  renderField(
                    field,
                    payLoad?.guarantors?.[index]?.[field.name] || "",
                    (e) => handleInputChangeForArray(e, index),
                    `admin-reg-guarantor-${index}-${field.name}`
                  )
                )
              )}
            </div>
          ))}

          {renderSection(
            <CalendarOutlined />,
            "Tenancy",
            `The tenancy runs for one year from the date of entry. Amount paid defaults to ${formatCurrency(
              totalRent
            )}.`,
            renderFields(
              tenancyFields.map((field) =>
                field.name === "amountPaid"
                  ? { ...field, placeholder: formatCurrency(totalRent) }
                  : field
              )
            )
          )}

          {/* Button Here */}
          <div className="w3-col w3-margin-bottom">
            <button
              className="w3-btn regButton w3-col w3-round-large"
              disabled={formLoading}
            >
              {!formLoading ? (
                "Register Tenant"
              ) : (
                <LoadingOutlined rev={undefined} />
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminTenantRegistrationForm;
