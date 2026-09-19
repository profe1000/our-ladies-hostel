import { DeleteOutlined, ExclamationCircleFilled } from "@ant-design/icons";
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
import { useParams, useNavigate } from "react-router-dom";
import {
  adminGetApartmentsCostApi,
  adminRemoveApartmentsCostApi,
} from "../../../../apiservice/admin-General-ApiService";
import {
  IAdminApartmentData,
  IApartmentCostData,
} from "../../../../apiservice/admin-General-ApiService.type";
import { sampleApiCall } from "../../../../apiservice/authService";
import { ITenantBuildingsData } from "../../../../apiservice/tenant-general-apiService.type.";
import useFormatApiRequest from "../../../../hooks/formatApiRequest";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../../Redux/reduxCustomHook";
import { RootState } from "../../../../Redux/store";
import { appZIndex } from "../../../../utils/appconst";
import { formatCurrency } from "../../../../utils/basic.utils";
import { convertToShortDate } from "../../../../utils/date.utils";
import { ILoadState } from "../../../../utils/loading.utils.";
import "./admin-apartment-unit-cost-list.css";
type NotificationType = "success" | "info" | "warning" | "error";

type IAdminApartmentUnitCost = {
  externalFilter?: any;
  initialDefaultFilter?: any;
  hidePagination?: boolean;
};

