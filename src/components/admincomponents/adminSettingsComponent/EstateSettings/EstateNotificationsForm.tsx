import { useEffect, useState } from "react";
import { Button, Form, message, Select } from "antd";
import { adminSaveNotificationSettingsApi } from "../../../../apiservice/admin-General-ApiService";
import { getApiErrorMessage } from "../../../../apiservice/public-ApiService";

const fields = [
  { key: "paymentEmails", label: "Payments", hint: "Card payments received and bank transfer receipts to confirm" },
  { key: "rentReminderEmails", label: "Rent reminders", hint: "Tenants whose rent is due soon or overdue" },
  { key: "requestEmails", label: "Apartment requests", hint: "New tenant applications to review" },
] as const;

const toList = (value?: string | null) => (value || "").split(",").map((e) => e.trim()).filter(Boolean);
const isEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

/** Who is emailed about payments, rent reminders and apartment requests */
const EstateNotificationsForm = ({ settings, onSaved }: { settings: any; onSaved: (settings: any) => void }) => {
  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    form.setFieldsValue({
      paymentEmails: toList(settings?.paymentEmails),
      rentReminderEmails: toList(settings?.rentReminderEmails),
      requestEmails: toList(settings?.requestEmails),
    });
  }, [settings, form]);

  const save = async (values: Record<string, string[]>) => {
    setSaving(true);
    try {
      const result = await adminSaveNotificationSettingsApi({
        paymentEmails: (values.paymentEmails || []).join(","),
        rentReminderEmails: (values.rentReminderEmails || []).join(","),
        requestEmails: (values.requestEmails || []).join(","),
      });
      onSaved(result?.data);
      message.success("Notification emails saved");
    } catch (e: any) {
      message.error(getApiErrorMessage(e));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Form form={form} layout="vertical" onFinish={save} requiredMark={false}>
      {fields.map(({ key, label, hint }) => {
        const fallback = settings?.[`${key}Fallback`];
        return (
          <Form.Item
            key={key}
            name={key}
            label={label}
            extra={
              <>
                {hint}. {fallback ? `Leave empty to use ${fallback}.` : "Leave empty to send none."}
              </>
            }
            rules={[
              {
                validator: (_, value: string[] = []) => {
                  const bad = value.find((email) => !isEmail(email));
                  return bad ? Promise.reject(new Error(`"${bad}" is not a valid email`)) : Promise.resolve();
                },
              },
            ]}
          >
            <Select
              mode="tags"
              tokenSeparators={[",", " ", ";"]}
              open={false}
              suffixIcon={null}
              placeholder={fallback ? `Empty: sent to ${fallback}` : "Type an email and press Enter"}
            />
          </Form.Item>
        );
      })}
      <Button type="primary" htmlType="submit" loading={saving}>
        Save notification emails
      </Button>
    </Form>
  );
};

export default EstateNotificationsForm;
