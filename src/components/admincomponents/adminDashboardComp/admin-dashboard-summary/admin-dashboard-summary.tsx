import { Link } from "react-router-dom";
import {
  AppstoreOutlined,
  CheckCircleOutlined,
  HomeOutlined,
  RiseOutlined,
  SettingOutlined,
  WalletOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import { IAdminDashboardData } from "../../../../apiservice/admin-General-ApiService.type";
import { useAppSelector } from "../../../../Redux/reduxCustomHook";
import { RootState } from "../../../../Redux/store";
import { formatCurrency } from "../../../../utils/basic.utils";
import "./admin-dashboard-summary.css";

const quickActions = [
  {
    icon: <HomeOutlined />,
    title: "Buildings",
    text: "Manage buildings & units",
    url: "/admin/Buildings",
  },
  {
    icon: <SettingOutlined />,
    title: "Settings",
    text: "Admins, bank & profile",
    url: "/admin/Settings",
  },
];

export const AdminDashboardSummary = () => {
  const dashboard: Partial<IAdminDashboardData> = useAppSelector(
    (state: RootState) => state?.AdminDashBoardData
  );

  const revenue = dashboard?.revenue?.currentYear;
  const totalRevenue = revenue?.totalRevenue || 0;
  const collected = revenue?.amountCollected || 0;
  const collectedPercent = totalRevenue
    ? Math.min(100, Math.round((collected / totalRevenue) * 100))
    : 0;

  const occupancy = dashboard?.occupancyRate;
  const totalUnits = occupancy?.noOfApartments || 0;
  const occupied = occupancy?.noOfOccupied || 0;
  const occupancyPercent = totalUnits
    ? Math.round((occupied / totalUnits) * 100)
    : 0;

  const overduePeriods = dashboard?.overdueRevenuePeriods || [];
  const overdueCount = overduePeriods.reduce(
    (count, period) => count + (period?.revenues?.length || 0),
    0
  );
  const overdueAmount = overduePeriods.reduce(
    (sum, period) => sum + Number(period?.totalAmount || 0),
    0
  );

  const stats = [
    {
      icon: <RiseOutlined />,
      label: "Total Revenue",
      value: formatCurrency(totalRevenue),
      note: "Expected this year",
    },
    {
      icon: <WalletOutlined />,
      label: "Amount Collected",
      value: formatCurrency(collected),
      note: `${collectedPercent}% of total revenue`,
      progress: collectedPercent,
    },
    {
      icon: <AppstoreOutlined />,
      label: "Occupancy",
      value: `${occupancyPercent}%`,
      note: `${occupied} of ${totalUnits} units occupied`,
      progress: occupancyPercent,
    },
    {
      icon: overdueCount ? <WarningOutlined /> : <CheckCircleOutlined />,
      label: "Overdue Rent",
      value: String(overdueCount),
      note: overdueCount
        ? `${formatCurrency(overdueAmount)} outstanding`
        : "Everyone is up to date",
      alert: overdueCount > 0,
    },
  ];

  return (
    <>
      {/* Key numbers */}
      <div className="dashStats">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={`dashStat ${stat.alert ? "dashStatAlert" : ""}`}
          >
            <div className="dashStatTop">
              <span className="dashStatIcon">{stat.icon}</span>
              <span className="dashStatLabel myfont1">{stat.label}</span>
            </div>
            <span className="dashStatValue myfont3">{stat.value}</span>
            {stat.progress !== undefined && (
              <div
                className="dashProgress"
                role="progressbar"
                aria-valuenow={stat.progress}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={stat.label}
              >
                <span style={{ width: `${stat.progress}%` }}></span>
              </div>
            )}
            <span className="dashStatNote myfont1">{stat.note}</span>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="dashActions">
        {quickActions.map((action) => (
          <Link key={action.url} to={action.url} className="dashAction">
            <span className="dashActionIcon">{action.icon}</span>
            <span>
              <span className="dashActionTitle myfont3">{action.title}</span>
              <span className="dashActionText myfont1">{action.text}</span>
            </span>
          </Link>
        ))}
      </div>
    </>
  );
};

export default AdminDashboardSummary;
