import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Card, Col, Row, Skeleton, Statistic, Table, Typography } from "antd";
import { getSaasDashboard } from "../../../apiservice/saas-ApiService";
import { getApiErrorMessage } from "../../../apiservice/public-ApiService";
import { formatNaira } from "./saasAdminTheme";

const SaasDashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getSaasDashboard()
      .then((result) => setData(result?.data))
      .catch((e) => setError(getApiErrorMessage(e)));
  }, []);

  if (error) return <Alert type="error" message={error} showIcon />;
  if (!data) return <Skeleton active />;

  const stats = [
    { title: "Estates", value: data.estates.total, onClick: () => navigate("/saas/estates") },
    { title: "Active estates", value: data.estates.active },
    { title: "Blocked estates", value: data.estates.blocked, onClick: () => navigate("/saas/estates?blocked=true") },
    { title: "New in last 30 days", value: data.estates.newLast30Days },
    { title: "Monthly recurring revenue", value: formatNaira(data.monthlyRecurringRevenue) },
    { title: "Unhandled messages", value: data.unhandledMessages, onClick: () => navigate("/saas/messages") },
    { title: "Estate admins", value: data.users.admins, onClick: () => navigate("/saas/users") },
    { title: "Tenants", value: data.users.tenants, onClick: () => navigate("/saas/users?tab=tenants") },
    { title: "Active occupants", value: data.users.activeOccupants },
    { title: "Buildings", value: data.buildings },
    { title: "Apartments", value: data.apartments },
  ];

  return (
    <>
      <div className="saasAdminPageHeader">
        <Typography.Title level={3}>Dashboard</Typography.Title>
      </div>

      <Row gutter={[16, 16]}>
        {stats.map((stat) => (
          <Col xs={12} md={8} xl={6} key={stat.title}>
            <Card hoverable={!!stat.onClick} onClick={stat.onClick} size="small">
              <Statistic title={stat.title} value={stat.value} />
            </Card>
          </Col>
        ))}
      </Row>

      <Card title="Estates per plan" style={{ marginTop: 16 }} size="small">
        <Table
          rowKey="id"
          dataSource={data.plans}
          pagination={false}
          size="small"
          scroll={{ x: true }}
          onRow={(plan: any) => ({ onClick: () => navigate(`/saas/estates?planId=${plan.id}`), style: { cursor: "pointer" } })}
          columns={[
            { title: "Plan", dataIndex: "title" },
            { title: "Price / month", dataIndex: "monthlyPrice", render: formatNaira },
            { title: "Estates", dataIndex: "estates" },
            { title: "Active", dataIndex: "activeEstates" },
            {
              title: "Monthly revenue",
              render: (_: any, plan: any) => formatNaira((plan.monthlyPrice ?? 0) * plan.activeEstates),
            },
          ]}
        />
        <Typography.Text type="secondary" style={{ fontSize: 12 }}>
          Revenue counts active estates on priced plans. Custom plans are billed separately.
        </Typography.Text>
      </Card>
    </>
  );
};

export default SaasDashboard;