export const AdminApartmentUnitCost: React.FC<IAdminApartmentUnitCost> = ({
  externalFilter,
  initialDefaultFilter,
  hidePagination = true,
}) => {
  const [apartmentUnitCostsLoadState, setApartmentUnitCostLoadState] =
    useState<ILoadState>("loading");
  const [loadApartmentUnitCostsData, setLoadApartmentUnitCostsData] =
    useState(true);
  const [apartmentUnitCostsDefaultFilter, setApartmentUnitCostDefaultFilter] =
    useState(initialDefaultFilter || {});
  const [tableData, setTableData] = useState<IApartmentCostData[]>([]);
  const [selectedCostIndex, setSelectedCostIndex] = useState(0);
  const [loadRemoveCostApi, setLoadRemoveCostApi] = useState(false);
  const [api, contextHolder] = notification.useNotification();
  const { confirm } = Modal;

  // Pagination Constant/Variables
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(1);
  const perPage = 10;

  // For Navigator/Redux
  const adminSelectedApartmentCostLoadState: boolean = useAppSelector(
    (state: RootState) => state?.AdminSelectedApartmentCostLoadState
  );

  const selectedBuilding: ITenantBuildingsData = useAppSelector(
    (state: RootState) => state?.TenantSelectedBuilding
  );

  const selectedApartment: IAdminApartmentData = useAppSelector(
    (state: RootState) => state?.AdminSelectedApartment
  );

  const params = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // Use Effect to reload API when External Filter has changed
  useEffect(() => {
    if (externalFilter) {
      setApartmentUnitCostDefaultFilter({
        ...apartmentUnitCostsDefaultFilter,
        ...externalFilter,
      });
      setLoadApartmentUnitCostsData(true);
      setApartmentUnitCostLoadState("loading");
    }
  }, [externalFilter]);

  // Use Effect to reload API when Apartment Load State Changed in Redux
  useEffect(() => {
    if (adminSelectedApartmentCostLoadState) {
      dispatch({
        type: "ADMIN_CHANGE_APARTMENT_COST_LOAD_STATE",
        payload: false,
      });
      setLoadApartmentUnitCostsData(true);
      setApartmentUnitCostLoadState("loading");
    }
  }, [adminSelectedApartmentCostLoadState]);

  // A custom hook to Load All ApartmentUnitCosts Details
  const apartmentUnitCostsDataResult = useFormatApiRequest(
    () =>
      adminGetApartmentsCostApi({
        ...apartmentUnitCostsDefaultFilter,
        apartmentId: params.id,
      }),
    loadApartmentUnitCostsData,
    () => {
      setLoadApartmentUnitCostsData(false);
    },
    () => {
      processApartmentUnitCostsResult();
    }
  );

  // Process The Current ApartmentUnitCost Data Result
  const processApartmentUnitCostsResult = async () => {
    if (apartmentUnitCostsDataResult.httpState === "SUCCESS") {
      setTableData(apartmentUnitCostsDataResult.data?.data || []);
      setApartmentUnitCostLoadState("completed");
      setTotalItems(apartmentUnitCostsDataResult.data?.meta?.total || 1);
      if ((apartmentUnitCostsDataResult.data?.data || []).length === 0) {
        setApartmentUnitCostLoadState("noData");
      }
    } else if (apartmentUnitCostsDataResult.httpState === "ERROR") {
      setApartmentUnitCostLoadState("error");
    } else if (apartmentUnitCostsDataResult.httpState === "LOADING") {
      setApartmentUnitCostLoadState("loading");
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
  const showRemoveCostApiConfirm = (index) => {
    setSelectedCostIndex(index);
    confirm({
      title: "Are you sure you want to Remove this Cost, This cannot be undone",
      icon: <ExclamationCircleFilled rev={undefined} />,
      content: "",
      centered: true,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      zIndex: appZIndex.modal,
      onOk() {
        console.log("OK");
        setLoadRemoveCostApi(true);
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  // A custom hook to  Remove Admin
  const removeCostApiResult = useFormatApiRequest(
    () => adminRemoveApartmentsCostApi(tableData[selectedCostIndex].id),
    loadRemoveCostApi,
    () => {
      setLoadRemoveCostApi(false);
    },
    () => {
      processRemoveCostApi();
    }
  );

  // Process The Removal
  const processRemoveCostApi = async () => {
    if (removeCostApiResult.httpState === "SUCCESS") {
      alert("This Cost Have being Removed");
      setLoadApartmentUnitCostsData(true);
    } else if (removeCostApiResult.httpState === "ERROR") {
      alert(
        removeCostApiResult.data?.response?.data?.message ||
          removeCostApiResult.errorMsg ||
          "Error"
      );
    }
  };

  // Use to Control Pagination On Change Event
  const onPageChange = (page: number, pageSize: number) => {
    setCurrentPage(page);
    setApartmentUnitCostDefaultFilter({
      ...apartmentUnitCostsDefaultFilter,
      page: page,
      perPage: pageSize,
    });
    setLoadApartmentUnitCostsData(true);
  };

  return (
    <>
      {/* " The context is use to hold the notification from ant design" */}
      {contextHolder}
      <div>
        {/* " Show Loading Indicator" */}
        {apartmentUnitCostsLoadState === "loading" && (
          <div
            className="w3-col w3-center w3-padding-bottom"
            style={{ paddingTop: "100px" }}
          >
            <Spin size="large" />
          </div>
        )}

        {/* " Show Loading Error" */}
        {apartmentUnitCostsLoadState === "error" && (
          <div className="w3-col w3-padding-bottom">
            <Result
              status="500"
              title="Error"
              subTitle="Sorry, something went wrong, it could be a network Related error"
              extra={
                <Button
                  onClick={() => setLoadApartmentUnitCostsData(true)}
                  type="primary"
                >
                  Reload
                </Button>
              }
            />
          </div>
        )}

        {/* " Show No data" */}
        {apartmentUnitCostsLoadState === "noData" && (
          <div className="w3-margin-top w3-col w3-border-bottom">
            <div className="w3-col">
              <div className="w3-content">
                <div className="w3-col w3-padding">
                  <h4 className="myfont1">Cost Incured on this Apartment</h4>
                </div>
                <div className="w3-col w3-padding">
                  <p>No Cost Incured on this Apartment Yet.</p>
                  {/* <Empty></Empty> */}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* " Show No data" */}
        {apartmentUnitCostsLoadState === "completed" && (
          <div className="w3-margin-top w3-col w3-border-bottom">
            <div className="w3-col">
              <div className="w3-content">
                <div>
                  {/* Recent activities */}
                  <div className="w3-col l12 s12">
                    <div className="w3-col w3-padding">
                      <h4 className="myfont1">
                        Cost Incured on this Apartment
                      </h4>
                      <div className="w3-col">
                        {tableData.map((apartmentUnitCosts, index) => (
                          <>
                            <div
                              className="w3-col w3-margin-bottom"
                              key={index}
                            >
                              <span>
                                {Number(index) + Number(1)}.{" "}
                                {apartmentUnitCosts.title}
                              </span>
                              <br />
                              <span className="w3-small">
                                <span className={"w3-left"}>
                                  <span className="w3-text-red">
                                    {formatCurrency(
                                      apartmentUnitCosts.amount || 0
                                    )}
                                  </span>
                                  &nbsp;-{" "}
                                  {convertToShortDate(
                                    apartmentUnitCosts.dateIssued
                                  )}
                                </span>
                                <span className={"w3-right"}>
                                  <span style={{ zoom: "1.5" }}>
                                    <DeleteOutlined
                                      onClick={() => {
                                        showRemoveCostApiConfirm(index);
                                      }}
                                    />
                                  </span>
                                </span>
                              </span>
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
