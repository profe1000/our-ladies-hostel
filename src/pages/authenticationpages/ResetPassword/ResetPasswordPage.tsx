import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Alert, Button, Form, Input, Result } from "antd";
import { adminResetForgottenPassword } from "../../../apiservice/admin-AuthService";
import { authSetNewPassword } from "../../../apiservice/authService";
import { getApiErrorMessage } from "../../../apiservice/public-ApiService";
import AuthCard from "../../../components/AuthCard/AuthCard";
import { estatePath } from "../../../utils/estate";

/**
 * Opened from the reset link in the email (?email=...&token=...). Estate admins use /auth/reset-password,
 * tenants their estate's /e/:slug/reset-password
 */
const ResetPasswordPage = ({ isAdmin }: { isAdmin: boolean }) => {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") || "";
  const token = searchParams.get("token") || "";
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const signInPath = isAdmin ? "/auth" : estatePath("/login");
  const forgotPath = isAdmin ? "/auth/forgot-password" : estatePath("/forgot-password");

  const onFinish = async (values: { newPassword: string }) => {
    setError(null);
    setLoading(true);
    try {
      const body = { email, token, newPassword: values.newPassword };
      await (isAdmin ? adminResetForgottenPassword(body) : authSetNewPassword(body));
      setDone(true);
    } catch (e: any) {
      setError(getApiErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  const linkBroken = !email || !token;

  return (
    <AuthCard
      isAdmin={isAdmin}
      eyebrow={isAdmin ? "Estate admin" : "Tenant"}
      title={done ? "Password changed" : "Choose a new password"}
      subtitle={done || linkBroken ? undefined : <>For {email}</>}
      footer={
        <>
          <Link to={signInPath}>Back to sign in</Link>
        </>
      }
    >
      {done ? (
        <Result
          status="success"
          title="All set"
          subTitle="You have been signed out everywhere. Sign in with your new password."
          style={{ padding: "16px 0 24px" }}
          extra={
            <Link to={signInPath}>
              <Button type="primary" size="large">
                Sign in
              </Button>
            </Link>
          }
        />
      ) : linkBroken ? (
        <Result
          status="warning"
          title="This link is incomplete"
          subTitle="Open the link from your email again, or request a new one."
          style={{ padding: "16px 0 24px" }}
          extra={
            <Link to={forgotPath}>
              <Button type="primary" size="large">
                Request a new link
              </Button>
            </Link>
          }
        />
      ) : (
        <Form layout="vertical" requiredMark={false} onFinish={onFinish} disabled={loading} size="large">
          <Form.Item
            name="newPassword"
            label="New password"
            rules={[
              { required: true, message: "Choose a password" },
              { min: 8, message: "At least 8 characters" },
            ]}
          >
            <Input.Password autoComplete="new-password" />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            label="Confirm new password"
            dependencies={["newPassword"]}
            rules={[
              { required: true, message: "Confirm your password" },
              ({ getFieldValue }) => ({
                validator: (_, value) =>
                  !value || getFieldValue("newPassword") === value
                    ? Promise.resolve()
                    : Promise.reject(new Error("Passwords do not match")),
              }),
            ]}
          >
            <Input.Password autoComplete="new-password" />
          </Form.Item>
          {error && (
            <Alert
              type="error"
              showIcon
              style={{ marginBottom: 16 }}
              message={error}
              description={
                error.toLowerCase().includes("expired") ? <Link to={forgotPath}>Request a new link</Link> : undefined
              }
            />
          )}
          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              Save new password
            </Button>
          </Form.Item>
        </Form>
      )}
    </AuthCard>
  );
};

export default ResetPasswordPage;
