import {
  AppstoreOutlined,
  DollarOutlined,
  EditOutlined,
  UserOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import { Button, notification, Pagination, Result, Spin } from "antd";
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { adminGetApartmentsApi } from "../../../../apiservice/admin-General-ApiService";
import {
  IAdminApartmentData,
  IAdminBuildingsData,
} from "../../../../apiservice/admin-General-ApiService.type";
import { sampleApiCall } from "../../../../apiservice/authService";
import useFormatApiRequest from "../../../../hooks/formatApiRequest";
import {
  useAppSelector,
  useAppDispatch,
} from "../../../../Redux/reduxCustomHook";
import { RootState } from "../../../../Redux/store";
import { formatCurrency } from "../../../../utils/basic.utils";
import { ILoadState } from "../../../../utils/loading.utils.";
import "./admin-apartment-unit-list.css";
type NotificationType = "success" | "info" | "warning" | "error";

type IAdminApartmentUnitList = {
  externalFilter?: any;
  initialDefaultFilter?: any;
  hidePagination?: boolean;
  onTotalChange?: (total: number) => void;
};

export const AdminApartmentUnitList: React.FC<IAdminApartmentUnitList> = ({
  externalFilter,
  initialDefaultFilter,
  hidePagination = true,
  onTotalChange,
}) => {
  const [apartmentUnitsLoadState, setApartmentUnitLoadState] =
    useState<ILoadState>("loading");
  const [loadApartmentUnitsData, setLoadApartmentUnitsData] = useState(true);
  const [apartmentUnitsDefaultFilter, setApartmentUnitDefaultFilter] = useState(
    initialDefaultFilter || {}
  );
  const [tableData, setTableData] = useState<IAdminApartmentData[]>([]);
  const [api, contextHolder] = notification.useNotification();

  // Pagination Constant/Variables
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(1);
  const perPage = initialDefaultFilter?.perPage || 10;

  // For Navigator/Redux
  const selectedBuilding: IAdminBuildingsData = useAppSelector(
    (state: RootState) => state?.AdminSelectedBuilding
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
      adminGetApartmentsApi({
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
      setTableData(apartmentUnitsDataResult.data?.data || []);
      setApartmentUnitLoadState("completed");
      setTotalItems(apartmentUnitsDataResult.data?.meta?.total || 1);
      onTotalChange?.(apartmentUnitsDataResult.data?.meta?.total || 0);
      if (!apartmentUnitsDataResult.data?.data?.length) {
        setApartmentUnitLoadState("noData");
      }
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
  const navigateToEdit = async (index: number) => {
    dispatch({
      type: "ADMIN_ADD_SELECTED_APARTMENT",
      payload: tableData[index],
    });
    navigate(`/admin/apartment-edit/${tableData[index].id}`);
  };

  const navigateToCost = async (index: number) => {
    dispatch({
      type: "ADMIN_ADD_SELECTED_APARTMENT",
      payload: tableData[index],
    });
    navigate(`/admin/apartment-manage-cost/${tableData[index].id}`);
  };

  const navigateToOccupant = async (index: number) => {
    dispatch({
      type: "ADMIN_ADD_SELECTED_APARTMENT",
      payload: tableData[index],
    });
    dispatch({
      type: "ADMIN_ADD_SELECTED_TENANT",
      payload: tableData[index].currentOccupant?.tenant,
    });
    dispatch({
      type: "ADMIN_ADD_SELECTED_OCCUPANT",
      payload: tableData[index].currentOccupant,
    });
    navigate(`/admin/apartment-tenant/${tableData[index].id}`);
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
          <div className="w3-col adminPanel adminEmpty">
            <span className="adminEmptyIcon">
              <AppstoreOutlined />
            </span>
            <p className="myfont1">
              No apartment units have been added to{" "}
              {selectedBuilding?.title || "this building"} yet.
            </p>
          </div>
        )}

        {/* " Show Apartment Units" */}
        {apartmentUnitsLoadState === "completed" && (
          <div className="w3-col">
            <div className="adminUnitGrid">
              {tableData.map((apartmentUnits, index) => (
                <div
                  key={apartmentUnits.id || index}
                  className={`adminUnitCard ${
                    apartmentUnits?.currentOccupant?.expired
                      ? "adminUnitCardDue"
                      : ""
                  }`}
                >
                  <div className="adminUnitTop">
                    <span className="adminUnitNumber myfont3">
                      {(currentPage - 1) * perPage + index + 1}
                    </span>
                    <h5 className="adminUnitTitle myfont3">
                      {apartmentUnits.title}
                    </h5>
                    <span
                      className={`adminStatusPill myfont1 ${
                        apartmentUnits.isOccupied
                          ? "adminStatusOccupied"
                          : "adminStatusVacant"
                      }`}
                    >
                      {apartmentUnits.isOccupied ? "Occupied" : "Vacant"}
                    </span>
                  </div>

                  <div className="adminUnitInfo myfont1">
                    <span>
                      Rent{" "}
                      <b className="adminUnitPrice">
                        {formatCurrency(apartmentUnits.price || 0)}
                      </b>
                    </span>
                    <span className="adminUnitOccupant">
                      <UserOutlined />{" "}
                      {apartmentUnits?.currentOccupant?.tenant?.fullName ||
                        "No occupant"}
                    </span>
                  </div>

                  {apartmentUnits?.currentOccupant?.expired && (
                    <div className="adminUnitDue myfont1">
                      <WarningOutlined /> This apartment's rent is due.
                    </div>
                  )}

                  <div className="adminBtnRow adminUnitActions">
                    <button
                      type="button"
                      onClick={() => {
                        navigateToOccupant(index);
                      }}
                      className="adminBtn adminBtnPrimary adminUnitMainBtn"
                    >
                      <UserOutlined /> Occupant
                    </button>
                    <button
                      type="button"
                      title="Manage cost"
                      aria-label={`Manage cost for ${apartmentUnits.title}`}
                      onClick={() => {
                        navigateToCost(index);
                      }}
                      className="adminBtn adminBtnIcon"
                    >
                      <DollarOutlined />
                    </button>
                    <button
                      type="button"
                      title="Edit apartment"
                      aria-label={`Edit ${apartmentUnits.title}`}
                      onClick={() => {
                        navigateToEdit(index);
                      }}
                      className="adminBtn adminBtnIcon"
                    >
                      <EditOutlined />
                    </button>
                  </div>
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
