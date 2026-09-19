import { LoadingOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { adminEditBuildingsImageApi } from "../../../../apiservice/admin-General-ApiService";
import { IAdminBuildingsData } from "../../../../apiservice/admin-General-ApiService.type";
import { sampleApiCall } from "../../../../apiservice/authService";
import useFormatApiRequest from "../../../../hooks/formatApiRequest";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../../Redux/reduxCustomHook";
import { RootState } from "../../../../Redux/store";
import { getFormData } from "../../../../utils/basic.utils";
import "./admin-builiding-edit.css";

export const AdminEditBuildingImage: React.FC<{}> = () => {
  const [loadApi, setLoadApi] = useState(false);
  const [payLoad, setpayLoad] = useState<any>({});
  const [payLoadFormData, setpayLoadFormData] = useState<FormData>(
    getFormData({})
  );
  const [formLoading, setFormLoading] = useState<boolean>(false);

  // For Navigator/Redux
  const selectedBuilding: IAdminBuildingsData = useAppSelector(
    (state: RootState) => state?.AdminSelectedBuilding
  );

  const params = useParams();
  const dispatch = useAppDispatch();
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
    () =>
      adminEditBuildingsImageApi(
        payLoadFormData,
        params?.id || selectedBuilding.id
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
      setFormLoading(false);
      alert("Image have been Updated");
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
            <h3 className="AdminFormInputHeader myfont1">
              {" "}
              Edit Building Image{" "}
            </h3>
          </div>

          {/* Forms Here */}
          <div className="w3-col">
            {/* Image Preview */}
            <div className="w3-col w3-margin-bottom">
              <div className="w3-col l12 s12 m12">
                <span className="w3-text-white w3-small  myfont1">
                  Current Image Preview
                </span>
              </div>
              <div className="w3-col l12 s12 m12">
                <img
                  className="w3-round-large"
                  alt="Building"
                  src={selectedBuilding.imageUrl}
                  style={{
                    maxWidth: "100%",
                    height: "100px",
                  }}
                />
              </div>
            </div>
            {/* Image */}
            <div className="w3-col w3-margin-bottom">
              <div className="w3-col l12 s12 m12">
                <span className="w3-text-white w3-small  myfont1">
                  Select New Image
                </span>
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
              className="w3-btn regButton w3-round-large"
              disabled={formLoading}
            >
              {!formLoading ? (
                "Update Building Image"
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

export default AdminEditBuildingImage;
