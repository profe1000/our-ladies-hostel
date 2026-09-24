import { LoadingOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import "./CreateAdmin-Form.css";

import {
  adminGetSettingsApi,
  adminSaveGeneralSettingsApi,
} from "../../../../apiservice/admin-General-ApiService";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../../Redux/reduxCustomHook";
import { RootState } from "../../../../Redux/store";
import { IAdminSettingsData } from "../../../../apiservice/admin-General-ApiService.type";

// Business name used in emails sent to tenants and admins
const CreateAdminBusinessForm: React.FC<{}> = () => {
  const [formLoading, setFormLoading] = useState<boolean>(false);
  const [businessName, setBusinessName] = useState("");
  const dispatch = useAppDispatch();

  const adminSettingsData: IAdminSettingsData = useAppSelector(
    (state: RootState) => state?.AdminSettingData
  );

  useEffect(() => {
    setBusinessName(adminSettingsData?.businessName || "");
  }, [adminSettingsData?.businessName]);

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    setFormLoading(true);
    try {
      await adminSaveGeneralSettingsApi({ businessName: businessName.trim() });
      const response = await adminGetSettingsApi();
      dispatch({
        type: "ADMIN_ADD_SETTINGS",
        payload: response?.data || {},
      });
      alert("Business Name Updated");
    } catch (error: any) {
      alert(error?.response?.data?.message || error?.message || "Error");
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="w3-content">
      <div className="w3-container w3-margin-top">
        <h4>
          <span> Business Name</span>
        </h4>
      </div>

      <div className="w3-col w3-padding">
        <div style={{ paddingTop: "10px" }}>
          <form className="adminForm" onSubmit={handleSubmit}>
            <div className="w3-col w3-margin-bottom">
              <div className="w3-col l12 s12 m12">
                <span className="w3-small w3-text-white myfont1">
                  Shown in emails sent to tenants and admins
                </span>
                <input
                  required
                  name="businessName"
                  value={businessName}
                  onChange={(event) => setBusinessName(event.target.value)}
                  className="w3-input w3-border w3-col w3-text-white w3-round-large regFormInput"
                  placeholder="e.g. Our Ladies Hostel"
                />
              </div>
            </div>

            <div className="w3-col w3-margin-bottom w3-margin-top">
              <button
                disabled={formLoading}
                className="w3-btn regButton w3-col w3-round-large"
              >
                <span className="submitButtonText">
                  {!formLoading ? "Update Business Name" : <LoadingOutlined />}
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateAdminBusinessForm;
