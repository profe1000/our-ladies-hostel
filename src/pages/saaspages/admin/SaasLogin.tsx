import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Button, Card, ConfigProvider, Form, Input, Typography } from "antd";
import { saasLogin, SAAS_AUTH_DATA_KEY, SAAS_TOKEN_KEY } from "../../../apiservice/saas-ApiService";
import { getApiErrorMessage } from "../../../apiservice/public-ApiService";
import { SAAS_NAME } from "../../../utils/estate";
import { storeJSON, storePlainString } from "../../../utils/localStorage";
import { saasAdminTheme } from "./saasAdminTheme";
import "./saasAdmin.css";

export const SaasLoginPage = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onFinish = async (values: { email: string; password: string }) => {
    setError(null);
    setSubmitting(true);
    try {
      const result = await saasLogin(values);
      storePlainString(SAAS_TOKEN_KEY, result?.data?.token || "");
      storeJSON(SAAS_AUTH_DATA_KEY, result?.data?.credentials);
      navigate("/saas", { replace: true });
    } catch (e: any) {
      setError(getApiErrorMessage(e, "Could not sign in"));
      setSubmitting(false);
    }
  };

  return (
    <ConfigProvider theme={saasAdminTheme}>
      <div className="saasAdminLogin">
        <Card className="saasAdminLoginCard">
          <Typography.Title level={3} style={{ marginTop: 0 }}>
            {SAAS_NAME} admin
          </Typography.Title>
          <Typography.Paragraph type="secondary">Sign in to manage estates, plans and messages.</Typography.Paragraph>
          <Form layout="vertical" requiredMark={false} onFinish={onFinish} disabled={submitting}>
            <Form.Item name="email" label="Email" rules={[{ required: true, type: "email", message: "Enter your email" }]}>
              <Input autoComplete="username" />
            </Form.Item>
            <Form.Item name="password" label="Password" rules={[{ required: true, message: "Enter your password" }]}>
              <Input.Password autoComplete="current-password" />
            </Form.Item>
            {error && <Alert type="error" message={error} showIcon style={{ marginBottom: 16 }} />}
            <Button type="primary" htmlType="submit" block size="large" loading={submitting}>
              Sign in
            </Button>
          </Form>
        </Card>
      </div>
    </ConfigProvider>
  );
};

export default SaasLoginPage;
