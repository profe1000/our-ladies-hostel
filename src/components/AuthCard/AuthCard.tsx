import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ConfigProvider, theme } from "antd";
import useEstateBranding from "../../hooks/useEstateBranding";
import { estatePath, SAAS_NAME } from "../../utils/estate";
import "./AuthCard.css";

type Props = {
  /** Estate admin pages show the SaaS name; tenant pages show their estate's logo or name */
  isAdmin: boolean;
  eyebrow: string;
  title: string;
  subtitle?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
};

/** Centred card shared by the sign in, forgot password and reset password pages */
const AuthCard = ({ isAdmin, eyebrow, title, subtitle, children, footer }: Props) => {
  const branding = useEstateBranding();

  const brand = isAdmin ? (
    <Link to="/" className="authCardBrandText myfont5">
      {SAAS_NAME}
    </Link>
  ) : branding?.logoUrl ? (
    <Link to={estatePath()}>
      <img className="authCardLogo" src={branding.logoUrl} alt={branding.name} />
    </Link>
  ) : (
    <Link to={estatePath()} className="authCardBrandText myfont5">
      {branding?.name || ""}
    </Link>
  );

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: { colorPrimary: "#b8952f", fontFamily: "Poppins, sans-serif", borderRadius: 10, controlHeightLG: 46 },
      }}
    >
      <div className="authCardPage myfont1">
        <div className="authCardGlow" aria-hidden="true"></div>
        <div className="authCardBrand">{brand}</div>
        <div className="authCard">
          <span className="authCardEyebrow">{eyebrow}</span>
          <h1 className="authCardTitle myfont5">{title}</h1>
          {subtitle && <p className="authCardSubtitle">{subtitle}</p>}
          {children}
        </div>
        {footer && <div className="authCardFooter">{footer}</div>}
      </div>
    </ConfigProvider>
  );
};

export default AuthCard;
