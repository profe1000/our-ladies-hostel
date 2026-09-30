import { useEffect, useState } from "react";
import { Alert, Button, Form, Input, message, Popconfirm, Switch, Tag, Typography } from "antd";
import { adminGetSettingsApi, adminSavePaystackSettingsApi } from "../../../../apiservice/admin-General-ApiService";
import { getApiErrorMessage } from "../../../../apiservice/public-ApiService";

// Paystack sends successful payments here; each estate's Paystack account must point to it
const WEBHOOK_URL = `${(process.env.REACT_APP_API_URL || "").replace(/\/$/, "")}/api/v1/tenant/payments/paystack/verify`;

/** Turns rent collection through Paystack on or off, with the estate's own Paystack keys */
const EstatePaystackForm = ({ settings, onSaved }: { settings: any; onSaved: (settings: any) => void }) => {
  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false);
  const enabled: boolean = Form.useWatch("enabled", form) ?? false;

  useEffect(() => {
    form.setFieldsValue({ enabled: !!settings?.paystackEnabled, publicKey: settings?.paystackPublicKey || "", secretKey: "" });
  }, [settings, form]);

  const save = async (body: { enabled: boolean; publicKey?: string; secretKey?: string; removeKeys?: boolean }) => {
    setSaving(true);
    try {
      const result = await adminSavePaystackSettingsApi(body);
      onSaved(result?.data);
      message.success("Paystack settings saved");
    } catch (e: any) {
      message.error(getApiErrorMessage(e));
      // Some warnings come after the settings were saved, so show what is stored now
      adminGetSettingsApi().then((result) => onSaved(result?.data)).catch(() => undefined);
    } finally {
      setSaving(false);
    }
  };

  const hasOwnKeys = !!settings?.paystackPublicKey || !!settings?.paystackSecretKeyMasked;

  return (
    <Form form={form} layout="vertical" requiredMark={false} onFinish={(values) => save(values)}>
      <Form.Item name="enabled" valuePropName="checked" style={{ marginBottom: 8 }}>
        <Switch checkedChildren="On" unCheckedChildren="Off" />
      </Form.Item>
      <Typography.Paragraph type="secondary" style={{ marginTop: -4 }}>
        {enabled
          ? "Tenants can pay rent by card, bank or USSD through Paystack, and payments are confirmed automatically. Bank transfer stays available."
          : "Tenants pay by bank transfer and upload their receipt; you confirm each payment."}
      </Typography.Paragraph>

      {settings && (
        <div style={{ marginBottom: 16 }}>
          {settings.paystackActive ? (
            <Tag color="green">Collecting through Paystack</Tag>
          ) : (
            <Tag>Bank transfer only</Tag>
          )}
          {settings.paystackTestMode && <Tag color="orange">Test keys: no real money is taken</Tag>}
        </div>
      )}

      {settings?.paystackUsesAppKeys && !hasOwnKeys && (
        <Alert
          type="info"
          showIcon
          style={{ marginBottom: 16 }}
          message="Using the Paystack account set up with the app"
          description="Add your own keys below to collect into a different Paystack account."
        />
      )}

      <Form.Item name="publicKey" label="Public key" extra="Paystack dashboard › Settings › API Keys & Webhooks">
        <Input placeholder="pk_live_..." autoComplete="off" />
      </Form.Item>
      <Form.Item
        name="secretKey"
        label="Secret key"
        extra={
          settings?.paystackSecretKeyMasked
            ? `Saved: ${settings.paystackSecretKeyMasked}. Leave empty to keep it.`
            : "Stored encrypted and never shown again."
        }
      >
        <Input.Password placeholder="sk_live_..." autoComplete="new-password" />
      </Form.Item>

      <Alert
        type="warning"
        showIcon
        style={{ marginBottom: 16 }}
        message="Set your Paystack webhook URL"
        description={
          <>
            In Paystack › Settings › API Keys & Webhooks, set the webhook URL to{" "}
            <Typography.Text copyable code>
              {WEBHOOK_URL}
            </Typography.Text>{" "}
            so payments are confirmed here automatically.
          </>
        }
      />

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <Button type="primary" htmlType="submit" loading={saving}>
          Save Paystack settings
        </Button>
        {hasOwnKeys && (
          <Popconfirm
            title="Remove your Paystack keys?"
            description="Paystack will be turned off until keys are added again."
            onConfirm={() => save({ enabled: false, removeKeys: true })}
          >
            <Button danger type="text">
              Remove keys
            </Button>
          </Popconfirm>
        )}
      </div>
    </Form>
  );
};

export default EstatePaystackForm;
