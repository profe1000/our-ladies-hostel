import { BellOutlined, LeftOutlined, UserOutlined } from "@ant-design/icons";
import { Space, Badge } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { IAdminAuthType } from "../../../apiservice/admin-AuthService.type";
import { useAppSelector } from "../../../Redux/reduxCustomHook";
import { RootState } from "../../../Redux/store";
import "./TopBar-Admin.css";

type ITopBarAdmin = {
  showBackButton?: boolean;
  showNotification?: boolean;
  showProfile?: boolean;
  backButtonHref?: string;
};

export const TopBarAdmin: React.FC<ITopBarAdmin> = ({
  showBackButton = false,
  showNotification = false,
  showProfile = true,
  backButtonHref = "/",
}) => {
  const authData: IAdminAuthType = useAppSelector(
    (state: RootState) => state?.AdminAuthData
  );

  const navigate = useNavigate();

  // Navigate To Home
  const navigateToHome = async () => {
    navigate("/admin", { replace: true });
  };

  // Navigate BackWards
  const navigateBackward = async (url: string) => {
    // if (url === "/") {
    //   navigate(url, { replace: true });
    // } else {
    //   navigate(url);
    // }
    navigate(-1);
  };

  return (
    <>
      {/* Top Bar Card */}
      <div className="w3-rest headerMenu fixedMenu backgroundApp safeAreaTop">
        <>
          <div className="w3-col w3-padding">
            <div
              className="w3-col"
              style={{ paddingTop: "5px", paddingBottom: "5px" }}
            >
              <div style={{ paddingTop: "15px" }} className="w3-col l6 s6 m6">
                <div>
                  {showBackButton && (
                    <span
                      onClick={() => {
                        navigateBackward(backButtonHref);
                      }}
                    >
                      <LeftOutlined />
                    </span>
                  )}
                  <span>
                    <img
                      onClick={() => {
                        navigateToHome();
                      }}
                      style={{height:"70px"}}
                      className="favicon-header"
                      src="/images/logo.svg"
                      alt=""
                    />
                  </span>
                </div>
              </div>
              <div
                style={{ paddingTop: "2px" }}
                className="w3-col l6 s6 m6 w3-right-align"
              >
                {showProfile && (
                  <>
                    <span className="topBarProfileIndicator">
                      <Link to={"/auth"}>
                        <UserOutlined className="w3-text-white" />
                      </Link>
                    </span>
                    &nbsp; &nbsp;
                  </>
                )}

                {showNotification && (
                  <span className="topBarNotificationBell">
                    <Link to={"/admin/notifications"}>
                      <Space size="middle">
                        <Badge
                          style={{ fontSize: "6px" }}
                          size="small"
                          count={0}
                        >
                          <BellOutlined className="w3-text-white" />
                        </Badge>
                      </Space>
                    </Link>
                    &nbsp;&nbsp;
                  </span>
                )}

                {showProfile && (
                  <img
                    className="w3-circle w3-hide"
                    style={{ width: "48px", maxWidth: "100%" }}
                    alt="logo"
                    src={authData?.data?.credentials.dpUrl}
                  />
                )}
              </div>
            </div>
          </div>
        </>
      </div>

      <div className="w3-col menuSpace">
        <br />
      </div>
    </>
  );
};

export default TopBarAdmin;
