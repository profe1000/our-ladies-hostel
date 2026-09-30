import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Alert, Button, Form, Input } from "antd";
import { adminAuthSignIn } from "../../../apiservice/admin-AuthService";
import { IAdminAuthType } from "../../../apiservice/admin-AuthService.type";
import { getApiErrorMessage } from "../../../apiservice/public-ApiService";
import AuthCard from "../../../components/AuthCard/AuthCard";
import { ADMIN_AUTH_DATA_KEY, ADMIN_TOKEN_KEY } from "../../../hooks/useAuth";
import { useAppDispatch } from "../../../Redux/reduxCustomHook";
import { isSuperAdminRole } from "../../../utils/admin.utils";
import { clearLoginAs, ESTATE_SLUG_KEY, estatePath } from "../../../utils/estate";
import { getString, storeJSON, storePlainString } from "../../../utils/localStorage";

/** Estate admin sign in. Tenants sign in on their estate's page (/e/:slug/login) */
const AuthSignIn = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const onFinish = async (values: { email: string; password: string }) => {
    setError(null);
    setLoading(true);
    // A real sign in must use this device's own uuid, not one left by a "login as" session
    clearLoginAs(true);
    try {
      const signinResult: IAdminAuthType = await adminAuthSignIn(values);
      storePlainString(ADMIN_TOKEN_KEY, signinResult?.data?.token || "");
      storeJSON(ADMIN_AUTH_DATA_KEY, signinResult);
      dispatch({ type: "ADMIN_AUTH_ADD_DATA", payload: signinResult });
      navigate(isSuperAdminRole(signinResult.data?.credentials?.adminRole) ? "/admin" : "/admin/Buildings");
    } catch (e: any) {
      setError(getApiErrorMessage(e, "Could not sign in"));
      setLoading(false);
    }
  };

  return (
    <AuthCard
      isAdmin
      eyebrow="Estate admin"
      title="Welcome back"
      subtitle="Sign in to manage your buildings, tenants and payments."
      footer={
        <>
          Are you a tenant?{" "}
          {getString(ESTATE_SLUG_KEY) ? (
            <Link to={estatePath("/login")}>Sign in as a tenant</Link>
          ) : (
            "Sign in from your estate's page, using the link in your welcome email."
          )}
          <br />
          New here? <Link to="/signup">Create your estate</Link>
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
          <Link to="/auth/forgot-password">Forgot password?</Link>
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

export default AuthSignIn;
