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
import "./admin-notification-list.css";
import { formatCurrency } from "../../../../utils/basic.utils";
import { convertToShortDate } from "../../../../utils/date.utils";
import type {
  INotificationsData,
  IPendingRentPaymentData,
} from "../../../../apiservice/admin-General-ApiService.type";
import {
  adminAcceptRentPaymentApi,
  adminGetNotificationApi,
  adminGetRentPaymentsApi,
  adminRejectRentPaymentApi,
} from "../../../../apiservice/admin-General-ApiService";
type NotificationType = "success" | "info" | "warning" | "error";

type IAdminNotificationsList = {
  externalFilter?: any;
  initialDefaultFilter?: any;
  hidePagination?: boolean;
};

export const AdminNotificationsList: React.FC<IAdminNotificationsList> = ({
  externalFilter,
  initialDefaultFilter,
  hidePagination = true,
}) => {
  const [notificationsLoadState, setNotificationsLoadState] =
    useState<ILoadState>("loading");
  const [loadNotificationsData, setLoadNotificationsData] = useState(true);
  const [notificationsDefaultFilter, setNotificationsDefaultFilter] = useState(
    initialDefaultFilter || {}
  );
  const [tableData, setTableData] = useState<INotificationsData[]>([]);

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
      setNotificationsDefaultFilter({
        ...notificationsDefaultFilter,
        ...externalFilter,
      });
      setLoadNotificationsData(true);
      setNotificationsLoadState("loading");
    }
  }, [externalFilter]);

  // A custom hook to Load All Notifications Details
  const notificationsDataResult = useFormatApiRequest(
    () => adminGetNotificationApi(notificationsDefaultFilter),
    loadNotificationsData,
    () => {
      setLoadNotificationsData(false);
    },
    () => {
      processNotificationsResult();
    }
  );

  // Process The Current Notifications Data Result
  const processNotificationsResult = async () => {
    if (notificationsDataResult.httpState === "SUCCESS") {
      setTableData(notificationsDataResult.data?.data || []);
      setNotificationsLoadState("completed");
      setTotalItems(notificationsDataResult.data?.meta?.total || 1);
    } else if (notificationsDataResult.httpState === "ERROR") {
      setNotificationsLoadState("error");
    } else if (notificationsDataResult.httpState === "LOADING") {
      setNotificationsLoadState("loading");
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

  // Use to Control Pagination On Change Event
  const onPageChange = (page: number, pageSize: number) => {
    setCurrentPage(page);
    setNotificationsDefaultFilter({
      ...notificationsDefaultFilter,
      page: page,
      perPage: pageSize,
    });
    setLoadNotificationsData(true);
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
        {notificationsLoadState === "loading" && (
          <div
            className="w3-col w3-center w3-padding-bottom"
            style={{ paddingTop: "100px" }}
          >
            <Spin size="large" />
          </div>
        )}

        {/* " Show Loading Error" */}
        {notificationsLoadState === "error" && (
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
                  onClick={() => setLoadNotificationsData(true)}
                  type="primary"
                >
                  Reload
                </Button>
              }
            />
          </div>
        )}

        {/* " Show No data" */}
        {notificationsLoadState === "noData" && (
          <div className="w3-margin-top">
            <Empty></Empty>
          </div>
        )}

        {/* " Show No data" */}
        {notificationsLoadState === "completed" && (
          <div className="w3-col w3-margin-top">
            <div className="w3-col">
              <div className="w3-content">
                <div>
                  {/* Recent activities */}
                  <div className="w3-col l12 s12">
                    <div className="w3-col w3-padding">
                      <div className="w3-col">
                        {tableData.map((notifications, index) => (
                          <React.Fragment key={index}>
                            <div
                              className={
                                "w3-col w3-card-4 w3-round-large adminCard w3-padding w3-margin-bottom " +
                                (notifications?.isRead
                                  ? " adminCard"
                                  : " adminUnReadCard")
                              }
                            >
                              <div className="w3-col">
                                <h5 className="myfont3 w3-text-white adminCardHeader">
                                  {notifications?.title}
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
                                  {notifications?.message}
                                  <br />
                                  {convertToShortDate(
                                    notifications?.dateCreated
                                  )}
                                </p>
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
