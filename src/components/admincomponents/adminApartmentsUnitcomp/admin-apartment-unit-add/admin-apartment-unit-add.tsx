import { LoadingOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { sampleApiCall } from "../../../../apiservice/authService";
import { ITenantBuildingsData } from "../../../../apiservice/tenant-general-apiService.type.";
import useFormatApiRequest from "../../../../hooks/formatApiRequest";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../../Redux/reduxCustomHook";
import { RootState } from "../../../../Redux/store";
import "./admin-apartment-unit-add.css";

export const AdminAddApartmentUnitForm: React.FC<{}> = () => {
  const [loadApi, setLoadApi] = useState(false);
  const [payLoad, setpayLoad] = useState<any>({});
  const [formLoading, setFormLoading] = useState<boolean>(false);

  // For Navigator/Redux
  const selectedBuilding: ITenantBuildingsData = useAppSelector(
    (state: RootState) => state?.TenantSelectedBuilding
  );

  const params = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

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
    () => sampleApiCall(payLoad),
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
      alert("New Apartment Have Been Added to this Building");
      setpayLoad({});
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
        <form className="adminForm" onSubmit={handleSubmit}>
          {/* Form Header */}
          <div className="w3-col w3-margin-bottom">
            <h3 className="AdminFormInputHeader myfont1">
              {" "}
              Add Apartment Unit to the building {""}
            </h3>
          </div>

          {/* Forms Here */}
          <div className="w3-col">
            {/* Apartment Unit Name */}
            <div className="w3-col w3-margin-bottom">
              <div className="w3-col l12 s12 m12">
                <span className="w3-text-white w3-small  myfont1">
                  Apartment Unit Name
                </span>
              </div>
              <div className="w3-col l12 s12 m12">
                <input
                  required
                  name="title"
                  value={payLoad?.title || ""}
                  onChange={handleInputChange}
                  className="w3-input w3-border w3-col w3-text-white w3-border-white w3-round-large AdminFormInput"
                  placeholder="Name Of ApartMent Unit"
                />
              </div>
            </div>

            {/* Amount */}
            <div className="w3-col w3-margin-bottom">
              <div className="w3-col l12 s12 m12">
                <span className="w3-text-white w3-small myfont1">Amount</span>
              </div>
              <div className="w3-col l12 s12 m12">
                <input
                  required
                  name="price"
                  type="number"
                  value={payLoad?.price || ""}
                  onChange={handleInputChange}
                  className="w3-input w3-border w3-col w3-text-white w3-border-white w3-round-large AdminFormInput"
                  placeholder="Amount"
                />
              </div>
            </div>
          </div>

          {/* Button Here */}
          <div className="w3-col w3-margin-bottom">
            <button
              className="w3-btn regButton w3-round-large w3-col"
              disabled={formLoading}
            >
              {!formLoading ? (
                "Add Apartment Unit"
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

export default AdminAddApartmentUnitForm;
