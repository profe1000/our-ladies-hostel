import { LoadingOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminAddBuildingsApi } from "../../../../apiservice/admin-General-ApiService";
import { sampleApiCall } from "../../../../apiservice/authService";
import useFormatApiRequest from "../../../../hooks/formatApiRequest";
import { getFormData } from "../../../../utils/basic.utils";
import "./admin-builiding-add.css";

export const AdminAddBuilding: React.FC<{}> = () => {
  const [loadApi, setLoadApi] = useState(false);
  const [payLoad, setpayLoad] = useState<any>({});
  const [payLoadFormData, setpayLoadFormData] = useState<FormData>(
    getFormData({})
  );
  const [formLoading, setFormLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  // Use to collect Input change Change
  const handleInputChange = (event: any) => {
    const name = event.target.name;
    const value = name === "image" ? event.target.files[0] : event.target.value;
    setpayLoad((values: any) => ({ ...values, [name]: value }));
  };

  // Use to Submit Form
  const handleSubmit = (event: any) => {
    event.preventDefault();
    setpayLoadFormData(
      getFormData({
        ...payLoad,
      })
    );
    setLoadApi(true);
    setFormLoading(true);
  };

  // A custom hook to save form data
  const result = useFormatApiRequest(
    () => adminAddBuildingsApi(payLoadFormData),
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
      alert("Your Building have being Added");
      navigate("/admin/Buildings");
      // Handle Success Here
    } else if (result.httpState === "ERROR") {
      setFormLoading(false);
      alert(
        result.data?.response?.data?.errors[0] ||
          result.data?.response?.data?.message ||
          result.errorMsg
      );
      //Handle Error Here
    }
  };

  return (
    <div className="w3-col w3-container">
      <div className="w3-content">
        <form onSubmit={handleSubmit}>
          {/* Form Header */}
          <div className="w3-col w3-margin-bottom">
            <h3 className="AdminFormInputHeader myfont1"> Add Building </h3>
          </div>

          {/* Forms Here */}
          <div className="w3-col">
            {/* Title */}
            <div className="w3-col w3-margin-bottom">
              <div className="w3-col l12 s12 m12">
                <span className="w3-text-white w3-small  myfont1">Title</span>
              </div>
              <div className="w3-col l12 s12 m12">
                <input
                  required
                  name="title"
                  value={payLoad?.title || ""}
                  onChange={handleInputChange}
                  className="w3-input w3-border w3-col w3-text-white w3-round-large AdminFormInput"
                  placeholder="Title"
                />
              </div>
            </div>

            {/* Building Description  */}
            <div className="w3-col w3-margin-bottom">
              <div className="w3-col l12 s12 m12">
                <span className="w3-text-white w3-small  myfont1">
                  Building Description
                </span>
              </div>
              <div className="w3-col l12 s12 m12">
                <input
                  required
                  name="description"
                  value={payLoad?.description || ""}
                  onChange={handleInputChange}
                  className="w3-input w3-border w3-col w3-text-white w3-round-large AdminFormInput"
                  placeholder="Description Of Building"
                />
              </div>
            </div>

            {/* Number Of Apartments  */}
            <div className="w3-col w3-margin-bottom">
              <div className="w3-col l12 s12 m12">
                <span className="w3-text-white w3-small  myfont1">
                  Number of Apartments
                </span>
              </div>
              <div className="w3-col l12 s12 m12">
                <input
                  required
                  name="noOfApartments"
                  value={payLoad?.noOfApartments || ""}
                  onChange={handleInputChange}
                  type={"number"}
                  className="w3-input w3-border w3-col w3-text-white w3-round-large AdminFormInput"
                  placeholder="Number of Apartment"
                />
              </div>
            </div>

            {/* Rent Price */}
            <div className="w3-col w3-margin-bottom">
              <div className="w3-col l12 s12 m12">
                <span className="w3-text-white w3-small  myfont1">Price</span>
              </div>
              <div className="w3-col l12 s12 m12">
                <input
                  required
                  name="price"
                  value={payLoad?.price || ""}
                  type={"number"}
                  onChange={handleInputChange}
                  className="w3-input w3-border w3-col w3-text-white w3-round-large AdminFormInput"
                  placeholder="Amount of Rent"
                />
              </div>
            </div>

            {/* Service Charge */}
            <div className="w3-col w3-margin-bottom">
              <div className="w3-col l12 s12 m12">
                <span className="w3-text-white w3-small myfont1">
                  Service Charge
                </span>
              </div>
              <div className="w3-col l12 s12 m12">
                <input
                  required
                  name="serviceCharge"
                  value={payLoad?.serviceCharge || ""}
                  type={"number"}
                  onChange={handleInputChange}
                  className="w3-input w3-border w3-col w3-text-white w3-round-large AdminFormInput"
                  placeholder="Amount of Service Charge"
                />
              </div>
            </div>

            {/* Image */}
            <div className="w3-col w3-margin-bottom">
              <div className="w3-col l12 s12 m12">
                <span className="w3-text-white w3-small  myfont1">Image</span>
              </div>
              <div className="w3-col l12 s12 m12">
                <input
                  required
                  name="image"
                  accept="image/*"
                  type="file"
                  onChange={handleInputChange}
                  className="w3-input w3-border w3-col w3-text-white w3-round-large AdminFormInput"
                  placeholder="Select A file"
                />
              </div>
            </div>
          </div>

          {/* Button Here */}
          <div className="w3-col w3-margin-bottom">
            <button
              className="w3-btn w3-round-large regButton w3-col"
              disabled={formLoading}
            >
              {!formLoading ? (
                "Add Building"
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

export default AdminAddBuilding;
