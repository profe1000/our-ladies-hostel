import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Alert, Button, Form, Input } from "antd";
import { authSignIn } from "../../../apiservice/authService";
import { getApiErrorMessage } from "../../../apiservice/public-ApiService";
import AuthCard from "../../../components/AuthCard/AuthCard";
import useEstateBranding from "../../../hooks/useEstateBranding";
import { USER_AUTH_DATA_KEY, USER_TOKEN_KEY } from "../../../hooks/useAuth";
import { useAppDispatch } from "../../../Redux/reduxCustomHook";
import { clearLoginAs, estatePath } from "../../../utils/estate";
import { storeJSON, storePlainString } from "../../../utils/localStorage";

/**
 * Tenant sign in for one estate, at /e/:slug/login. Tenant accounts belong to an estate,
 * so the estate in the URL (sent as X-Estate) decides which accounts are checked
 */
const TenantSignIn = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const branding = useEstateBranding();

  const onFinish = async (values: { email: string; password: string }) => {
    setError(null);
    setLoading(true);
    // A real sign in must use this device's own uuid, not one left by a "login as" session
    clearLoginAs(false);
    try {
      const result = await authSignIn(values);
      storePlainString(USER_TOKEN_KEY, result?.data?.token || "");
      storeJSON(USER_AUTH_DATA_KEY, result);
      dispatch({ type: "AUTH_ADD_DATA", payload: result });
      navigate("/users", { replace: true });
    } catch (e: any) {
      setError(getApiErrorMessage(e, "Could not sign in"));
      setLoading(false);
    }
  };

  return (
    <AuthCard
      isAdmin={false}
      eyebrow="Tenant"
      title="Welcome home"
      subtitle={
        branding?.name
          ? `Sign in to your ${branding.name} account to see your rent, payments and agreement.`
          : "Sign in to see your rent, payments and agreement."
      }
      footer={
        <>
          Your login details were emailed to you after your first payment.
          <br />
          Not a tenant yet? <Link to={estatePath()}>Browse available units</Link>
        </>
      }
    >
      <Form layout="vertical" requiredMark={false} onFinish={onFinish} disabled={loading} size="large">
        <Form.Item name="email" label="Email" rules={[{ required: true, type: "email", message: "Enter your email" }]}>
          <Input autoComplete="username" placeholder="you@example.com" />
        </Form.Item>
        <Form.Item name="password" label="Password" rules={[{ required: true, message: "Enter your password" }]}>
          <Input.Password autoComplete="current-password" />
        </Form.Item>
        <div className="authCardRow">
          <Link to={estatePath("/forgot-password")}>Forgot password?</Link>
        </div>
        {error && <Alert type="error" message={error} showIcon style={{ marginBottom: 16 }} />}
        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>
            Sign in
          </Button>
        </Form.Item>
      </Form>
    </AuthCard>
  );
};

export default TenantSignIn;
