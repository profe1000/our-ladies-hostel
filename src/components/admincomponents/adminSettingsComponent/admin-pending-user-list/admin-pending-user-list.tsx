"use client";

import React from "react";

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
import useFormatApiRequest from "../../../../hooks/formatApiRequest";
import { useAppDispatch } from "../../../../Redux/reduxCustomHook";
import { appZIndex } from "../../../../utils/appconst";
import type { ILoadState } from "../../../../utils/loading.utils.";
import "./admin-pending-user-list.css";
import { formatCurrency } from "../../../../utils/basic.utils";
import { convertToShortDate } from "../../../../utils/date.utils";
import type { IPendingRentPaymentData } from "../../../../apiservice/admin-General-ApiService.type";
import {
  adminAcceptRentPaymentApi,
  adminGetRentPaymentsApi,
  adminRejectRentPaymentApi,
} from "../../../../apiservice/admin-General-ApiService";
type NotificationType = "success" | "info" | "warning" | "error";

type IAdminPendingUsersList = {
  externalFilter?: any;
  initialDefaultFilter?: any;
  hidePagination?: boolean;
};

export const AdminPendingUsersList: React.FC<IAdminPendingUsersList> = ({
  externalFilter,
  initialDefaultFilter,
  hidePagination = true,
}) => {
  const [pendingUsersLoadState, setPendingUsersLoadState] =
    useState<ILoadState>("loading");
  const [loadPendingUsersData, setLoadPendingUsersData] = useState(true);
  const [pendingUsersDefaultFilter, setPendingUsersDefaultFilter] = useState(
    initialDefaultFilter || {}
  );
  const [tableData, setTableData] = useState<IPendingRentPaymentData[]>([]);

  const [selectedUserIndex, setSelectedUserIndex] = useState(0);
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
      setPendingUsersDefaultFilter({
        ...pendingUsersDefaultFilter,
        ...externalFilter,
      });
      setLoadPendingUsersData(true);
      setPendingUsersLoadState("loading");
    }
  }, [externalFilter]);

  // A custom hook to Load All PendingUsers Details
  const pendingUsersDataResult = useFormatApiRequest(
    () => adminGetRentPaymentsApi(pendingUsersDefaultFilter),
    loadPendingUsersData,
    () => {
      setLoadPendingUsersData(false);
    },
    () => {
      processPendingUsersResult();
    }
  );

  // Process The Current PendingUsers Data Result
  const processPendingUsersResult = async () => {
    if (pendingUsersDataResult.httpState === "SUCCESS") {
      setTableData(pendingUsersDataResult.data?.data || []);
      setPendingUsersLoadState("completed");
      setTotalItems(pendingUsersDataResult.data?.meta?.total || 1);
    } else if (pendingUsersDataResult.httpState === "ERROR") {
      setPendingUsersLoadState("error");
    } else if (pendingUsersDataResult.httpState === "LOADING") {
      setPendingUsersLoadState("loading");
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

  const showApprovedUserApiConfirm = (index) => {
    setSelectedUserIndex(index);
    confirm({
      title:
        "Are you sure you want to Approved this User, This cannot be undone",
      icon: <ExclamationCircleFilled rev={undefined} />,
      content: "",
      centered: true,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      zIndex: appZIndex.modal,
      onOk() {
        console.log("OK");
        // Pass the index directly instead of relying on state
        approveUserDirectly(index);
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  // Remove  User
  const showRemoveUserApiConfirm = (index) => {
    setSelectedUserIndex(index);
    confirm({
      title: "Are you sure you want to Revoke this User, This cannot be undone",
      icon: <ExclamationCircleFilled rev={undefined} />,
      content: "",
      centered: true,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      zIndex: appZIndex.modal,
      onOk() {
        console.log("OK");
        // Pass the index directly instead of relying on state
        removeUserDirectly(index);
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  // Direct approve function that doesn't rely on selectedUserIndex state
  const approveUserDirectly = (index: number) => {
    if (tableData[index] && tableData[index].id) {
      adminAcceptRentPaymentApi(tableData[index].id)
        .then((response) => {
          openNotificationWithIcon(
            "success",
            "Success",
            "This user has been confirmed",
            "#f6ffed"
          );
          setLoadPendingUsersData(true);
        })
        .catch((error) => {
          openNotificationWithIcon(
            "error",
            "Error",
            error?.response?.data?.message ||
              error?.message ||
              "An error occurred while approving the user",
            "#fff2f0"
          );
        });
    } else {
      openNotificationWithIcon(
        "error",
        "Error",
        "Invalid user data",
        "#fff2f0"
      );
    }
  };

  // Direct remove function that doesn't rely on selectedUserIndex state
  const removeUserDirectly = (index: number) => {
    if (tableData[index] && tableData[index].id) {
      adminRejectRentPaymentApi(tableData[index].id)
        .then((response) => {
          openNotificationWithIcon(
            "success",
            "Success",
            "This user has been removed",
            "#f6ffed"
          );
          setLoadPendingUsersData(true);
        })
        .catch((error) => {
          openNotificationWithIcon(
            "error",
            "Error",
            error?.response?.data?.message ||
              error?.message ||
              "An error occurred while removing the user",
            "#fff2f0"
          );
        });
    } else {
      openNotificationWithIcon(
        "error",
        "Error",
        "Invalid user data",
        "#fff2f0"
      );
    }
  };

  // Use to Control Pagination On Change Event
  const onPageChange = (page: number, pageSize: number) => {
    setCurrentPage(page);
    setPendingUsersDefaultFilter({
      ...pendingUsersDefaultFilter,
      page: page,
      perPage: pageSize,
    });
    setLoadPendingUsersData(true);
  };

  // Navigate to the next Page
  const navigateToView = async (index: number) => {
    // Navigate to the detail view page for the selected user
    if (tableData[index] && tableData[index].id) {
      navigate(`/admin/rent-payments/${tableData[index].id}`);
    }
  };

  return (
    <>
      {/* " The context is use to hold the notification from ant design" */}
      {contextHolder}
      <div>
        {/* " Show Loading Indicator" */}
        {pendingUsersLoadState === "loading" && (
          <div
            className="w3-col w3-center w3-padding-bottom"
            style={{ paddingTop: "100px" }}
          >
            <Spin size="large" />
          </div>
        )}

        {/* " Show Loading Error" */}
        {pendingUsersLoadState === "error" && (
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
                  onClick={() => setLoadPendingUsersData(true)}
                  type="primary"
                >
                  Reload
                </Button>
              }
            />
          </div>
        )}

        {/* " Show No data" */}
        {pendingUsersLoadState === "noData" && (
          <div className="w3-margin-top">
            <Empty></Empty>
          </div>
        )}

        {/* " Show No data" */}
        {pendingUsersLoadState === "completed" && (
          <div className="w3-col w3-margin-top">
            <div className="w3-col">
              <div className="w3-content">
                <div>
                  {/* Recent activities */}
                  <div className="w3-col l12 s12">
                    <div className="w3-col w3-padding">
                      <div className="w3-col">
                        {tableData.map((pendingUsers, index) => (
                          <React.Fragment key={index}>
                            <div className="w3-col w3-card-4 w3-round-large adminCard w3-padding w3-margin-bottom">
                              <div className="w3-col">
                                <h5 className="myfont3 w3-text-white adminCardHeader">
                                  {pendingUsers?.tenant?.fullName} <br />
                                  {pendingUsers?.tenant?.phoneNumber}
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
                                  {pendingUsers?.apartment?.building?.title +
                                    " - " +
                                    pendingUsers?.apartment?.title +
                                    ""}
                                  <br />
                                  Rent :{" "}
                                  {formatCurrency(pendingUsers?.netAmount)}
                                  <br />
                                  Service Charge :{" "}
                                  {formatCurrency(pendingUsers?.serviceCharge)}
                                  <br />
                                  Total : {formatCurrency(pendingUsers?.amount)}
                                  <br />
                                  {convertToShortDate(
                                    pendingUsers?.dateCreated
                                  )}
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
                                      showApprovedUserApiConfirm(index);
                                    }}
                                    className="w3-btn  w3-round-large myfont1 w3-small editAdminBtn"
                                  >
                                    Accept
                                  </button>
                                  &nbsp; &nbsp; &nbsp;
                                  <button
                                    onClick={() => {
                                      showRemoveUserApiConfirm(index);
                                    }}
                                    className="w3-btn  w3-round-large myfont1 w3-small deleteAdminBtn"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            </div>

                            <div className="w3-col w3-margin-bottom">
                              <h6 className="cardsBottonBorder"> </h6>
                            </div>
                          </React.Fragment>
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
