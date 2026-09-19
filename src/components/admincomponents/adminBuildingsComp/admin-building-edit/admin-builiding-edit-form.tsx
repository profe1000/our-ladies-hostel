import { LoadingOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { adminEditBuildingsApi } from "../../../../apiservice/admin-General-ApiService";
import { IAdminBuildingsData } from "../../../../apiservice/admin-General-ApiService.type";
import { sampleApiCall } from "../../../../apiservice/authService";
import useFormatApiRequest from "../../../../hooks/formatApiRequest";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../../Redux/reduxCustomHook";
import { RootState } from "../../../../Redux/store";
import "./admin-builiding-edit.css";

export const AdminEditBuildingForm: React.FC<{}> = () => {
  const [loadApi, setLoadApi] = useState(false);
  const [payLoad, setpayLoad] = useState<any>({});
  const [formLoading, setFormLoading] = useState<boolean>(false);

  // For Navigator/Redux
  const selectedBuilding: IAdminBuildingsData = useAppSelector(
    (state: RootState) => state?.AdminSelectedBuilding
  );

  const params = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // This is use to Update Redux Dispatch Values
  useEffect(() => {
    setpayLoad({
      title: selectedBuilding.title,
      price: selectedBuilding.price,
      description: selectedBuilding.description,
      serviceCharge: selectedBuilding.serviceCharge,
    });
  }, []);

  // Use to collect Input change Change
  const handleInputChange = (event: any) => {
    const name = event.target.name;
    const value = event.target.value;
    setpayLoad((values: any) => ({ ...values, [name]: value }));
  };

  // Use to Submit Form
  const handleSubmit = (event: any) => {
    event.preventDefault();
    setLoadApi(true);
    setFormLoading(true);
  };

  // A custom hook to save form data
  const result = useFormatApiRequest(
    () => adminEditBuildingsApi(payLoad, params?.id || selectedBuilding.id),
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
      alert("Building Information Have been Updated");
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
          {/* Form Header */}
          <div className="w3-col w3-margin-bottom">
            <h3 className="AdminFormInputHeader myfont1"> Edit Building </h3>
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
          </div>

          {/* Button Here */}
          <div className="w3-col w3-margin-bottom">
            <button
              className="w3-btn regButton w3-round-large"
              disabled={formLoading}
            >
              {!formLoading ? (
                "Save Building"
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

export default AdminEditBuildingForm;
