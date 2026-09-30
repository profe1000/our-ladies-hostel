import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Alert, Input, Select, Table, Tag, Typography } from "antd";
import { getSaasEstates, getSaasPlans, loginAsEstateAdmin } from "../../../apiservice/saas-ApiService";
import { getApiErrorMessage } from "../../../apiservice/public-ApiService";
import LoginAsButton from "./LoginAsButton";
import { formatDate } from "./saasAdminTheme";

const PAGE_SIZE = 20;

const SaasEstates = () => {
  const navigate = useNavigate();
  // Filters live in the URL so dashboard links and the back button keep them
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page") || 1);
  const search = searchParams.get("search") || "";
  const blocked = searchParams.get("blocked");
  const planId = searchParams.get("planId");

  const [rows, setRows] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [plans, setPlans] = useState<any[]>([]);

  const setParam = (key: string, value?: string | null) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    if (key !== "page") next.delete("page");
    setSearchParams(next);
  };

  useEffect(() => {
    getSaasPlans().then((result) => setPlans(result?.data || [])).catch(() => setPlans([]));
  }, []);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getSaasEstates({
      page,
      pageSize: PAGE_SIZE,
      search,
      blocked: blocked === null ? undefined : blocked === "true",
      planId: planId ? Number(planId) : undefined,
    })
      .then((result) => {
        setRows(result.data);
        setTotal(result.meta.total);
      })
      .catch((e) => setError(getApiErrorMessage(e)))
      .finally(() => setLoading(false));
  }, [page, search, blocked, planId]);

  return (
    <>
      <div className="saasAdminPageHeader">
        <Typography.Title level={3}>Estates</Typography.Title>
      </div>

      <div className="saasAdminToolbar">
        <Input.Search
          placeholder="Name, estate ID, email or phone"
          defaultValue={search}
          allowClear
          onSearch={(value) => setParam("search", value.trim())}
          style={{ maxWidth: 320 }}
        />
        <Select
          placeholder="All plans"
          allowClear
          value={planId ? Number(planId) : undefined}
          onChange={(value) => setParam("planId", value ? String(value) : null)}
          options={plans.map((plan) => ({ value: plan.id, label: plan.title }))}
          style={{ minWidth: 140 }}
        />
        <Select
          placeholder="Any status"
          allowClear
          value={blocked ?? undefined}
          onChange={(value) => setParam("blocked", value)}
          options={[
            { value: "false", label: "Active" },
            { value: "true", label: "Blocked" },
          ]}
          style={{ minWidth: 140 }}
        />
      </div>

      {error && <Alert type="error" message={error} showIcon style={{ marginBottom: 16 }} />}

      <Table
        rowKey="id"
        loading={loading}
        dataSource={rows}
        scroll={{ x: true }}
        onRow={(estate: any) => ({ onClick: () => navigate(`/saas/estates/${estate.id}`), style: { cursor: "pointer" } })}
        pagination={{
          current: page,
          pageSize: PAGE_SIZE,
          total,
          showSizeChanger: false,
          onChange: (next) => setParam("page", String(next)),
        }}
        columns={[
          {
            title: "Estate",
            render: (_: any, estate: any) => (
              <>
                <div>{estate.name}</div>
                <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                  {estate.slug}
                </Typography.Text>
              </>
            ),
          },
          { title: "Plan", render: (_: any, estate: any) => <Tag>{estate.plan?.title}</Tag> },
          {
            title: "Status",
            dataIndex: "blocked",
            render: (isBlocked: boolean) => (isBlocked ? <Tag color="red">Blocked</Tag> : <Tag color="green">Active</Tag>),
          },
          { title: "Buildings", dataIndex: "buildings" },
          { title: "Apartments", dataIndex: "apartments" },
          { title: "Tenants", dataIndex: "tenants" },
          { title: "Admins", dataIndex: "admins" },
          { title: "Joined", dataIndex: "dateCreated", render: formatDate },
          {
            title: "",
            render: (_: any, estate: any) => (
              <LoginAsButton
                isAdmin
                disabled={estate.blocked || !estate.admins}
                start={(readOnly) => loginAsEstateAdmin(estate.id, { readOnly })}
              />
            ),
          },
        ]}
      />
    </>
  );
};

export default SaasEstates;
