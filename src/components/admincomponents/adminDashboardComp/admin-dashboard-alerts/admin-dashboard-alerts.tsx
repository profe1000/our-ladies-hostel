import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  RightOutlined,
  SolutionOutlined,
} from "@ant-design/icons";
import {
  adminGetApartmentRequestsApi,
  adminGetRentPaymentsApi,
} from "../../../../apiservice/admin-General-ApiService";
import "./admin-dashboard-alerts.css";

type ICount = number | null;

// Read the total from a list response, falling back to the page length
const getTotal = (response: any): number =>
  response?.meta?.total ?? response?.data?.length ?? 0;

/*
  "Needs attention" strip at the top of the dashboard: how many payments
  are waiting to be confirmed and how many tenant requests are pending.
*/
export const AdminDashboardAlerts = () => {
  const [pendingPayments, setPendingPayments] = useState<ICount>(null);
  const [pendingRequests, setPendingRequests] = useState<ICount>(null);

  useEffect(() => {
    let cancelled = false;

    adminGetRentPaymentsApi({ paymentStatusId: 0, page: 1, perPage: 1 })
      .then((response) => !cancelled && setPendingPayments(getTotal(response)))
      .catch((error) => {
        console.error("Error fetching pending payments:", error);
        if (!cancelled) setPendingPayments(0);
      });

    adminGetApartmentRequestsApi({ statusId: "Pending", page: 1, pageSize: 1 })
      .then((response) => !cancelled && setPendingRequests(getTotal(response)))
      .catch((error) => {
        console.error("Error fetching tenant requests:", error);
        if (!cancelled) setPendingRequests(0);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const alerts = [
    {
      key: "payments",
      icon: <ClockCircleOutlined />,
      count: pendingPayments,
      label: "Pending Payments",
      text: (count: number) =>
        count === 1
          ? "1 payment is waiting to be confirmed"
          : `${count} payments are waiting to be confirmed`,
      url: "/admin/pending-user",
    },
    {
      key: "requests",
      icon: <SolutionOutlined />,
      count: pendingRequests,
      label: "Tenant Requests",
      text: (count: number) =>
        count === 1
          ? "1 new request needs a decision"
          : `${count} new requests need a decision`,
      url: "/admin/tenant-requests",
    },
  ];

  return (
    <div className="dashAlerts" aria-live="polite">
      {alerts.map((alert) => {
        const loading = alert.count === null;
        const hasItems = !loading && (alert.count as number) > 0;
        return (
          <Link
            key={alert.key}
            to={alert.url}
            className={`dashAlert ${hasItems ? "dashAlertActive" : ""}`}
          >
            <span className="dashAlertIcon">
              {hasItems || loading ? alert.icon : <CheckCircleOutlined />}
            </span>
            <span className="dashAlertBody">
              <span className="dashAlertLabel myfont1">
                {alert.label}
                {hasItems && <span className="dashAlertDot" />}
              </span>
              <span className="dashAlertText myfont1">
                {loading
                  ? "Checking..."
                  : hasItems
                  ? alert.text(alert.count as number)
                  : "Nothing waiting"}
              </span>
            </span>
            <span className="dashAlertCount myfont3">
              {loading ? "–" : alert.count}
            </span>
            <RightOutlined className="dashAlertArrow" />
          </Link>
        );
      })}
    </div>
  );
};

export default AdminDashboardAlerts;
