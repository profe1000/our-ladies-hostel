import { LoadingOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { adminEditApartmentApi } from "../../../../apiservice/admin-General-ApiService";
import {
  IAdminApartmentData,
  IAdminBuildingsData,
} from "../../../../apiservice/admin-General-ApiService.type";
import { sampleApiCall } from "../../../../apiservice/authService";
import useFormatApiRequest from "../../../../hooks/formatApiRequest";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../../Redux/reduxCustomHook";
import { RootState } from "../../../../Redux/store";
import "./admin-apartment-unit-edit.css";

export const AdminEditApartmentUnitForm: React.FC<{}> = () => {
  const [loadApi, setLoadApi] = useState(false);
  const [payLoad, setpayLoad] = useState<any>({});
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

  // This is use to Update Redux Dispatch Values
  useEffect(() => {
    setpayLoad({
      title: selectedApartment.title,
      price: selectedApartment.price,
      serviceCharge: selectedApartment.serviceCharge,
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
    () => adminEditApartmentApi(payLoad, params?.id || selectedApartment.id),
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
      alert("Your Apartment Have been edited");
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
              Edit Apartment Unit{": Apartment Name -  Building Name"}
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
              className="w3-btn regButton w3-round-large w3-col"
              disabled={formLoading}
            >
              {!formLoading ? (
                "Edit Apartment Unit"
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

export default AdminEditApartmentUnitForm;
