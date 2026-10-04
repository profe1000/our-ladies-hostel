import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Alert, Input, Table, Tabs, Tag, Typography } from "antd";
import {
  getSaasEstateAdmins,
  getSaasTenants,
  loginAsEstateAdmin,
  loginAsTenantFromSaas,
} from "../../../apiservice/saas-ApiService";
import { getApiErrorMessage } from "../../../apiservice/public-ApiService";
import LoginAsButton from "./LoginAsButton";
import { formatDate } from "./saasAdminTheme";

const PAGE_SIZE = 20;

/** Estate admins and tenants of every estate */
const SaasUsers = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get("tab") === "tenants" ? "tenants" : "admins";
  const page = Number(searchParams.get("page") || 1);
  const search = searchParams.get("search") || "";
  const estateId = searchParams.get("estateId");

  const [rows, setRows] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setParams = (changes: Record<string, string | null>) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(changes).forEach(([key, value]) => (value ? next.set(key, value) : next.delete(key)));
    if (!("page" in changes)) next.delete("page");
    setSearchParams(next);
  };

  useEffect(() => {
    setLoading(true);
    setError(null);
    const params = { page, pageSize: PAGE_SIZE, search, estateId: estateId ? Number(estateId) : undefined };
    (tab === "tenants" ? getSaasTenants(params) : getSaasEstateAdmins(params))
      .then((result) => {
        setRows(result.data);
        setTotal(result.meta.total);
      })
      .catch((e) => setError(getApiErrorMessage(e)))
      .finally(() => setLoading(false));
  }, [tab, page, search, estateId]);

  const statusTag = (user: any) =>
    user.blocked ? (
      <Tag color="red">Blocked</Tag>
    ) : tab === "tenants" && !user.activated ? (
      <Tag>Not activated</Tag>
    ) : (
      <Tag color="green">Active</Tag>
    );

  const columns: any[] = [
    { title: "Name", dataIndex: "fullName" },
    { title: "Email", dataIndex: "email" },
    { title: "Phone", dataIndex: "phoneNumber", render: (value: string) => value || "-" },
    ...(tab === "admins" ? [{ title: "Role", dataIndex: "role" }] : []),
    {
      title: "Estate",
      render: (_: any, user: any) =>
        user.estate ? <Link to={`/saas/estates/${user.estate.id}`}>{user.estate.name}</Link> : "-",
    },
    { title: "Status", render: (_: any, user: any) => statusTag(user) },
    { title: "Joined", dataIndex: "dateCreated", render: formatDate },
    {
      title: "",
      render: (_: any, user: any) =>
        tab === "tenants" ? (
          <LoginAsButton
            isAdmin={false}
            disabled={user.blocked}
            start={(readOnly) => loginAsTenantFromSaas(user.id, { readOnly })}
          />
        ) : (
          <LoginAsButton
            isAdmin
            disabled={user.blocked || !user.estate}
            start={(readOnly) => loginAsEstateAdmin(user.estate.id, { adminId: user.id, readOnly })}
          />
        ),
    },
  ];

  return (
    <>
      <div className="saasAdminPageHeader">
        <Typography.Title level={3}>Users</Typography.Title>
      </div>

      <Tabs
        activeKey={tab}
        onChange={(key) => setParams({ tab: key === "tenants" ? "tenants" : null })}
        items={[
          { key: "admins", label: "Estate admins" },
          { key: "tenants", label: "Tenants" },
        ]}
      />

      <div className="saasAdminToolbar">
        <Input.Search
          key={tab}
          placeholder="Name, email or phone"
          defaultValue={search}
          allowClear
          onSearch={(value) => setParams({ search: value.trim() || null })}
          style={{ maxWidth: 320 }}
        />
        {estateId && (
          <Tag closable onClose={() => setParams({ estateId: null })} style={{ alignSelf: "center" }}>
            One estate only
          </Tag>
        )}
      </div>

      {error && <Alert type="error" message={error} showIcon style={{ marginBottom: 16 }} />}

      <Table
        rowKey="id"
        loading={loading}
        dataSource={rows}
        columns={columns}
        scroll={{ x: true }}
        pagination={{
          current: page,
          pageSize: PAGE_SIZE,
          total,
          showSizeChanger: false,
          onChange: (next) => setParams({ page: String(next) }),
        }}
      />
    </>
  );
};

export default SaasUsers;
