import { LoadingOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { adminAddApartmentsCostApi } from "../../../../apiservice/admin-General-ApiService";
import { sampleApiCall } from "../../../../apiservice/authService";
import {
  ITenantBuildingsData,
  ITenantApartmentData,
} from "../../../../apiservice/tenant-general-apiService.type.";
import useFormatApiRequest from "../../../../hooks/formatApiRequest";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../../Redux/reduxCustomHook";
import { RootState } from "../../../../Redux/store";
import "./admin-unitcost-add.css";

export const AdminAddUnitCost: React.FC<{}> = () => {
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

  // Use to collect Input change Change
  const handleInputChange = (event: any) => {
    const name = event.target.name;
    const value = event.target.value;
    setpayLoad((values: any) => ({ ...values, [name]: value }));
  };

  // Use to Submit Form
  const handleSubmit = (event: any) => {
    event.preventDefault();
    setpayLoad({ ...payLoad, apartmentId: params?.id });
    setLoadApi(true);
    setFormLoading(true);
  };

  // A custom hook to save form data
  const result = useFormatApiRequest(
    () => adminAddApartmentsCostApi(payLoad),
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
      alert("Cost Have Being Added");
      setpayLoad({});

      dispatch({
        type: "ADMIN_CHANGE_APARTMENT_COST_LOAD_STATE",
        payload: true,
      });
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
            <h3 className="AdminFormInputHeaderCost myfont1">
              Add Cost Incured on this Apartment
            </h3>
          </div>

          {/* Forms Here */}
          <div className="w3-col">
            {/* Cost Name */}
            <div className="w3-col w3-margin-bottom">
              <div className="w3-col l12 s12 m12">
                <span className="w3-text-white w3-small  myfont1">
                  Cost Title
                </span>
              </div>
              <div className="w3-col l12 s12 m12">
                <input
                  required
                  name="title"
                  value={payLoad?.title || ""}
                  onChange={handleInputChange}
                  className="w3-input w3-border w3-col w3-text-white w3-border-white w3-round-large AdminFormInput"
                  placeholder="Cost Title"
                />
              </div>
            </div>

            {/* Amount */}
            <div className="w3-col w3-margin-bottom">
              <div className="w3-col l12 s12 m12">
                <span className="w3-text-white w3-small w3-round myfont1">
                  Amount
                </span>
              </div>
              <div className="w3-col l12 s12 m12">
                <input
                  required
                  name="amount"
                  value={payLoad?.amount || ""}
                  onChange={handleInputChange}
                  className="w3-input w3-border w3-col w3-text-white w3-border-white w3-round-large  AdminFormInput"
                  placeholder="Amount"
                  type="number" // Assuming the amount is numeric
                />
              </div>
            </div>

            {/* Date Issued */}
            <div className="w3-col w3-margin-bottom">
              <div className="w3-col l12 s12 m12">
                <span className="w3-text-white w3-small w3-round myfont1">
                  Date Issued
                </span>
              </div>
              <div className="w3-col l12 s12 m12">
                <input
                  required
                  name="dateIssued"
                  value={payLoad?.dateIssued || ""}
                  onChange={handleInputChange}
                  className="w3-input w3-border w3-col w3-text-white w3-border-white w3-round-large  AdminFormInput"
                  placeholder="Date Issued"
                  type="date" // Assuming the date is in the format YYYY-MM-DD
                />
              </div>
            </div>
          </div>

          {/* Button Here */}
          <div className="w3-col w3-margin-bottom">
            <button
              className="w3-btn regButton w3-round-large  w3-col"
              disabled={formLoading}
            >
              {!formLoading ? "Add Cost" : <LoadingOutlined rev={undefined} />}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminAddUnitCost;
