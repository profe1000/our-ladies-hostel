import { Button, Empty, notification, Pagination, Result, Spin } from "antd";
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { adminGetOccupantHistoryApi } from "../../../../apiservice/admin-General-ApiService";
import {
  IAdminApartmentData,
  IAdminBuildingsData,
  IAdminOccupantData,
} from "../../../../apiservice/admin-General-ApiService.type";
import useFormatApiRequest from "../../../../hooks/formatApiRequest";
import {
  useAppSelector,
  useAppDispatch,
} from "../../../../Redux/reduxCustomHook";
import { RootState } from "../../../../Redux/store";
import { ILoadState } from "../../../../utils/loading.utils.";
import "./admin-apartment-unit-occupant-log.css";
type NotificationType = "success" | "info" | "warning" | "error";

type IAdminApartmentOccupantLog = {
  externalFilter?: any;
  initialDefaultFilter?: any;
  hidePagination?: boolean;
};

export const AdminApartmentOccupantLog: React.FC<
  IAdminApartmentOccupantLog
> = ({ externalFilter, initialDefaultFilter, hidePagination = true }) => {
  const [occupantLogsLoadState, setOccupantLogsLoadState] =
    useState<ILoadState>("loading");
  const [loadOccupantLogssData, setLoadOccupantLogssData] = useState(true);
  const [occupantLogsDefaultFilter, setOccupantLogsDefaultFilter] = useState(
    initialDefaultFilter || {}
  );
  const [tableData, setTableData] = useState<IAdminOccupantData[]>([]);
  const [api, contextHolder] = notification.useNotification();

  // Pagination Constant/Variables
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(1);
  const perPage = 10;

  // For Navigator/Redux
  const selectedBuilding: IAdminBuildingsData = useAppSelector(
    (state: RootState) => state?.AdminSelectedBuilding
  );

  const selectedUnit: IAdminApartmentData = useAppSelector(
    (state: RootState) => state?.AdminSelectedApartment
  );

  const params = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // Use Effect to reload API when External Filter has changed
  useEffect(() => {
    if (externalFilter) {
      setOccupantLogsDefaultFilter({
        ...occupantLogsDefaultFilter,
        ...externalFilter,
      });
      setLoadOccupantLogssData(true);
      setOccupantLogsLoadState("loading");
    }
  }, [externalFilter]);

  // A custom hook to Load All OccupantLogss Details
  const occupantLogsDataResult = useFormatApiRequest(
    () =>
      adminGetOccupantHistoryApi({
        ...occupantLogsDefaultFilter,
        apartmentId: params?.id,
      }),
    loadOccupantLogssData,
    () => {
      setLoadOccupantLogssData(false);
    },
    () => {
      processOccupantLogssResult();
    }
  );

  // Process The Current OccupantLogs Data Result
  const processOccupantLogssResult = async () => {
    if (occupantLogsDataResult.httpState === "SUCCESS") {
      setTableData(occupantLogsDataResult.data?.data || []);
      setOccupantLogsLoadState("completed");
      setTotalItems(occupantLogsDataResult.data?.meta?.total || 1);

      if ((occupantLogsDataResult.data?.data || []).length === 0) {
        setOccupantLogsLoadState("noData");
      }
    } else if (occupantLogsDataResult.httpState === "ERROR") {
      setOccupantLogsLoadState("error");
    } else if (occupantLogsDataResult.httpState === "LOADING") {
      setOccupantLogsLoadState("loading");
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

  const navigateToTenantDetails = async (index: number) => {
    dispatch({
      type: "ADMIN_ADD_SELECTED_TENANT",
      payload: tableData[index].tenant,
    });

    dispatch({
      type: "ADMIN_ADD_SELECTED_OCCUPANT",
      payload: tableData[index],
    });
    navigate(`/admin/apartment-tenant-history-details/${tableData[index].id}`);
  };

  // Use to Control Pagination On Change Event
  const onPageChange = (page: number, pageSize: number) => {
    setCurrentPage(page);
    setOccupantLogsDefaultFilter({
      ...occupantLogsDefaultFilter,
      page: page,
      perPage: pageSize,
    });
    setLoadOccupantLogssData(true);
  };

  return (
    <>
      {/* " The context is use to hold the notification from ant design" */}
      {contextHolder}
      <div>
        {/* " Show Loading Indicator" */}
        {occupantLogsLoadState === "loading" && (
          <div
            className="w3-col w3-center w3-padding-bottom"
            style={{ paddingTop: "100px" }}
          >
            <Spin size="large" />
          </div>
        )}

        {/* " Show Loading Error" */}
        {occupantLogsLoadState === "error" && (
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
                  onClick={() => setLoadOccupantLogssData(true)}
                  type="primary"
                >
                  Reload
                </Button>
              }
            />
          </div>
        )}

        {/* " Show No data" */}
        {occupantLogsLoadState === "noData" && (
          <div className="w3-margin-top w3-container">
            <div className="w3-col">
              <div className="w3-content">
                <div className="w3-col">
                  <p className="w3-text-white w3-center">
                    <b>
                      Occupant History on{" "}
                      {`${selectedBuilding.title} ${selectedUnit.title}`}
                    </b>
                  </p>
                </div>

                <div className="w3-col">
                  <p className="w3-text-white w3-center">
                    No Tenants Have Occupied This Apartment Yet
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* " Show No data" */}
        {occupantLogsLoadState === "completed" && (
          <div className="w3-margin-top w3-container">
            <div className="w3-col">
              <div className="w3-content">
                <div>
                  {/* Recent activities */}
                  <div className="w3-col l12 s12">
                    <div className="w3-col">
                      <p className="w3-text-white w3-center">
                        <b>
                          Occupant History on{" "}
                          {`${selectedBuilding.title} ${selectedUnit.title}`}
                        </b>
                      </p>
                      <div className="w3-col">
                        {tableData.map((occupantLogs, index) => (
                          <>
                            <div
                              onClick={() => {
                                navigateToTenantDetails(index);
                              }}
                              key={index}
                              className="w3-col w3-card-4 w3-round-large adminCard w3-padding w3-margin-bottom"
                            >
                              <div className="w3-col">
                                <h5 className="myfont3 w3-text-white adminCardHeader">
                                  {occupantLogs?.tenant.fullName}
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
                                  {occupantLogs?.tenant.email}
                                  <br />
                                  {occupantLogs?.tenant.phoneNumber}
                                </p>
                              </div>
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
