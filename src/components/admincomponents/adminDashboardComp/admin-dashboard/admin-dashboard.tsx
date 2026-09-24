import { Button, Empty, notification, Result, Spin } from "antd";
import { useEffect, useState } from "react";
import {
  adminDashboardApi,
  adminGetSettingsApi,
} from "../../../../apiservice/admin-General-ApiService";
import useFormatApiRequest from "../../../../hooks/formatApiRequest";
import useAuth from "../../../../hooks/useAuth";
import { useAppDispatch } from "../../../../Redux/reduxCustomHook";
import { ILoadState } from "../../../../utils/loading.utils.";
import AdminChartCashFlow from "../../adminCharts/adminChart-CashFlow";
import AdminChartCashProjection from "../../adminCharts/adminChart-CashProjection";
import AdminChartOccupancy from "../../adminCharts/adminChart-OccupancyRate";
import AdminChartRevenue from "../../adminCharts/adminChart-Revenue";
import AdminTableRevenueTab from "../../adminCharts/adminTable-Revenue-Tab";
import AdminTableRevenueTabCurrent from "../../adminCharts/adminTable-Revenue-Tab-Current";
import AdminTableUpcomingRevenue from "../../adminCharts/adminTable-Upcoming-Revenue";
import "./admin-dashboard.css";
import AdminDashboardSummary from "../admin-dashboard-summary/admin-dashboard-summary";
import RevenueGrid from "../../adminCharts/adminTable-Upcoming-Revenue-grid";
import RevenueGridOverDue from "../../adminCharts/adminTable-OverDue-Revenue-grid";
type NotificationType = "success" | "info" | "warning" | "error";

type IAdminDashboard = {
  externalFilter?: any;
  initialDefaultFilter?: any;
};

