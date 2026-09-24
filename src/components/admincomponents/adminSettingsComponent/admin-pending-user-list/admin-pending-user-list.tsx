"use client";

import React from "react";

import {
  CheckOutlined,
  ClockCircleOutlined,
  CloseOutlined,
  ExclamationCircleFilled,
  HomeOutlined,
} from "@ant-design/icons";
import {
  Button,
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
  onTotalChange?: (total: number) => void;
};

export const AdminPendingUsersList: React.FC<IAdminPendingUsersList> = ({
  externalFilter,
  initialDefaultFilter,
  hidePagination = true,
  onTotalChange,
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
  const perPage = initialDefaultFilter?.perPage || 10;

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
      onTotalChange?.(pendingUsersDataResult.data?.meta?.total || 0);
      if (!pendingUsersDataResult.data?.data?.length) {
        setPendingUsersLoadState("noData");
      }
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
        "Confirm this payment? The tenant will be approved. This cannot be undone.",
      icon: <ExclamationCircleFilled rev={undefined} />,
      content: "",
      centered: true,
      okText: "Yes",
      okType: "primary",
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
      title: "Decline this payment? This cannot be undone.",
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
          <div className="adminPanel adminEmpty">
            <span className="adminEmptyIcon">
              <CheckOutlined />
            </span>
            <p className="myfont1">
              All caught up. There are no payments waiting for approval.
            </p>
          </div>
        )}

        {/* " Show Pending Payments" */}
        {pendingUsersLoadState === "completed" && (
          <div className="w3-col">
            {tableData.map((pendingUsers, index) => {
              const name = pendingUsers?.tenant?.fullName || "Tenant";
              const initials = name
                .split(" ")
                .filter(Boolean)
                .slice(0, 2)
                .map((part) => part[0].toUpperCase())
                .join("");
              return (
                <div key={pendingUsers.id || index} className="payReqCard">
                  <div className="payReqMain">
                    <span className="adminAvatar">{initials || "?"}</span>
                    <div className="adminListMain">
                      <h5 className="adminListTitle myfont3">{name}</h5>
                      <p className="adminListSub myfont1">
                        {pendingUsers?.tenant?.phoneNumber}
                        {pendingUsers?.tenant?.email &&
                          ` · ${pendingUsers.tenant.email}`}
                      </p>
                      <p className="adminListSub myfont1">
                        <HomeOutlined />{" "}
                        {[
                          pendingUsers?.apartment?.building?.title,
                          pendingUsers?.apartment?.title,
                        ]
                          .filter(Boolean)
                          .join(" · ") || "-"}
                      </p>
                      <p className="adminListSub myfont1">
                        <ClockCircleOutlined />{" "}
                        {convertToShortDate(pendingUsers?.dateCreated)}
                        {pendingUsers?.paymentReference &&
                          ` · Ref ${pendingUsers.paymentReference}`}
                      </p>
                    </div>
                  </div>

                  <div className="payReqAmounts myfont1">
                    <div className="payReqLine">
                      <span>Rent</span>
                      <span>{formatCurrency(pendingUsers?.netAmount || 0)}</span>
                    </div>
                    <div className="payReqLine">
                      <span>Service Charge</span>
                      <span>
                        {formatCurrency(pendingUsers?.serviceCharge || 0)}
                      </span>
                    </div>
                    <div className="payReqLine payReqTotal">
                      <span>Total</span>
                      <span className="myfont3">
                        {formatCurrency(pendingUsers?.amount || 0)}
                      </span>
                    </div>
                  </div>

                  <div className="adminBtnRow payReqActions">
                    <button
                      type="button"
                      onClick={() => {
                        showApprovedUserApiConfirm(index);
                      }}
                      className="adminBtn adminBtnPrimary"
                    >
                      <CheckOutlined /> Confirm Payment
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        showRemoveUserApiConfirm(index);
                      }}
                      className="adminBtn adminBtnDanger"
                    >
                      <CloseOutlined /> Decline
                    </button>
                  </div>
                </div>
              );
            })}

            {!hidePagination && (
              <div className="w3-col adminPagination">
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
