import { ExclamationCircleFilled } from "@ant-design/icons";
import {
  Button,
  Empty,
  Modal,
  notification,
  Pagination,
  Result,
  Spin,
} from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  adminGetAdminApi,
  adminRemoveAdminApi,
} from "../../../../apiservice/admin-General-ApiService";
import { IAdminUsersData } from "../../../../apiservice/admin-General-ApiService.type";
import { sampleApiCall } from "../../../../apiservice/authService";
import useFormatApiRequest from "../../../../hooks/formatApiRequest";
import { useAppDispatch } from "../../../../Redux/reduxCustomHook";
import { appZIndex } from "../../../../utils/appconst";
import { ILoadState } from "../../../../utils/loading.utils.";
import "./admin-list.css";
type NotificationType = "success" | "info" | "warning" | "error";

type IAdminList = {
  externalFilter?: any;
  initialDefaultFilter?: any;
  hidePagination?: boolean;
};

export const AdminList: React.FC<IAdminList> = ({
  externalFilter,
  initialDefaultFilter,
  hidePagination = true,
}) => {
  const [adminUsersLoadState, setAdminUsersLoadState] =
    useState<ILoadState>("loading");
  const [loadAdminUsersData, setLoadAdminUsersData] = useState(true);
  const [adminUsersDefaultFilter, setAdminUsersDefaultFilter] = useState(
    initialDefaultFilter || {}
  );
  const [tableData, setTableData] = useState<IAdminUsersData[]>([]);

  const [selectedAdminIndex, setSelectedCostIndex] = useState(0);
  const [loadRemoveAdminApi, setLoadRemoveAdminApi] = useState(false);
  const [api, contextHolder] = notification.useNotification();
  const { confirm } = Modal;

  // Pagination Constant/Variables
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(1);
  const perPage = 10;

  // For Navigator/Redux
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // Use Effect to reload API when External Filter has changed
  useEffect(() => {
    if (externalFilter) {
      setAdminUsersDefaultFilter({
        ...adminUsersDefaultFilter,
        ...externalFilter,
      });
      setLoadAdminUsersData(true);
      setAdminUsersLoadState("loading");
    }
  }, [externalFilter]);

  // A custom hook to Load All AdminUsers Details
  const adminUsersDataResult = useFormatApiRequest(
    () => adminGetAdminApi(adminUsersDefaultFilter),
    loadAdminUsersData,
    () => {
      setLoadAdminUsersData(false);
    },
    () => {
      processAdminUsersResult();
    }
  );

  // Process The Current AdminUsers Data Result
  const processAdminUsersResult = async () => {
    if (adminUsersDataResult.httpState === "SUCCESS") {
      setTableData(adminUsersDataResult.data?.data || []);
      setAdminUsersLoadState("completed");
      setTotalItems(adminUsersDataResult.data?.meta?.total || 1);
    } else if (adminUsersDataResult.httpState === "ERROR") {
      setAdminUsersLoadState("error");
    } else if (adminUsersDataResult.httpState === "LOADING") {
      setAdminUsersLoadState("loading");
    }
  };

  // Show Notification
  const openNotificationWithIcon = (
    type: NotificationType,
    message: string,
    description: string,
    background?: string
  ) => {
    api[type]({
      message,
      description,
      placement: "bottomRight",
      style: { background },
    });
  };

  // Remove Cost
  const showRemoveAdminApiConfirm = (index) => {
    setSelectedCostIndex(index);
    confirm({
      title:
        "Are you sure you want to Remove this Admin, This cannot be undone",
      icon: <ExclamationCircleFilled rev={undefined} />,
      content: "",
      centered: true,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      zIndex: appZIndex.modal,
      onOk() {
        console.log("OK");
        setLoadRemoveAdminApi(true);
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  // A custom hook to  Remove Admin
  const removeAdminApiResult = useFormatApiRequest(
    () => adminRemoveAdminApi(tableData[selectedAdminIndex].id),
    loadRemoveAdminApi,
    () => {
      setLoadRemoveAdminApi(false);
    },
    () => {
      processRemoveAdminApi();
    }
  );

  // Process The Removal
  const processRemoveAdminApi = async () => {
    if (removeAdminApiResult.httpState === "SUCCESS") {
      alert("This Admin Have being Removed");
      setLoadAdminUsersData(true);
    } else if (removeAdminApiResult.httpState === "ERROR") {
      alert(
        removeAdminApiResult.data?.response?.data?.message ||
          removeAdminApiResult.errorMsg ||
          "Error"
      );
    }
  };

  // Use to Control Pagination On Change Event
  const onPageChange = (page: number, pageSize: number) => {
    setCurrentPage(page);
    setAdminUsersDefaultFilter({
      ...adminUsersDefaultFilter,
      page: page,
      perPage: pageSize,
    });
    setLoadAdminUsersData(true);
  };

  // Navigate to the next Page
  const navigateToEdit = async (index: number) => {
    dispatch({
      type: "ADMIN_ADD_SELECTED_ADMIN",
      payload: tableData[index],
    });
    navigate(`/admin/manageAdmin/edit/${tableData[index].id}`);
  };

  // Navigate to the next Page
  const navigateToView = async (index: number) => {
    dispatch({
      type: "ADMIN_ADD_SELECTED_ADMIN",
      payload: tableData[index],
    });
    navigate(`/admin/manageAdmin/details/${tableData[index].id}`);
  };

  return (
    <>
      {/* " The context is use to hold the notification from ant design" */}
      {contextHolder}
      <div>
        {/* " Show Loading Indicator" */}
        {adminUsersLoadState === "loading" && (
          <div
            className="w3-col w3-center w3-padding-bottom"
            style={{ paddingTop: "100px" }}
          >
            <Spin size="large" />
          </div>
        )}

        {/* " Show Loading Error" */}
        {adminUsersLoadState === "error" && (
          <div className="w3-col w3-padding-bottom">
            <Result
              status="500"
              title={<span className="w3-text-white">Error</span>}
              subTitle={
                <span className="w3-text-white">
                  Sorry, something went wrong, it could be a network Related
                  error
                </span>
              }
              extra={
                <Button
                  onClick={() => setLoadAdminUsersData(true)}
                  type="primary"
                >
                  Reload
                </Button>
              }
            />
          </div>
        )}

        {/* " Show No data" */}
        {adminUsersLoadState === "noData" && (
          <div className="w3-margin-top">
            <Empty></Empty>
          </div>
        )}

        {/* " Show No data" */}
        {adminUsersLoadState === "completed" && (
          <div className="w3-col w3-margin-top">
            <div className="w3-col">
              <div className="w3-content">
                <div>
                  {/* Recent activities */}
                  <div className="w3-col l12 s12">
                    <div className="w3-col w3-padding">
                      <div className="w3-col">
                        {tableData.map((adminUsers, index) => (
                          <>
                            <div
                              key={index}
                              className="w3-col w3-card-4 w3-round-large adminCard w3-padding w3-margin-bottom"
                            >
                              <div className="w3-col">
                                <h5 className="myfont3 w3-text-white adminCardHeader">
                                  {adminUsers?.fullName}
                                </h5>
                              </div>

                              <div className="w3-col">
                                <p
                                  style={{
                                    paddingTop: "2px",
                                    paddingLeft: "2px",
                                  }}
                                  className="myfont1 w3-text-white adminCardText"
                                >
                                  {adminUsers?.email}
                                  <br />
                                  {adminUsers?.phoneNumber}
                                </p>
                              </div>

                              <div className="w3-col w3-margin-top w3-margin-bottom">
                                <div className="w3-col ">
                                  <button
                                    onClick={() => {
                                      navigateToView(index);
                                    }}
                                    className="w3-btn  w3-round-large myfont1 w3-small viewUnitsBtn"
                                  >
                                    View
                                  </button>
                                  &nbsp; &nbsp; &nbsp;
                                  <button
                                    onClick={() => {
                                      navigateToEdit(index);
                                    }}
                                    className="w3-btn  w3-round-large myfont1 w3-small editAdminBtn"
                                  >
                                    Edit
                                  </button>
                                  &nbsp; &nbsp; &nbsp;
                                  <button
                                    onClick={() => {
                                      showRemoveAdminApiConfirm(index);
                                    }}
                                    className="w3-btn  w3-round-large myfont1 w3-small deleteAdminBtn"
                                  >
                                    Delete
                                  </button>
                                </div>
                              </div>
                            </div>

                            <div className="w3-col w3-margin-bottom">
                              <h6 className="cardsBottonBorder"> </h6>
                            </div>
                          </>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {!hidePagination && (
              <div className="w3-col w3-margin-top">
                <Pagination
                  current={currentPage || 1}
                  onChange={onPageChange}
                  pageSize={perPage}
                  total={totalItems}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};
