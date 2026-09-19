import { useNavigate } from "react-router-dom";
import { IAdminAuthType } from "../../../../apiservice/admin-AuthService.type";
import { useAppSelector } from "../../../../Redux/reduxCustomHook";
import { RootState } from "../../../../Redux/store";
import "./admin-settings-wrapper.css";

export const AdminSettingWrapper: React.FC<{}> = () => {
  const navigate = useNavigate();
  const authData: IAdminAuthType = useAppSelector(
    (state: RootState) => state?.AdminAuthData
  );

  // Navigate to the next Page
  const navigateToPage = async (page: string) => {
    navigate(page);
  };
  return (
    <div className="w3-container">
      <div className="w3-content">
        <div className="w3-col w3-padding">
          <p className="w3-text-white w3-center">
            <h2>Settings</h2>
          </p>
        </div>
        <div className="w3-left-align">
          {/* <button
          onClick={() => {
            navigateToPage("/admin/manageProfile");
          }}
          className="w3-col w3-btn w3-left-align  w3-border-bottom myfont1 w3-margin-top"
        >
          Manage Profile
        </button>
        <br /> */}
          <button
            onClick={() => {
              navigateToPage("/admin/managePassword");
            }}
            className="w3-col w3-btn w3-left-align  w3-border-bottom  myfont1  w3-margin-top"
          >
            Change Password
          </button>
          <br />
          <button
            onClick={() => {
              navigateToPage("/admin/pending-user");
            }}
            className="w3-col w3-btn w3-left-align  w3-border-bottom  myfont1  w3-margin-top"
          >
            Manage Pending Approval
          </button>

          {authData.data?.credentials?.adminRole?.id === 1 && (
            <>
              <br />
              <button
                onClick={() => {
                  navigateToPage("/admin/manageAdmin");
                }}
                className="w3-col w3-btn  w3-left-align  w3-border-bottom  myfont1  w3-margin-top"
              >
                Manage Estate Admin
              </button>

              <br />
              <button
                onClick={() => {
                  navigateToPage("/admin/manageAdminBank/update");
                }}
                className="w3-col w3-btn  w3-left-align  w3-border-bottom  myfont1  w3-margin-top"
              >
                Update Bank Account
              </button>
            </>
          )}

          <br />
          <button
            onClick={() => {
              navigate("/auth", { replace: true });
            }}
            className="w3-col w3-btn w3-left-align  w3-border-bottom  myfont1  w3-margin-top"
          >
            Logout
          </button>
          <br />
        </div>
      </div>
    </div>
  );
};

export default AdminSettingWrapper;
