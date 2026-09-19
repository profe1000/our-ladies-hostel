import { Button, Empty, notification, Pagination, Result, Spin } from "antd";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  tenantBuildingsApi,
  tenantGetSettingsApi,
} from "../../../../apiservice/tenant-general-apiService";
import { ITenantBuildingsData } from "../../../../apiservice/tenant-general-apiService.type.";
import useFormatApiRequest from "../../../../hooks/formatApiRequest";
import { useAppDispatch } from "../../../../Redux/reduxCustomHook";
import { formatCurrency } from "../../../../utils/basic.utils";
import { ILoadState } from "../../../../utils/loading.utils.";
import "./building-list.css";
type NotificationType = "success" | "info" | "warning" | "error";

type IBuildingList = {
  externalFilter?: any;
  initialDefaultFilter?: any;
  hidePagination?: boolean;
};

export const BuildingListUser: React.FC<IBuildingList> = ({
  externalFilter,
  initialDefaultFilter,
  hidePagination = true,
}) => {
  const [buildingsLoadState, setBuildingLoadState] =
    useState<ILoadState>("loading");
  const [loadBuildingsData, setLoadBuildingsData] = useState(true);
  const [buildingsDefaultFilter, setBuildingDefaultFilter] = useState(
    initialDefaultFilter || {}
  );
  const [tableData, setTableData] = useState<ITenantBuildingsData[]>([]);
  const [api, contextHolder] = notification.useNotification();

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
      setBuildingDefaultFilter({
        ...buildingsDefaultFilter,
        ...externalFilter,
      });
      setLoadBuildingsData(true);
      setBuildingLoadState("loading");
    }
  }, [externalFilter]);

  // A custom hook to Load All Buildings Details
  const buildingsDataResult = useFormatApiRequest(
    () => tenantBuildingsApi(buildingsDefaultFilter),
    loadBuildingsData,
    () => {
      setLoadBuildingsData(false);
      fetchSettings();
    },
    () => {
      processBuildingsResult();
    }
  );

  // Process The Current Building Data Result
  const processBuildingsResult = async () => {
    if (buildingsDataResult.httpState === "SUCCESS") {
      setTableData(buildingsDataResult.data?.data);
      setBuildingLoadState("completed");
      setTotalItems(buildingsDataResult.data?.meta?.total || 1);
      if (!buildingsDataResult.data?.meta?.total) {
        setBuildingLoadState("noData");
      }
    } else if (buildingsDataResult.httpState === "ERROR") {
      setBuildingLoadState("error");
    } else if (buildingsDataResult.httpState === "LOADING") {
      setBuildingLoadState("loading");
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
    setBuildingDefaultFilter({
      ...buildingsDefaultFilter,
      page: page,
      perPage: pageSize,
    });
    setLoadBuildingsData(true);
  };

  // Navigate to the next Page
  const navigateForward = async (index: number) => {
    dispatch({
      type: "TENANT_ADD_SELECTED_BUILDING",
      payload: tableData[index],
    });
    navigate(`/landing/user-apartment-Unit/${tableData[index].id}`);
  };

  const fetchSettings = async () => {
    try {
      const response = await tenantGetSettingsApi();
      dispatch({
        type: "USER_ADD_SETTINGS",
        payload: response?.data || {},
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <>
      {/* " The context is use to hold the notification from ant design" */}
      {contextHolder}
      <div>
        {/* " Show Loading Indicator" */}
        {buildingsLoadState === "loading" && (
          <div
            className="w3-col w3-center w3-padding-bottom"
            style={{ paddingTop: "100px" }}
          >
            <Spin size="large" />
          </div>
        )}

        {/* " Show Loading Error" */}
        {buildingsLoadState === "error" && (
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
                  onClick={() => setLoadBuildingsData(true)}
                  type="primary"
                >
                  Reload
                </Button>
              }
            />
          </div>
        )}

        {/* " Show No data" */}
        {buildingsLoadState === "noData" && (
          <div className="w3-margin-top w3-center">
            {/* <Empty></Empty> */}
            <p className="w3-text-white" style={{ marginTop: "120px" }}>
              Sorry, No Building have been added yet.
              <br />
              Contact the App Admin.
            </p>
          </div>
        )}

        {/* " Show No data" */}
        {buildingsLoadState === "completed" && (
          <div className="w3-margin-top">
            <div className="w3-col">
              <div className="w3-content">
                <div>
                  {/* Building List */}
                  <div className="w3-col l12 s12">
                    <div className="w3-col w3-padding">
                      <div className="w3-col">
                        {tableData.map((buildings, index) => (
                          <>
                            <div key={index}>
                              <div
                                onClick={() => {
                                  navigateForward(index);
                                }}
                                className="w3-col w3-card-4 w3-round-large buildingCard w3-padding w3-margin-bottom"
                              >
                                <div className="w3-col">
                                  <h5 className="myfont3 w3-text-white buildingCardHeader">
                                    {buildings?.title}
                                  </h5>
                                </div>

                                <div className="w3-col l6 s6 m6">
                                  <p
                                    style={{ paddingTop: "10px" }}
                                    className="myfont1 w3-text-white buildingCardText"
                                  >
                                    {buildings?.description}
                                  </p>
                                </div>

                                <div className="w3-col l6 s6 m6 w3-right-align">
                                  <img
                                    className="w3-round-large"
                                    alt="Building"
                                    src={buildings.imageUrl}
                                    style={{
                                      maxWidth: "100%",
                                      height: "100px",
                                    }}
                                  />
                                </div>

                                <div className="w3-col w3-margin-bottom">
                                  <span className="w3-padding w3-round-xlarge myfont1 w3-text-white buildingAmount">
                                    {formatCurrency(buildings.price)}
                                  </span>
                                </div>
                              </div>

                              <div className="w3-col w3-margin-bottom">
                                <h6 className="cardsBottonBorder"> </h6>
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
