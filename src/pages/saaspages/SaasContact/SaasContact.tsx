import { useState } from "react";
import { Alert, Button, Form, Input, Result } from "antd";
import { Link } from "react-router-dom";
import { getApiErrorMessage, IContactBody, sendContactMessage } from "../../../apiservice/public-ApiService";

export const SaasContactPage = () => {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onFinish = async (values: IContactBody) => {
    setError(null);
    setSubmitting(true);
    try {
      await sendContactMessage(values);
      setSent(true);
      form.resetFields();
    } catch (e: any) {
      setError(getApiErrorMessage(e));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="saasFormPage">
      <div className="saasContainer saasFormGrid">
        <div>
          <span className="saasEyebrow">Contact us</span>
          <h1 className="saasSectionTitle myfont5">Let's talk about your estate</h1>
          <p className="saasMuted">
            Questions about plans, a Custom plan for a large estate, help moving your existing tenants in, or anything
            else. Send us a message and we will reply by email.
          </p>
          <ul className="saasPoints">
            <li>Custom pricing for large estates</li>
            <li>Upgrading your plan</li>
            <li>A walkthrough of the app</li>
          </ul>
        </div>

        <div className="saasFormCard">
          {sent ? (
            <Result
              status="success"
              title="Message sent"
              subTitle="Thank you. We will get back to you shortly."
              extra={[
                <Button key="again" onClick={() => setSent(false)}>
                  Send another
                </Button>,
                <Link key="home" to="/">
                  <Button type="primary">Back to home</Button>
                </Link>,
              ]}
            />
          ) : (
            <Form form={form} layout="vertical" requiredMark={false} onFinish={onFinish} disabled={submitting}>
              <Form.Item name="name" label="Your name" rules={[{ required: true, message: "Enter your name" }]}>
                <Input maxLength={256} />
              </Form.Item>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <Form.Item
                  name="email"
                  label="Email"
                  rules={[{ required: true, type: "email", message: "Enter a valid email" }]}
                >
                  <Input maxLength={256} />
                </Form.Item>
                <Form.Item name="phoneNumber" label="Phone (optional)">
                  <Input maxLength={64} />
                </Form.Item>
              </div>
              <Form.Item name="estateName" label="Estate or company (optional)">
                <Input maxLength={256} />
              </Form.Item>
              <Form.Item
                name="message"
                label="Message"
                rules={[
                  { required: true, message: "Write your message" },
                  { min: 10, message: "At least 10 characters" },
                ]}
              >
                <Input.TextArea rows={6} maxLength={5000} showCount />
              </Form.Item>

              {/* Hidden from people; bots that fill it in are ignored by the server */}
              <div className="saasHoneypot" aria-hidden="true">
                <Form.Item name="website" label="Website">
                  <Input tabIndex={-1} autoComplete="off" />
                </Form.Item>
              </div>

              {error && <Alert type="error" message={error} showIcon style={{ marginBottom: 16 }} />}

              <Button type="primary" htmlType="submit" size="large" block loading={submitting}>
                Send message
              </Button>
            </Form>
          )}
        </div>
      </div>
    </section>
  );
};

export default SaasContactPage;
