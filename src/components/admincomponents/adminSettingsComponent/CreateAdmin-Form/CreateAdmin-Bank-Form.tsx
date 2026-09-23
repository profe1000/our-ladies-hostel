import { LoadingOutlined, MailOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import "./CreateAdmin-Form.css";

import useFormatApiRequest from "../../../../hooks/formatApiRequest";
import {
  adminAddAdminApi,
  adminGetSettingsApi,
  adminSaveBankAccountApi,
} from "../../../../apiservice/admin-General-ApiService";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../../Redux/reduxCustomHook";
import { RootState } from "../../../../Redux/store";
import { IAdminSettingsData } from "../../../../apiservice/admin-General-ApiService.type";

type ICreateAdminBankForm = {};

const CreateAdminBankForm: React.FC<ICreateAdminBankForm> = ({}) => {
  const [formLoading, setFormLoading] = useState<boolean>(false);
  const [user, setUser] = useState<any>({});
  const [loadApi, setLoadApi] = useState(false);
  const dispatch = useAppDispatch();

  const adminSettingsData: IAdminSettingsData = useAppSelector(
    (state: RootState) => state?.AdminSettingData
  );

  const fetchSettings = async () => {
    try {
      const response = await adminGetSettingsApi();
      dispatch({
        type: "ADMIN_ADD_SETTINGS",
        payload: response?.data || {},
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const adminButtonText = "Update Account";

  // This is use to Update Form if in Edit Mode
  useEffect(() => {
    setUser({ ...adminSettingsData });
  }, [adminSettingsData]);

  // Use to collect Site Description Change
  const handleInputChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setUser((values) => ({ ...values, [name]: value }));
  };

  // Use to Submit Form
  const handleSubmit = (event: any) => {
    event.preventDefault();
    setUser({
      ...user,
    });
    setFormLoading(true);
    setLoadApi(true);
  };

  // A custom hook to format the Sign Up Api
  const result = useFormatApiRequest(
    () => adminSaveBankAccountApi(user),
    loadApi,
    () => {
      setLoadApi(false);
    },
    () => {
      processApi();
    }
  );

  // Process Api
  const processApi = async () => {
    if (result.httpState === "SUCCESS") {
      setFormLoading(false);
      fetchSettings();
      alert("Account Details Updated");
    } else if (result.httpState === "ERROR") {
      setFormLoading(false);

      alert(result.data?.response?.data?.message || result.errorMsg || "Error");
    }
  };

  return (
    <>
      <div className="w3-content">
        <div className="w3-container w3-margin-top">
          <h4>
            <span> Update Account</span>
          </h4>
        </div>

        <div className="w3-col w3-padding">
          <div style={{ paddingTop: "10px" }}>
            <form className="adminForm" onSubmit={handleSubmit}>
              {/* Account Number */}
              <div className="w3-col w3-margin-bottom">
                <div className="w3-col l12 s12 m12">
                  <span className="w3-small w3-text-white myfont1">
                    Account Number
                  </span>
                  <input
                    required
                    name="accountNumber"
                    value={user?.accountNumber || ""}
                    onChange={handleInputChange}
                    className="w3-input w3-border w3-col w3-text-white w3-round-large regFormInput"
                    placeholder="Account Number"
                  />
                </div>
              </div>

              {/* Account Name */}
              <div className="w3-col w3-margin-bottom">
                <div className="w3-col l12 s12 m12">
                  <span className="w3-small w3-text-white myfont1">
                    Account Name
                  </span>
                  <input
                    required
                    name="accountName"
                    value={user?.accountName || ""}
                    onChange={handleInputChange}
                    className="w3-input w3-border w3-col w3-text-white w3-round-large regFormInput"
                    placeholder="Account Name"
                  />
                </div>
              </div>

              {/* Bank Name */}
              <div className="w3-col w3-margin-bottom">
                <div className="w3-col l12 s12 m12">
                  <span className="w3-small w3-text-white myfont1">
                    Bank Name
                  </span>
                  <input
                    required
                    name="bankName"
                    value={user?.bankName || ""}
                    onChange={handleInputChange}
                    className="w3-input w3-border w3-col w3-text-white w3-round-large regFormInput"
                    placeholder="Bank Name"
                  />
                </div>
              </div>

              <div className="w3-col w3-margin-bottom w3-margin-top">
                <button
                  disabled={formLoading}
                  className="w3-btn regButton w3-col w3-round-large"
                >
                  <span className="submitButtonText">
                    {!formLoading ? (
                      adminButtonText
                    ) : (
                      <LoadingOutlined rev={undefined} />
                    )}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateAdminBankForm;
