import { LoadingOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  adminGetOccupantSingleApi,
  adminUpdateOccupantPeriodApi,
  adminUpdateTenantApi,
} from "../../../../apiservice/admin-General-ApiService";
import {
  CurrentOccupant,
  IAdminApartmentData,
  IAdminBuildingsData,
  IAdminTenantsData,
} from "../../../../apiservice/admin-General-ApiService.type";
import useFormatApiRequest from "../../../../hooks/formatApiRequest";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../../Redux/reduxCustomHook";
import { RootState } from "../../../../Redux/store";
import "./admin-tenant-edit-form.css";

export const AdminOccupantDateEditForm: React.FC<{}> = () => {
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

  const selectedOccupant: CurrentOccupant = useAppSelector(
    (state: RootState) => state?.AdminSelectedOccupant
  );

  const selectedTenant: IAdminTenantsData = useAppSelector(
    (state: RootState) => state?.AdminSelectedTenant
  );

  const params = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // This is use to Update Redux Dispatch Values
  useEffect(() => {
    setpayLoad({
      startDate: formatDate(selectedOccupant?.startDate),
      endDate: formatDate(selectedOccupant?.endDate),
    });
  }, []);

  const formatDate = (isoString: string) => {
    return isoString ? isoString.split("T")[0] : "";
  };

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
    () => adminUpdateOccupantPeriodApi(selectedOccupant?.id, payLoad),
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
      alert("Tenant details have being updated.");
      refreshOccupantInfo();
      // Handle Success Here
    } else if (result.httpState === "ERROR") {
      setFormLoading(false);
      alert(result.data?.response?.data?.message || result.errorMsg);
      //Handle Error Here
    }
  };

  const refreshOccupantInfo = async () => {
    try {
      const response = await adminGetOccupantSingleApi(selectedOccupant?.id);
      dispatch({
        type: "ADMIN_ADD_SELECTED_OCCUPANT",
        payload: response?.data || {},
      });
    } catch (error) {
      console.error("Error fetching data:", error);
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
              <p className="w3-text-white w3-center  w3-margin-bottom">
                <b> Update Occupant Date Information </b>
              </p>
            </div>

            {/* Personal Information  */}
            <div className="w3-col w3-margin-bottom">
              <h3 className="w3-text-white regPreFormText myfont1  w3-margin-top w3-margin-bottom">
                {selectedBuilding.title + " -- " + selectedApartment?.title}
              </h3>

              <h3 className="w3-text-white myfont1 w3-medium">
                <b> Occupant Name : {selectedTenant?.fullName} </b>
              </h3>
            </div>

            {/* Entry Date */}
            <div className="w3-col w3-margin-bottom">
              <div className="w3-col l12 s12 m12">
                <span className="w3-small w3-text-white myfont1">
                  {" "}
                  Entry Date{" "}
                </span>
                <input
                  required
                  name="startDate"
                  value={payLoad?.startDate || ""}
                  onChange={handleInputChange}
                  className="w3-input w3-border w3-col w3-text-white w3-round-large regFormInput "
                  placeholder="Start Date"
                  type="date"
                />
              </div>
            </div>

            {/* Expire Date */}
            <div className="w3-col w3-margin-bottom">
              <div className="w3-col l12 s12 m12">
                <span className="w3-small w3-text-white myfont1">Due Date</span>
                <input
                  required
                  name="endDate"
                  value={payLoad?.endDate || ""}
                  onChange={handleInputChange}
                  className="w3-input w3-border w3-col w3-text-white w3-round-large regFormInput "
                  placeholder="End Date"
                  type="date"
                />
              </div>
            </div>
          </div>

          {/* Button Here */}
          <div className="w3-col w3-margin-bottom">
            <button
              className="w3-btn regButton w3-col w3-round-large"
              disabled={formLoading}
            >
              {!formLoading ? (
                "Update Occupancy Date Information"
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

export default AdminOccupantDateEditForm;
