// Fields shared by the tenant registration form and the admin "add tenant" form,
// so both collect the same details

export type IFormField = {
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

export const personalFields: IFormField[] = [
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

export const schoolFields: IFormField[] = [
  {
    name: "admissionNumber",
    label: "Matric/Admission Number",
    placeholder: "Matric or Admission Number",
  },
  { name: "passportImage", label: "Passport Photograph", type: "file" },
  { name: "admissionLetter", label: "JAMB Admission Letter", type: "file" },
];

export const secondaryOccupantFields: IFormField[] = [
  {
    name: "secondaryFirstName",
    label: "First Name",
    placeholder: "Secondary occupant's first name",
  },
  {
    name: "secondaryLastName",
    label: "Last Name",
    placeholder: "Secondary occupant's last name",
  },
  {
    name: "secondaryAdmissionNumber",
    label: "Matric/Admission Number",
    placeholder: "Matric or Admission Number",
    fullWidth: true,
  },
  {
    name: "secondaryPassportImage",
    label: "Passport Photograph",
    type: "file",
  },
  {
    name: "secondaryAdmissionLetter",
    label: "JAMB Admission Letter",
    type: "file",
  },
];

export const guarantorFields: IFormField[] = [
  { name: "fullName", label: "Full Name", placeholder: "Full Name" },
  {
    name: "phoneNumber",
    label: "Phone Number",
    placeholder: "Phone Number",
    type: "tel",
  },
  { name: "occupation", label: "Occupation", placeholder: "Occupation" },
  { name: "address", label: "Address", placeholder: "Address" },
  {
    name: "image",
    label: "Guardian Photograph",
    type: "file",
    fullWidth: true,
  },
];

// Guarantors to collect (index into payLoad.guarantors)
export const guarantorsToCollect = [0, 1];

// Sent as multipart/form-data so the images can be uploaded
export const toFormData = (data: any): FormData => {
  const formData = new FormData();
  const append = (key: string, value: any) => {
    if (value !== undefined && value !== null && value !== "") {
      formData.append(key, value);
    }
  };

  Object.keys(data).forEach((key) => {
    if (key === "guarantors") return;
    // Secondary occupant details are only sent when there is one
    const isSecondaryField = secondaryOccupantFields.some((f) => f.name === key);
    if (isSecondaryField && !data.hasSecondaryOccupant) return;
    append(key, data[key]);
  });
  (data.guarantors || []).forEach((guarantor: any, index: number) => {
    Object.keys(guarantor || {}).forEach((key) =>
      append(`guarantors[${index}].${key}`, guarantor[key])
    );
  });
  return formData;
};

// Reads an input/select/file change into [name, value]
export const getInputValue = (event: any): [string, any] => [
  event.target.name,
  event.target.type === "file" ? event.target.files?.[0] : event.target.value,
];

// Render an image upload with a preview of the selected file
const renderFileField = (
  field: IFormField,
  value: File | undefined,
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
    <input
      id={id}
      name={field.name}
      onChange={onChange}
      required={field.required !== false && !value}
      type="file"
      accept="image/*"
      className="w3-input w3-text-white regFormInput regFileInput myfont1"
    />
    {value instanceof File && (
      <img
        src={URL.createObjectURL(value)}
        alt={field.label}
        className="regFilePreview"
      />
    )}
  </div>
);

// Render a single input/select/file field
export const renderField = (
  field: IFormField,
  value: any,
  onChange: (event: any) => void,
  id: string
) =>
  field.type === "file" ? (
    renderFileField(field, value || undefined, onChange, id)
  ) : (
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
