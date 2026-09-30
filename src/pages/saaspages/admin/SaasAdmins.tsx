import { useCallback, useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Alert, Button, Form, Input, message, Modal, Popconfirm, Table, Tag, Typography } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { addSaasAdmin, getSaasAdmins, setSaasAdminBlocked } from "../../../apiservice/saas-ApiService";
import { getApiErrorMessage } from "../../../apiservice/public-ApiService";
import { formatDate } from "./saasAdminTheme";

/** The people who run the SaaS */
const SaasAdmins = () => {
  const { me } = useOutletContext<{ me: any }>();
  const [form] = Form.useForm();
  const [admins, setAdmins] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    getSaasAdmins()
      .then((result) => setAdmins(result?.data || []))
      .catch((e) => setError(getApiErrorMessage(e)))
      .finally(() => setLoading(false));
  }, []);

  useEffect(load, [load]);

  const add = async () => {
    const values = await form.validateFields();
    setSaving(true);
    try {
      await addSaasAdmin(values);
      message.success("SaaS admin added");
      setAdding(false);
      form.resetFields();
      load();
    } catch (e: any) {
      message.error(getApiErrorMessage(e));
    } finally {
      setSaving(false);
    }
  };

  const setBlocked = async (admin: any, blocked: boolean) => {
    try {
      await setSaasAdminBlocked(admin.id, blocked);
      load();
    } catch (e: any) {
      message.error(getApiErrorMessage(e));
    }
  };

  return (
    <>
      <div className="saasAdminPageHeader">
        <Typography.Title level={3}>SaaS admins</Typography.Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setAdding(true)}>
          Add admin
        </Button>
      </div>

      {error && <Alert type="error" message={error} showIcon style={{ marginBottom: 16 }} />}

      <Table
        rowKey="id"
        loading={loading}
        dataSource={admins}
        pagination={false}
        scroll={{ x: true }}
        columns={[
          {
            title: "Name",
            render: (_: any, admin: any) => (
              <>
                {admin.fullName} {admin.id === me?.id && <Tag>You</Tag>}
              </>
            ),
          },
          { title: "Email", dataIndex: "email" },
          {
            title: "Status",
            dataIndex: "blocked",
            render: (blocked: boolean) => (blocked ? <Tag color="red">Blocked</Tag> : <Tag color="green">Active</Tag>),
          },
          { title: "Last sign in", dataIndex: "lastLoggedIn", render: formatDate },
          { title: "Added", dataIndex: "dateCreated", render: formatDate },
          {
            title: "",
            render: (_: any, admin: any) =>
              admin.id === me?.id ? null : admin.blocked ? (
                <Button size="small" onClick={() => setBlocked(admin, false)}>
                  Unblock
                </Button>
              ) : (
                <Popconfirm title={`Block ${admin.fullName}?`} description="They will be signed out and cannot sign in." onConfirm={() => setBlocked(admin, true)}>
                  <Button size="small" danger>
                    Block
                  </Button>
                </Popconfirm>
              ),
          },
        ]}
      />

      <Modal title="Add SaaS admin" open={adding} onOk={add} onCancel={() => setAdding(false)} okText="Add" confirmLoading={saving} destroyOnClose>
        <Typography.Paragraph type="secondary">
          SaaS admins can see every estate and user, block estates, change plans and log in as any account.
        </Typography.Paragraph>
        <Form form={form} layout="vertical" requiredMark={false} preserve={false}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Form.Item name="firstName" label="First name" rules={[{ required: true, message: "Required" }]}>
              <Input />
            </Form.Item>
            <Form.Item name="lastName" label="Last name" rules={[{ required: true, message: "Required" }]}>
              <Input />
            </Form.Item>
          </div>
          <Form.Item name="email" label="Email" rules={[{ required: true, type: "email", message: "Enter a valid email" }]}>
            <Input autoComplete="off" />
          </Form.Item>
          <Form.Item
            name="password"
            label="Temporary password"
            extra="Share it with them privately; they can change it after signing in."
            rules={[
              { required: true, message: "Required" },
              { min: 8, message: "At least 8 characters" },
            ]}
          >
            <Input.Password autoComplete="new-password" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default SaasAdmins;
