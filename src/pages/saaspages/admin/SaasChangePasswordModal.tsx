import { useState } from "react";
import { Form, Input, message, Modal } from "antd";
import { saasChangePassword } from "../../../apiservice/saas-ApiService";
import { getApiErrorMessage } from "../../../apiservice/public-ApiService";

const SaasChangePasswordModal = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false);

  const save = async () => {
    const values = await form.validateFields();
    setSaving(true);
    try {
      await saasChangePassword({ oldPassword: values.oldPassword, newPassword: values.newPassword });
      message.success("Password changed");
      form.resetFields();
      onClose();
    } catch (e: any) {
      message.error(getApiErrorMessage(e));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal title="Change password" open={open} onOk={save} onCancel={onClose} okText="Change" confirmLoading={saving} destroyOnClose>
      <Form form={form} layout="vertical" requiredMark={false}>
        <Form.Item name="oldPassword" label="Current password" rules={[{ required: true, message: "Required" }]}>
          <Input.Password autoComplete="current-password" />
        </Form.Item>
        <Form.Item
          name="newPassword"
          label="New password"
          rules={[
            { required: true, message: "Required" },
            { min: 8, message: "At least 8 characters" },
          ]}
        >
          <Input.Password autoComplete="new-password" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default SaasChangePasswordModal;
