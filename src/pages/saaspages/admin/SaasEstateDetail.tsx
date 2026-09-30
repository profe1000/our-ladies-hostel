import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Alert,
  Button,
  Card,
  Col,
  Descriptions,
  Input,
  message,
  Modal,
  Popconfirm,
  Row,
  Select,
  Skeleton,
  Space,
  Statistic,
  Table,
  Tag,
  Typography,
} from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import {
  blockSaasEstate,
  changeSaasEstatePlan,
  getSaasEstate,
  getSaasPlans,
  loginAsEstateAdmin,
  unblockSaasEstate,
} from "../../../apiservice/saas-ApiService";
import { getApiErrorMessage } from "../../../apiservice/public-ApiService";
import LoginAsButton from "./LoginAsButton";
import { formatDate, formatLimit, formatNaira } from "./saasAdminTheme";

const SaasEstateDetail = () => {
  const { id } = useParams();
  const [estate, setEstate] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [plans, setPlans] = useState<any[]>([]);
  const [blockOpen, setBlockOpen] = useState(false);
  const [blockReason, setBlockReason] = useState("");
  const [planOpen, setPlanOpen] = useState(false);
  const [newPlanId, setNewPlanId] = useState<number>();
  const [saving, setSaving] = useState(false);

  const load = useCallback(() => {
    getSaasEstate(id!)
      .then((result) => setEstate(result?.data))
      .catch((e) => setError(getApiErrorMessage(e)));
  }, [id]);

  useEffect(() => {
    load();
    getSaasPlans().then((result) => setPlans(result?.data || [])).catch(() => setPlans([]));
  }, [load]);

  const run = async (action: () => Promise<any>, after?: () => void) => {
    setSaving(true);
    try {
      const result = await action();
      message.success(result?.message || "Saved");
      after?.();
      load();
    } catch (e: any) {
      message.error(getApiErrorMessage(e));
    } finally {
      setSaving(false);
    }
  };

  if (error) return <Alert type="error" message={error} showIcon />;
  if (!estate) return <Skeleton active />;

  const overLimit =
    (estate.plan.maxBuildings != null && estate.usage.buildings > estate.plan.maxBuildings) ||
    (estate.plan.maxApartments != null && estate.usage.apartments > estate.plan.maxApartments);

  return (
    <>
      <Link to="/saas/estates">
        <Button type="link" icon={<ArrowLeftOutlined />} style={{ paddingLeft: 0 }}>
          Estates
        </Button>
      </Link>

      <div className="saasAdminPageHeader">
        <Space wrap>
          <Typography.Title level={3}>{estate.name}</Typography.Title>
          {estate.blocked ? <Tag color="red">Blocked</Tag> : <Tag color="green">Active</Tag>}
          <Tag>{estate.plan.title}</Tag>
        </Space>
        <Space wrap>
          <LoginAsButton
            isAdmin
            size="middle"
            label="Login as estate"
            disabled={estate.blocked || estate.admins.length === 0}
            start={(readOnly) => loginAsEstateAdmin(estate.id, { readOnly })}
          />
          <Button
            onClick={() => {
              setNewPlanId(estate.plan.id);
              setPlanOpen(true);
            }}
          >
            Change plan
          </Button>
          {estate.blocked ? (
            <Popconfirm
              title="Unblock this estate?"
              description="Its admins and tenants will be able to use the app again."
              onConfirm={() => run(() => unblockSaasEstate(estate.id))}
            >
              <Button loading={saving}>Unblock</Button>
            </Popconfirm>
          ) : (
            <Button danger onClick={() => setBlockOpen(true)}>
              Block
            </Button>
          )}
        </Space>
      </div>

      {estate.blocked && (
        <Alert
          type="error"
          showIcon
          style={{ marginBottom: 16 }}
          message={`Blocked on ${formatDate(estate.blockedAt)}`}
          description={estate.blockedReason || "No reason given"}
        />
      )}
      {overLimit && (
        <Alert
          type="warning"
          showIcon
          style={{ marginBottom: 16 }}
          message="Above plan limits"
          description="This estate has more buildings or apartments than its plan allows. It cannot add more until it is under the limits or on a bigger plan."
        />
      )}

      <Row gutter={[16, 16]}>
        {[
          { title: "Buildings", value: estate.usage.buildings, limit: estate.plan.maxBuildings },
          { title: "Apartments", value: estate.usage.apartments, limit: estate.plan.maxApartments },
          { title: "Tenants", value: estate.usage.tenants },
          { title: "Active occupants", value: estate.usage.activeOccupants },
        ].map((stat) => (
          <Col xs={12} md={6} key={stat.title}>
            <Card size="small">
              <Statistic
                title={stat.title}
                value={stat.value}
                suffix={stat.limit !== undefined ? `/ ${formatLimit(stat.limit)}` : undefined}
              />
            </Card>
          </Col>
        ))}
      </Row>

      <Card title="Details" size="small" style={{ marginTop: 16 }}>
        <Descriptions column={{ xs: 1, md: 2 }} size="small">
          <Descriptions.Item label="Estate ID">{estate.slug}</Descriptions.Item>
          <Descriptions.Item label="Public page">
            <a href={`/e/${estate.slug}`} target="_blank" rel="noreferrer">
              /e/{estate.slug}
            </a>
          </Descriptions.Item>
          <Descriptions.Item label="Email">{estate.email || "-"}</Descriptions.Item>
          <Descriptions.Item label="Phone">{estate.phoneNumber || "-"}</Descriptions.Item>
          <Descriptions.Item label="Plan">
            {estate.plan.title} ({formatNaira(estate.plan.monthlyPrice)}
            {estate.plan.monthlyPrice ? " / month" : ""})
          </Descriptions.Item>
          <Descriptions.Item label="Joined">{formatDate(estate.dateCreated)}</Descriptions.Item>
        </Descriptions>
      </Card>

      <Card
        title="Admins"
        size="small"
        style={{ marginTop: 16 }}
        extra={<Link to={`/saas/users?estateId=${estate.id}&tab=tenants`}>View tenants</Link>}
      >
        <Table
          rowKey="id"
          dataSource={estate.admins}
          pagination={false}
          size="small"
          scroll={{ x: true }}
          columns={[
            { title: "Name", dataIndex: "fullName" },
            { title: "Email", dataIndex: "email" },
            { title: "Role", dataIndex: "role" },
            {
              title: "Status",
              dataIndex: "blocked",
              render: (isBlocked: boolean) => (isBlocked ? <Tag color="red">Blocked</Tag> : <Tag color="green">Active</Tag>),
            },
            { title: "Added", dataIndex: "dateCreated", render: formatDate },
            {
              title: "",
              render: (_: any, admin: any) => (
                <LoginAsButton
                  isAdmin
                  disabled={estate.blocked || admin.blocked}
                  start={(readOnly) => loginAsEstateAdmin(estate.id, { adminId: admin.id, readOnly })}
                />
              ),
            },
          ]}
        />
      </Card>

      <Modal
        title={`Block ${estate.name}?`}
        open={blockOpen}
        okText="Block estate"
        okButtonProps={{ danger: true }}
        confirmLoading={saving}
        onCancel={() => setBlockOpen(false)}
        onOk={() =>
          run(
            () => blockSaasEstate(estate.id, blockReason.trim() || undefined),
            () => {
              setBlockOpen(false);
              setBlockReason("");
            }
          )
        }
      >
        <Typography.Paragraph>
          Its admins and tenants will be refused on their next request, and its public page will stop loading.
          Nothing is deleted; you can unblock it any time.
        </Typography.Paragraph>
        <Input.TextArea
          rows={3}
          placeholder="Reason (optional), e.g. Subscription unpaid"
          value={blockReason}
          onChange={(e) => setBlockReason(e.target.value)}
          maxLength={1000}
        />
      </Modal>

      <Modal
        title="Change plan"
        open={planOpen}
        okText="Change plan"
        confirmLoading={saving}
        okButtonProps={{ disabled: !newPlanId || newPlanId === estate.plan.id }}
        onCancel={() => setPlanOpen(false)}
        onOk={() => run(() => changeSaasEstatePlan(estate.id, newPlanId!), () => setPlanOpen(false))}
      >
        <Select
          style={{ width: "100%" }}
          value={newPlanId}
          onChange={setNewPlanId}
          options={plans.map((plan) => ({
            value: plan.id,
            label: `${plan.title} · ${formatLimit(plan.maxBuildings)} buildings, ${formatLimit(plan.maxApartments)} apartments · ${formatNaira(plan.monthlyPrice)}`,
          }))}
        />
        <Typography.Paragraph type="secondary" style={{ marginTop: 12, marginBottom: 0 }}>
          Moving to a smaller plan keeps existing buildings and apartments; the estate just cannot add more until it is
          under the new limits.
        </Typography.Paragraph>
      </Modal>
    </>
  );
};

export default SaasEstateDetail;
