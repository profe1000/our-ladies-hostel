import { useState } from "react";
import { CheckOutlined, CopyOutlined, ShareAltOutlined, WhatsAppOutlined } from "@ant-design/icons";
import useEstateBranding from "../../../hooks/useEstateBranding";
import "./TenantLinksPanel.css";

/** The web app's address: this site in a browser, REACT_APP_PUBLIC_URL inside the mobile app */
const appOrigin = () => {
  const origin = window.location.origin;
  if (origin.startsWith("http://") || origin.startsWith("https://")) return origin;
  return (process.env.REACT_APP_PUBLIC_URL || "").replace(/\/$/, "");
};

/** Copies text, also where the Clipboard API is unavailable (plain http) */
const copyText = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const input = document.createElement("textarea");
    input.value = text;
    document.body.appendChild(input);
    input.select();
    document.execCommand("copy");
    document.body.removeChild(input);
  }
};

/**
 * The estate's links for tenants, ready to copy or send on WhatsApp:
 * its public page (browse units and apply) and the tenant sign in page
 */
const TenantLinksPanel = () => {
  const branding = useEstateBranding(true);
  const [copied, setCopied] = useState<string | null>(null);

  if (!branding?.slug) return null;

  const base = `${appOrigin()}/e/${branding.slug}`;
  const links = [
    {
      key: "page",
      title: "Estate page",
      hint: "New tenants browse available units and apply",
      url: base,
      message: `Browse available units at ${branding.name} and apply online: ${base}`,
    },
    {
      key: "login",
      title: "Tenant sign in",
      hint: "Tenants see their rent, payments and agreement",
      url: `${base}/login`,
      message: `Sign in to your ${branding.name} tenant account: ${base}/login`,
    },
  ];

  const copy = async (key: string, text: string) => {
    await copyText(text);
    setCopied(key);
    setTimeout(() => setCopied((current) => (current === key ? null : current)), 2000);
  };

  return (
    <div className="adminPanel tenantLinksPanel">
      <div className="adminPanelHeader">
        <h3 className="adminPanelTitle myfont3">
          <span className="adminPanelIcon">
            <ShareAltOutlined />
          </span>
          Share with tenants
        </h3>
      </div>

      {links.map((link) => (
        <div className="tenantLinkRow" key={link.key}>
          <div className="tenantLinkText">
            <div className="tenantLinkTitle myfont3">{link.title}</div>
            <div className="tenantLinkHint myfont1">{link.hint}</div>
            <a className="tenantLinkUrl myfont1" href={link.url} target="_blank" rel="noreferrer">
              {link.url}
            </a>
          </div>
          <div className="tenantLinkActions">
            <button type="button" className="tenantLinkButton myfont1" onClick={() => copy(link.key, link.url)}>
              {copied === link.key ? <CheckOutlined /> : <CopyOutlined />}
              {copied === link.key ? "Copied" : "Copy"}
            </button>
            <a
              className="tenantLinkButton tenantLinkWhatsApp myfont1"
              href={`https://wa.me/?text=${encodeURIComponent(link.message)}`}
              target="_blank"
              rel="noreferrer"
            >
              <WhatsAppOutlined /> WhatsApp
            </a>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TenantLinksPanel;
