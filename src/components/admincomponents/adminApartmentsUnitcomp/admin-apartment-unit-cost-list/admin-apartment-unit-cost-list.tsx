import {
  DeleteOutlined,
  ExclamationCircleFilled,
  WalletOutlined,
} from "@ant-design/icons";
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
              title={<span className="w3-text-white">Error</span>}
              subTitle={
                <span className="w3-text-white">
                  Sorry, something went wrong, it could be a network Related
                  error
                </span>
              }
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
          <div className="w3-content adminPageBody adminCostBody">
            <div className="adminPanel">
              <div className="adminPanelHeader">
                <h3 className="adminPanelTitle myfont3">
                  <span className="adminPanelIcon">
                    <WalletOutlined />
                  </span>
                  Costs Incurred
                </h3>
              </div>
              <p className="adminListSub myfont1">
                No cost has been recorded on this apartment yet.
              </p>
            </div>
          </div>
        )}

        {/* " Show Costs" */}
        {apartmentUnitCostsLoadState === "completed" && (
          <div className="w3-content adminPageBody adminCostBody">
            <div className="adminPanel">
              <div className="adminPanelHeader">
                <h3 className="adminPanelTitle myfont3">
                  <span className="adminPanelIcon">
                    <WalletOutlined />
                  </span>
                  Costs Incurred
                  <span className="adminCountBadge">{totalItems}</span>
                </h3>
                <span className="adminCostTotal myfont1">
                  {totalItems > tableData.length ? "Page total" : "Total"}{" "}
                  <b className="myfont3">
                    {formatCurrency(
                      tableData.reduce(
                        (sum, cost) => sum + Number(cost.amount || 0),
                        0
                      )
                    )}
                  </b>
                </span>
              </div>

              {tableData.map((apartmentUnitCosts, index) => (
                <div
                  className="adminListRow adminCostRow"
                  key={apartmentUnitCosts.id || index}
                >
                  <div className="adminListMain">
                    <h5 className="adminListTitle myfont3">
                      {apartmentUnitCosts.title}
                    </h5>
                    <p className="adminListSub myfont1">
                      {convertToShortDate(apartmentUnitCosts.dateIssued)}
                    </p>
                  </div>
                  <div className="adminListAside">
                    <span className="adminCostAmount myfont3">
                      {formatCurrency(apartmentUnitCosts.amount || 0)}
                    </span>
                  </div>
                  <button
                    type="button"
                    title="Remove cost"
                    aria-label={`Remove ${apartmentUnitCosts.title}`}
                    onClick={() => {
                      showRemoveCostApiConfirm(index);
                    }}
                    className="adminBtn adminBtnIcon adminBtnDanger"
                  >
                    <DeleteOutlined />
                  </button>
                </div>
              ))}
            </div>

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
