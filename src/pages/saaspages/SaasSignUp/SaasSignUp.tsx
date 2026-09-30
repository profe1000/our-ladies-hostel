import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Alert, Button, Form, Input } from "antd";
import { CheckCircleFilled, CloseCircleFilled, LoadingOutlined } from "@ant-design/icons";
import {
  checkEstateSlug,
  getApiErrorMessage,
  IRegisterEstateBody,
  registerEstate,
} from "../../../apiservice/public-ApiService";
import { adminAuthSignIn } from "../../../apiservice/admin-AuthService";
import { ADMIN_AUTH_DATA_KEY, ADMIN_TOKEN_KEY } from "../../../hooks/useAuth";
import { useAppDispatch } from "../../../Redux/reduxCustomHook";
import { clearLoginAs, SAAS_NAME } from "../../../utils/estate";
import { storeJSON, storePlainString } from "../../../utils/localStorage";

type SlugState = { status: "idle" | "checking" | "ok" | "taken"; message?: string };

/** "Green Court Estate" => "green-court-estate", matching how the server makes slugs */
const toSlug = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64);

export const SaasSignUpPage = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [slugState, setSlugState] = useState<SlugState>({ status: "idle" });
  // Once the user edits the estate ID themselves, stop filling it from the name
  const slugTouched = useRef(false);
  const slugTimer = useRef<ReturnType<typeof setTimeout>>();

  const slug: string = Form.useWatch("slug", form) || "";

  // Check the estate ID shortly after the user stops typing
  useEffect(() => {
    if (slugTimer.current) clearTimeout(slugTimer.current);
    if (slug.length < 3) {
      setSlugState({ status: "idle" });
      return;
    }

    setSlugState({ status: "checking" });
    slugTimer.current = setTimeout(async () => {
      try {
        const result = await checkEstateSlug(slug);
        // Ignore answers for an ID the user has since changed
        if (result.slug !== form.getFieldValue("slug")) return;
        setSlugState(result.available ? { status: "ok" } : { status: "taken", message: result.message });
      } catch {
        setSlugState({ status: "idle" });
      }
    }, 450);
  }, [slug, form]);

  const onValuesChange = (changed: any) => {
    if ("name" in changed && !slugTouched.current) {
      form.setFieldsValue({ slug: toSlug(changed.name || "") });
    }
    if ("slug" in changed) {
      slugTouched.current = true;
      const cleaned = toSlug(changed.slug || "");
      if (cleaned !== changed.slug && !changed.slug.endsWith("-")) {
        form.setFieldsValue({ slug: cleaned });
      }
    }
  };

  const onFinish = async (values: IRegisterEstateBody & { confirmPassword: string }) => {
    setError(null);
    setSubmitting(true);
    try {
      const { confirmPassword, ...body } = values;
      await registerEstate({ ...body, slug: toSlug(body.slug || body.name) });

      // Sign the new admin straight in, as the normal sign in page does
      clearLoginAs(true);
      const signIn = await adminAuthSignIn({ email: values.adminEmail, password: values.password });
      storePlainString(ADMIN_TOKEN_KEY, signIn?.data?.token || "");
      storeJSON(ADMIN_AUTH_DATA_KEY, signIn);
      dispatch({ type: "ADMIN_AUTH_ADD_DATA", payload: signIn });
      navigate("/admin", { replace: true });
    } catch (e: any) {
      setError(getApiErrorMessage(e, "We could not create your estate. Please try again"));
      setSubmitting(false);
    }
  };

  const slugSuffix =
    slugState.status === "checking" ? (
      <LoadingOutlined />
    ) : slugState.status === "ok" ? (
      <CheckCircleFilled style={{ color: "#52c41a" }} />
    ) : slugState.status === "taken" ? (
      <CloseCircleFilled style={{ color: "#ff7875" }} />
    ) : (
      <span />
    );

  return (
    <section className="saasFormPage">
      <div className="saasContainer saasFormGrid">
        <div>
          <span className="saasEyebrow">Sign up</span>
          <h1 className="saasSectionTitle myfont5">Create your estate on {SAAS_NAME}</h1>
          <p className="saasMuted">
            You start on the Free plan: 1 building and 10 apartments, with every feature. Upgrade any time as you grow.
          </p>
          <ul className="saasPoints">
            <li>Your own page where tenants browse units and apply</li>
            <li>Rent by card or bank transfer, with receipts</li>
            <li>Tenancy agreements generated for you</li>
            <li>Invite your team as admins</li>
          </ul>
          <p className="saasMuted" style={{ marginTop: 24 }}>
            Already have an estate? <Link to="/auth">Sign in</Link>
          </p>
        </div>

        <div className="saasFormCard">
          <Form
            form={form}
            layout="vertical"
            requiredMark={false}
            onValuesChange={onValuesChange}
            onFinish={onFinish}
            disabled={submitting}
          >
            <h2 className="myfont3">Your estate</h2>
            <Form.Item name="name" label="Estate name" rules={[{ required: true, message: "Enter your estate's name" }]}>
              <Input placeholder="e.g. Green Court Estate" maxLength={200} />
            </Form.Item>
            <Form.Item
              name="slug"
              label="Estate ID"
              extra={
                slugState.status === "taken"
                  ? slugState.message
                  : `Tenants will find you at ${window.location.host}/e/${slug || "your-estate"}`
              }
              validateStatus={slugState.status === "taken" ? "error" : undefined}
              rules={[
                { required: true, message: "Choose an estate ID" },
                { min: 3, message: "At least 3 letters or numbers" },
              ]}
            >
              <Input placeholder="green-court" suffix={slugSuffix} maxLength={64} />
            </Form.Item>
            <Form.Item
              name="email"
              label="Estate email"
              rules={[{ required: true, type: "email", message: "Enter a valid email" }]}
            >
              <Input placeholder="office@greencourt.com" />
            </Form.Item>
            <Form.Item name="phoneNumber" label="Phone number (optional)">
              <Input placeholder="0801 234 5678" />
            </Form.Item>

            <h2 className="myfont3">Your admin account</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Form.Item name="firstName" label="First name" rules={[{ required: true, message: "Required" }]}>
                <Input />
              </Form.Item>
              <Form.Item name="lastName" label="Last name" rules={[{ required: true, message: "Required" }]}>
                <Input />
              </Form.Item>
            </div>
            <Form.Item
              name="adminEmail"
              label="Your email (for signing in)"
              rules={[{ required: true, type: "email", message: "Enter a valid email" }]}
            >
              <Input autoComplete="username" />
            </Form.Item>
            <Form.Item
              name="password"
              label="Password"
              rules={[
                { required: true, message: "Choose a password" },
                { min: 8, message: "At least 8 characters" },
              ]}
            >
              <Input.Password autoComplete="new-password" />
            </Form.Item>
            <Form.Item
              name="confirmPassword"
              label="Confirm password"
              dependencies={["password"]}
              rules={[
                { required: true, message: "Confirm your password" },
                ({ getFieldValue }) => ({
                  validator: (_, value) =>
                    !value || getFieldValue("password") === value
                      ? Promise.resolve()
                      : Promise.reject(new Error("Passwords do not match")),
                }),
              ]}
            >
              <Input.Password autoComplete="new-password" />
            </Form.Item>

            {error && <Alert type="error" message={error} showIcon style={{ marginBottom: 16 }} />}

            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              loading={submitting}
              disabled={slugState.status === "taken"}
            >
              Create estate
            </Button>
            <p className="saasMuted" style={{ fontSize: 12, marginTop: 12, marginBottom: 0 }}>
              One admin email can own one estate. To manage more estates, <Link to="/contact">contact us</Link>.
            </p>
          </Form>
        </div>
      </div>
    </section>
  );
};

export default SaasSignUpPage;
