import { useState } from "react";
import { Link } from "react-router-dom";
import { Alert, Button, Form, Input, Result } from "antd";
import { adminForgotPassword } from "../../../apiservice/admin-AuthService";
import { authResetPassword } from "../../../apiservice/authService";
import { getApiErrorMessage } from "../../../apiservice/public-ApiService";
import AuthCard from "../../../components/AuthCard/AuthCard";
import { estatePath } from "../../../utils/estate";

/**
 * Asks for an email and sends a reset link. Estate admins use /auth/forgot-password,
 * tenants their estate's /e/:slug/forgot-password
 */
const ForgotPasswordPage = ({ isAdmin }: { isAdmin: boolean }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sentMessage, setSentMessage] = useState<string | null>(null);
  const signInPath = isAdmin ? "/auth" : estatePath("/login");

  const onFinish = async (values: { email: string }) => {
    setError(null);
    setLoading(true);
    try {
      const result = await (isAdmin ? adminForgotPassword(values) : authResetPassword(values));
      setSentMessage(result?.message || "Check your email for a link to reset your password.");
    } catch (e: any) {
      setError(getApiErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard
      isAdmin={isAdmin}
      eyebrow={isAdmin ? "Estate admin" : "Tenant"}
      title="Forgot your password?"
      subtitle={sentMessage ? undefined : "Enter your email and we will send you a link to choose a new one."}
      footer={
        <>
          Remembered it? <Link to={signInPath}>Back to sign in</Link>
        </>
      }
    >
      {sentMessage ? (
        <Result
          status="success"
          title="Check your email"
          subTitle={sentMessage}
          style={{ padding: "16px 0 24px" }}
          extra={
            <Button onClick={() => setSentMessage(null)} size="large">
              Use a different email
            </Button>
          }
        />
      ) : (
        <Form layout="vertical" requiredMark={false} onFinish={onFinish} disabled={loading} size="large">
          <Form.Item name="email" label="Email" rules={[{ required: true, type: "email", message: "Enter your email" }]}>
            <Input autoComplete="username" placeholder="you@example.com" />
          </Form.Item>
          {error && <Alert type="error" message={error} showIcon style={{ marginBottom: 16 }} />}
          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              Send reset link
            </Button>
          </Form.Item>
        </Form>
      )}
    </AuthCard>
  );
};

export default ForgotPasswordPage;
