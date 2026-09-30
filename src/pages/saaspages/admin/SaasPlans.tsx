import { useCallback, useEffect, useState } from "react";
import { Alert, Button, Checkbox, Form, Input, InputNumber, message, Modal, Popconfirm, Space, Table, Tag, Typography } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { addSaasPlan, deleteSaasPlan, getSaasPlans, updateSaasPlan } from "../../../apiservice/saas-ApiService";
import { getApiErrorMessage } from "../../../apiservice/public-ApiService";
import { formatLimit, formatNaira } from "./saasAdminTheme";

/** Pricing plans: prices and building/apartment limits. Empty limits mean unlimited */
const SaasPlans = () => {
  const [form] = Form.useForm();
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    getSaasPlans()
      .then((result) => setPlans(result?.data || []))
      .catch((e) => setError(getApiErrorMessage(e)))
      .finally(() => setLoading(false));
  }, []);

  useEffect(load, [load]);

  const open = (plan?: any) => {
    setEditing(plan || {});
    form.setFieldsValue(
      plan || { isPublic: true, isDefault: false, sequence: (plans[plans.length - 1]?.sequence ?? 0) + 1 }
    );
  };

  const save = async () => {
    const values = await form.validateFields();
    const body = {
      ...values,
      // An emptied number field comes back as null, which the server reads as unlimited / priced per customer
      monthlyPrice: values.monthlyPrice ?? null,
      maxBuildings: values.maxBuildings ?? null,
      maxApartments: values.maxApartments ?? null,
    };
    setSaving(true);
    try {
      if (editing?.id) await updateSaasPlan(editing.id, body);
      else await addSaasPlan(body);
      message.success(editing?.id ? "Plan updated" : "Plan added");
      setEditing(null);
      load();
    } catch (e: any) {
      message.error(getApiErrorMessage(e));
    } finally {
      setSaving(false);
    }
  };

  const remove = async (plan: any) => {
    try {
      await deleteSaasPlan(plan.id);
      message.success("Plan deleted");
      load();
    } catch (e: any) {
      message.error(getApiErrorMessage(e));
    }
  };

  return (
    <>
      <div className="saasAdminPageHeader">
        <Typography.Title level={3}>Plans</Typography.Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => open()}>
          Add plan
        </Button>
      </div>

      {error && <Alert type="error" message={error} showIcon style={{ marginBottom: 16 }} />}

      <Table
        rowKey="id"
        loading={loading}
        dataSource={plans}
        pagination={false}
        scroll={{ x: true }}
        columns={[
          {
            title: "Plan",
            render: (_: any, plan: any) => (
              <Space wrap>
                {plan.title}
                {plan.isDefault && <Tag color="gold">Sign up default</Tag>}
                {!plan.isPublic && <Tag>Hidden from pricing</Tag>}
              </Space>
            ),
          },
          { title: "Price / month", dataIndex: "monthlyPrice", render: formatNaira },
          { title: "Buildings", dataIndex: "maxBuildings", render: formatLimit },
          { title: "Apartments", dataIndex: "maxApartments", render: formatLimit },
          { title: "Estates", dataIndex: "estates" },
          {
            title: "",
            render: (_: any, plan: any) => (
              <Space>
                <Button size="small" onClick={() => open(plan)}>
                  Edit
                </Button>
                <Popconfirm title={`Delete ${plan.title}?`} onConfirm={() => remove(plan)} disabled={plan.estates > 0 || plan.isDefault}>
                  <Button size="small" danger disabled={plan.estates > 0 || plan.isDefault}>
                    Delete
                  </Button>
                </Popconfirm>
              </Space>
            ),
          },
        ]}
      />
      <Typography.Paragraph type="secondary" style={{ marginTop: 12, fontSize: 12 }}>
        A plan in use or the sign up default cannot be deleted. Price changes apply to every estate on the plan.
      </Typography.Paragraph>

      <Modal
        title={editing?.id ? `Edit ${editing.title}` : "Add plan"}
        open={!!editing}
        onOk={save}
        onCancel={() => setEditing(null)}
        okText="Save"
        confirmLoading={saving}
        destroyOnClose
      >
        <Form form={form} layout="vertical" requiredMark={false} preserve={false}>
          <Form.Item name="title" label="Title" rules={[{ required: true, message: "Required" }]}>
            <Input maxLength={256} />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input maxLength={1000} />
          </Form.Item>
          <Form.Item name="monthlyPrice" label="Monthly price (₦)" extra="Leave empty for a plan priced per customer">
            <InputNumber min={0} style={{ width: "100%" }} formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")} />
          </Form.Item>
          <Space style={{ width: "100%" }} styles={{ item: { flex: 1 } }}>
            <Form.Item name="maxBuildings" label="Max buildings" extra="Empty = unlimited">
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item name="maxApartments" label="Max apartments" extra="Empty = unlimited">
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>
          </Space>
          <Form.Item name="sequence" label="Order on the pricing page">
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="isPublic" valuePropName="checked" style={{ marginBottom: 8 }}>
            <Checkbox>Show on the pricing page</Checkbox>
          </Form.Item>
          <Form.Item name="isDefault" valuePropName="checked" extra="New estates start on this plan. Must be shown on the pricing page">
            <Checkbox>Sign up default</Checkbox>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default SaasPlans;