export const AdminDashboard: React.FC<IAdminDashboard> = ({
  externalFilter,
  initialDefaultFilter,
}) => {
  const [adminDashboardLoadState, setAdminDashboardLoadState] =
    useState<ILoadState>("loading");
  const [loadAdminDashboardData, setLoadAdminDashboardData] = useState(true);
  const [adminDashboardDefaultFilter, setAdminDashboardDefaultFilter] =
    useState(initialDefaultFilter || {});
  const [tableData, setTableData] = useState<any[]>([]);
  const [api, contextHolder] = notification.useNotification();

  const dispatch = useAppDispatch();

  const [loadAuth, setLoadAuth] = useState(false);

  // Use to refresh the Auth State
  const authState = useAuth(loadAuth, () => {
    setLoadAuth(false);
  });

  // Use Effect to reload API when External Filter has changed
  useEffect(() => {
    if (externalFilter) {
      setAdminDashboardDefaultFilter({
        ...adminDashboardDefaultFilter,
        ...externalFilter,
      });
      setLoadAdminDashboardData(true);
      setAdminDashboardLoadState("loading");
      setLoadAuth(true);
    }
  }, [externalFilter]);

  // A custom hook to Load All AdminDashboard Details
  const adminDashboardDataResult = useFormatApiRequest(
    () => adminDashboardApi(adminDashboardDefaultFilter),
    loadAdminDashboardData,
    () => {
      setLoadAdminDashboardData(false);
      fetchSettings();
    },
    () => {
      processAdminDashboardResult();
    }
  );

  // Process The Current AdminDashboard Data Result
  const processAdminDashboardResult = async () => {
    if (adminDashboardDataResult.httpState === "SUCCESS") {
      // setTableData(adminDashboardDataResult.data?.data || [{}]);
      dispatch({
        type: "ADMIN_ADD_DASHBOARD_DATA",
        payload: adminDashboardDataResult.data?.data,
      });
      setAdminDashboardLoadState("completed");
    } else if (adminDashboardDataResult.httpState === "ERROR") {
      setAdminDashboardLoadState("error");
    } else if (adminDashboardDataResult.httpState === "LOADING") {
      setAdminDashboardLoadState("loading");
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

  const fetchSettings = async () => {
    try {
      const response = await adminGetSettingsApi();
      dispatch({
        type: "ADMIN_ADD_SETTINGS",
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
        {adminDashboardLoadState === "loading" && (
          <div
            className="w3-col w3-center w3-padding-bottom"
            style={{ paddingTop: "100px" }}
          >
            <Spin size="large" />
          </div>
        )}

        {/* " Show Loading Error" */}
        {adminDashboardLoadState === "error" && (
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
                  onClick={() => setLoadAdminDashboardData(true)}
                  type="primary"
                >
                  Reload
                </Button>
              }
            />
          </div>
        )}

        {/* " Show No data" */}
        {adminDashboardLoadState === "noData" && (
          <div className="w3-margin-top">
            <Empty></Empty>
          </div>
        )}

        {/* " Show No data" */}
        {adminDashboardLoadState === "completed" && (
          <>
            <AdminDashboardSummary></AdminDashboardSummary>

            <h3 className="adminSectionTitle myfont5 dashSectionTitle">
              Reports
            </h3>
            <div className="w3-col dashCharts">
              <AdminChartRevenue></AdminChartRevenue>
              {/* <AdminTableRevenueTab></AdminTableRevenueTab> */}
              <AdminTableRevenueTabCurrent></AdminTableRevenueTabCurrent>
              <AdminChartCashFlow></AdminChartCashFlow>
              <AdminChartCashProjection></AdminChartCashProjection>
              <RevenueGrid></RevenueGrid>
              <RevenueGridOverDue
                onSuccess={() => setLoadAdminDashboardData(true)}
                onFailure={() => setLoadAdminDashboardData(true)}
              ></RevenueGridOverDue>
              {/* <AdminTableUpcomingRevenue></AdminTableUpcomingRevenue> */}
              <AdminChartOccupancy></AdminChartOccupancy>
            </div>
          </>
        )}
      </div>
    </>
  );
};

// export const testData = [
//   {
//     year: 2025,
//     month: 2,
//     period: "February 2025",
//     totalAmount: 1500.0,
//     revenues: [
//       {
//         buildingId: 2,
//         building: {
//           id: 2,
//           title: "Building 1",
//         },
//         apartmentId: 2,
//         apartment: {
//           id: 2,
//           title: "Apartment 1",
//         },
//         amount: 1500.0,
//         expectedDate: "2025-05-09T10:04:23.2866655Z",
//       },
//       {
//         buildingId: 2,
//         building: {
//           id: 2,
//           title: "Building 1",
//         },
//         apartmentId: 2,
//         apartment: {
//           id: 2,
//           title: "Apartment 1",
//         },
//         amount: 1500.0,
//         expectedDate: "2025-05-09T10:04:23.2866655Z",
//       },
//       {
//         buildingId: 2,
//         building: {
//           id: 2,
//           title: "Building 1",
//         },
//         apartmentId: 2,
//         apartment: {
//           id: 2,
//           title: "Apartment 1",
//         },
//         amount: 1500.0,
//         expectedDate: "2025-05-09T10:04:23.2866655Z",
//       },
//       {
//         buildingId: 2,
//         building: {
//           id: 2,
//           title: "Building 1",
//         },
//         apartmentId: 2,
//         apartment: {
//           id: 2,
//           title: "Apartment 1",
//         },
//         amount: 1500.0,
//         expectedDate: "2025-05-09T10:04:23.2866655Z",
//       },
//       {
//         buildingId: 2,
//         building: {
//           id: 2,
//           title: "Building 1",
//         },
//         apartmentId: 2,
//         apartment: {
//           id: 2,
//           title: "Apartment 1",
//         },
//         amount: 1500.0,
//         expectedDate: "2025-05-09T10:04:23.2866655Z",
//       },
//       {
//         buildingId: 2,
//         building: {
//           id: 2,
//           title: "Building 1",
//         },
//         apartmentId: 2,
//         apartment: {
//           id: 2,
//           title: "Apartment 1",
//         },
//         amount: 1500.0,
//         expectedDate: "2025-05-09T10:04:23.2866655Z",
//       },
//       {
//         buildingId: 2,
//         building: {
//           id: 2,
//           title: "Building 1",
//         },
//         apartmentId: 2,
//         apartment: {
//           id: 2,
//           title: "Apartment 1",
//         },
//         amount: 1500.0,
//         expectedDate: "2025-05-09T10:04:23.2866655Z",
//       },
//       {
//         buildingId: 2,
//         building: {
//           id: 2,
//           title: "Building 1",
//         },
//         apartmentId: 2,
//         apartment: {
//           id: 2,
//           title: "Apartment 1",
//         },
//         amount: 1500.0,
//         expectedDate: "2025-05-09T10:04:23.2866655Z",
//       },
//     ],
//   },
//   {
//     year: 2025,
//     month: 3,
//     period: "March 2025",
//     totalAmount: 1500.0,
//     revenues: [
//       {
//         buildingId: 2,
//         building: {
//           id: 2,
//           title: "Building 1",
//         },
//         apartmentId: 2,
//         apartment: {
//           id: 2,
//           title: "Apartment 1",
//         },
//         amount: 1500.0,
//         expectedDate: "2025-06-09T10:04:23.2866655Z",
//       },
//     ],
//   },
//   {
//     year: 2025,
//     month: 4,
//     period: "April 2025",
//     totalAmount: 1500.0,
//     revenues: [
//       {
//         buildingId: 2,
//         building: {
//           id: 2,
//           title: "Building 1",
//         },
//         apartmentId: 2,
//         apartment: {
//           id: 2,
//           title: "Apartment 1",
//         },
//         amount: 1500.0,
//         expectedDate: "2025-07-09T10:04:23.2866655Z",
//       },
//     ],
//   },
//   {
//     year: 2025,
//     month: 5,
//     period: "May 2025",
//     totalAmount: 1500.0,
//     revenues: [
//       {
//         buildingId: 2,
//         building: {
//           id: 2,
//           title: "Building 1",
//         },
//         apartmentId: 2,
//         apartment: {
//           id: 2,
//           title: "Apartment 1",
//         },
//         amount: 1500.0,
//         expectedDate: "2025-08-09T10:04:23.2866655Z",
//       },
//     ],
//   },
// ];
