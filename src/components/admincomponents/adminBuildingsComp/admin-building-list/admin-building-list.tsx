import {
  AppstoreOutlined,
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleFilled,
  EyeOutlined,
  ToolOutlined,
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
import { useNavigate } from "react-router-dom";
import {
  adminDeleteBuildingsApi,
  adminGetBuildingsApi,
} from "../../../../apiservice/admin-General-ApiService";
import { IAdminBuildingsData } from "../../../../apiservice/admin-General-ApiService.type";
import { sampleApiCall } from "../../../../apiservice/authService";
import useFormatApiRequest from "../../../../hooks/formatApiRequest";
import { useAppDispatch } from "../../../../Redux/reduxCustomHook";
import { formatCurrency } from "../../../../utils/basic.utils";
import { appZIndex } from "../../../../utils/appconst";
import { ILoadState } from "../../../../utils/loading.utils.";
import "./admin-building-list.css";
type NotificationType = "success" | "info" | "warning" | "error";

type IAdminBuildingList = {
  externalFilter?: any;
  initialDefaultFilter?: any;
  hidePagination?: boolean;
  onTotalChange?: (total: number) => void;
};

export const AdminBuildingList: React.FC<IAdminBuildingList> = ({
  externalFilter,
  initialDefaultFilter,
  hidePagination = true,
  onTotalChange,
}) => {
  const [buildingsLoadState, setBuildingLoadState] =
    useState<ILoadState>("loading");
  const [loadBuildingsData, setLoadBuildingsData] = useState(true);
  const [buildingsDefaultFilter, setBuildingDefaultFilter] = useState(
    initialDefaultFilter || {}
  );
  const [tableData, setTableData] = useState<IAdminBuildingsData[]>([]);

  const [selectedBuildingIndex, setSelectedBuildingIndex] = useState(0);
  const [loadRemoveBuildingApi, setLoadRemoveBuildingApi] = useState(false);
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
    () => adminGetBuildingsApi(buildingsDefaultFilter),
    loadBuildingsData,
    () => {
      setLoadBuildingsData(false);
    },
    () => {
      processBuildingsResult();
    }
  );

  // Process The Current Building Data Result
  const processBuildingsResult = async () => {
    if (buildingsDataResult.httpState === "SUCCESS") {
      setTableData(buildingsDataResult.data?.data || []);
      setBuildingLoadState("completed");
      setTotalItems(buildingsDataResult.data?.meta?.total || 1);
      onTotalChange?.(buildingsDataResult.data?.meta?.total || 0);
      if (!buildingsDataResult.data?.data?.length) {
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

  // Remove Building
  const showRemoveBuildingApiConfirm = (index) => {
    setSelectedBuildingIndex(index);
    confirm({
      title:
        "Are you sure you want to Remove this Building, This cannot be undone",
      icon: <ExclamationCircleFilled rev={undefined} />,
      content: "",
      centered: true,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      zIndex: appZIndex.modal,
      onOk() {
        console.log("OK");
        setLoadRemoveBuildingApi(true);
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  // A custom hook to  Remove Admin
  const removeBuildingApiResult = useFormatApiRequest(
    () => adminDeleteBuildingsApi(tableData[selectedBuildingIndex].id),
    loadRemoveBuildingApi,
    () => {
      setLoadRemoveBuildingApi(false);
    },
    () => {
      processRemoveBuildingApi();
    }
  );

  // Process The Removal
  const processRemoveBuildingApi = async () => {
    if (removeBuildingApiResult.httpState === "SUCCESS") {
      alert("This Building Have Being Deleted");
      setLoadBuildingsData(true);
    } else if (removeBuildingApiResult.httpState === "ERROR") {
      alert(
        removeBuildingApiResult.data?.response?.data?.message ||
          removeBuildingApiResult.errorMsg ||
          "Error"
      );
    }
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
  const navigateToEdit = async (index: number) => {
    dispatch({
      type: "ADMIN_ADD_SELECTED_BUILDING",
      payload: tableData[index],
    });
    navigate(`/admin/buildings-edit/${tableData[index].id}`);
  };

  // Navigate to the next Page
  const navigateToView = async (index: number) => {
    dispatch({
      type: "ADMIN_ADD_SELECTED_BUILDING",
      payload: tableData[index],
    });
    navigate(`/admin/apartment/${tableData[index].id}`);
  };

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
          <div className="w3-col adminBldgEmpty">
            <Empty
              description={
                <span className="myfont1 adminBldgEmptyText">
                  No buildings yet. Add your first building to get started.
                </span>
              }
            >
              <button
                type="button"
                onClick={() => navigate("/admin/buildings-add")}
                className="adminBldgBtn adminBldgBtnPrimary myfont3"
              >
                Add Building
              </button>
            </Empty>
          </div>
        )}

        {/* " Show Buildings" */}
        {buildingsLoadState === "completed" && (
          <div className="w3-col">
            <div className="adminBldgGrid">
              {tableData.map((buildings, index) => (
                <div key={buildings.id || index} className="adminBldgCard">
                  <div className="adminBldgImageWrap">
                    <img
                      className="adminBldgImage"
                      alt={buildings?.title || "Building"}
                      src={buildings?.imageUrl}
                    />
                    <span className="adminBldgPrice myfont3">
                      {formatCurrency(buildings?.price)}
                    </span>
                  </div>

                  <div className="adminBldgBody">
                    <h5 className="adminBldgTitle myfont3">
                      {buildings?.title}
                    </h5>
                    <p className="adminBldgText myfont1">
                      {buildings?.description}
                    </p>

                    <div className="adminBldgMeta myfont1">
                      <span className="adminBldgChip">
                        <AppstoreOutlined /> {buildings?.noOfApartments || 0}{" "}
                        Units
                      </span>
                      {!!buildings?.serviceCharge && (
                        <span className="adminBldgChip">
                          <ToolOutlined />{" "}
                          {formatCurrency(buildings.serviceCharge)} service
                        </span>
                      )}
                    </div>

                    <div className="adminBldgActions">
                      <button
                        type="button"
                        onClick={() => {
                          navigateToView(index);
                        }}
                        className="adminBldgBtn adminBldgBtnPrimary myfont3"
                      >
                        <EyeOutlined /> View Units
                      </button>
                      <button
                        type="button"
                        title="Edit building"
                        aria-label={`Edit ${buildings?.title}`}
                        onClick={() => {
                          navigateToEdit(index);
                        }}
                        className="adminBldgBtn adminBldgBtnIcon"
                      >
                        <EditOutlined />
                      </button>
                      <button
                        type="button"
                        title="Delete building"
                        aria-label={`Delete ${buildings?.title}`}
                        onClick={() => {
                          showRemoveBuildingApiConfirm(index);
                        }}
                        className="adminBldgBtn adminBldgBtnIcon adminBldgBtnDanger"
                      >
                        <DeleteOutlined />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {!hidePagination && (
              <div className="w3-col adminBldgPagination">
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
