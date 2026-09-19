import { Button, Empty, notification, Pagination, Result, Spin } from "antd";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { tenantApartmentApi } from "../../../../apiservice/tenant-general-apiService";
import {
  ITenantApartmentData,
  ITenantBuildingsData,
} from "../../../../apiservice/tenant-general-apiService.type.";
import useFormatApiRequest from "../../../../hooks/formatApiRequest";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../../Redux/reduxCustomHook";
import { RootState } from "../../../../Redux/store";
import { ILoadState } from "../../../../utils/loading.utils.";
import "./apartment-unit-list.css";
type NotificationType = "success" | "info" | "warning" | "error";

type IApartmentUnitList = {
  externalFilter?: any;
  initialDefaultFilter?: any;
  hidePagination?: boolean;
};

export const ApartmentUnitListUser: React.FC<IApartmentUnitList> = ({
  externalFilter,
  initialDefaultFilter,
  hidePagination = true,
}) => {
  const [apartmentUnitsLoadState, setApartmentUnitLoadState] =
    useState<ILoadState>("loading");
  const [loadApartmentUnitsData, setLoadApartmentUnitsData] = useState(true);
  const [apartmentUnitsDefaultFilter, setApartmentUnitDefaultFilter] = useState(
    initialDefaultFilter || {}
  );
  const [tableData, setTableData] = useState<ITenantApartmentData[]>([]);
  const [api, contextHolder] = notification.useNotification();

  // Pagination Constant/Variables
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(1);
  const perPage = 10;

  // For Navigator/Redux
  const selectedBuilding: ITenantBuildingsData = useAppSelector(
    (state: RootState) => state?.TenantSelectedBuilding
  );

  const params = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // Use Effect to reload API when External Filter has changed
  useEffect(() => {
    if (externalFilter) {
      setApartmentUnitDefaultFilter({
        ...apartmentUnitsDefaultFilter,
        ...externalFilter,
      });
      setLoadApartmentUnitsData(true);
      setApartmentUnitLoadState("loading");
    }
  }, [externalFilter]);

  // A custom hook to Load All ApartmentUnits Details
  const apartmentUnitsDataResult = useFormatApiRequest(
    () =>
      tenantApartmentApi({
        ...apartmentUnitsDefaultFilter,
        buildingId: params?.id,
      }),
    loadApartmentUnitsData,
    () => {
      setLoadApartmentUnitsData(false);
    },
    () => {
      processApartmentUnitsResult();
    }
  );

  // Process The Current ApartmentUnit Data Result
  const processApartmentUnitsResult = async () => {
    if (apartmentUnitsDataResult.httpState === "SUCCESS") {
      setTableData(apartmentUnitsDataResult.data?.data);
      setApartmentUnitLoadState("completed");
      setTotalItems(apartmentUnitsDataResult.data?.meta?.total || 1);
    } else if (apartmentUnitsDataResult.httpState === "ERROR") {
      setApartmentUnitLoadState("error");
    } else if (apartmentUnitsDataResult.httpState === "LOADING") {
      setApartmentUnitLoadState("loading");
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
    setApartmentUnitDefaultFilter({
      ...apartmentUnitsDefaultFilter,
      page: page,
      perPage: pageSize,
    });
    setLoadApartmentUnitsData(true);
  };

  // Navigate to the next Page
  const navigateForward = async (index: number) => {
    if (tableData[index].isOccupied) {
      alert("This Apartment is already occupied");
      return;
    }
    dispatch({
      type: "TENANT_ADD_SELECTED_APARTMENT",
      payload: tableData[index],
    });
    navigate(`/landing/user-tenant-registration/${tableData[index].id}`);
  };

  return (
    <>
      {/* " The context is use to hold the notification from ant design" */}
      {contextHolder}
      <div>
        {/* " Show Loading Indicator" */}
        {apartmentUnitsLoadState === "loading" && (
          <div
            className="w3-col w3-center w3-padding-bottom"
            style={{ paddingTop: "100px" }}
          >
            <Spin size="large" />
          </div>
        )}

        {/* " Show Loading Error" */}
        {apartmentUnitsLoadState === "error" && (
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
                  onClick={() => setLoadApartmentUnitsData(true)}
                  type="primary"
                >
                  Reload
                </Button>
              }
            />
          </div>
        )}

        {/* " Show No data" */}
        {apartmentUnitsLoadState === "noData" && (
          <div className="w3-margin-top">
            <Empty></Empty>
          </div>
        )}

        {/* " Show No data" */}
        {apartmentUnitsLoadState === "completed" && (
          <div className="w3-margin-top">
            <div className="w3-col">
              <div className="w3-content">
                <div>
                  {/* Apartment List */}
                  <div className="w3-col l12 s12">
                    <div className="w3-col w3-padding">
                      <p className="w3-text-white w3-center">
                        <b>{selectedBuilding.title}</b>
                      </p>
                      <div className="apartmentUnitGrid">
                        {tableData.map((apartmentUnits, index) => (
                          <button
                            key={apartmentUnits.id || index}
                            type="button"
                            onClick={() => {
                              navigateForward(index);
                            }}
                            className="apartmentUnitCard"
                          >
                            <span className="w3-text-white myfont1 unitsCardText">
                              {apartmentUnits.title}
                            </span>
                            <img
                              className="apartmentUnitStatus"
                              alt={
                                apartmentUnits.isOccupied
                                  ? "Occupied"
                                  : "Available"
                              }
                              src={
                                apartmentUnits.isOccupied
                                  ? "/images/tags/occupiedTags.svg"
                                  : "/images/tags/emptyTag.svg"
                              }
                            />
                          </button>
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
