import { useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { ConfigProvider, theme } from "antd";
import { CloseOutlined, MenuOutlined } from "@ant-design/icons";
import { SAAS_NAME } from "../../utils/estate";
import "./saasPublic.css";

/** Header and footer shared by the landing, sign up and contact pages */
const SaasPublicLayout = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: { colorPrimary: "#b8952f", fontFamily: "Poppins, sans-serif", borderRadius: 8 },
      }}
    >
      <div className="saasPage myfont1">
        <header className="saasNav">
          <div className="saasContainer saasNavInner">
            <Link to="/" className="saasBrand myfont5" onClick={closeMenu}>
              {SAAS_NAME}
            </Link>

            <button
              type="button"
              className="saasNavToggle"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <CloseOutlined /> : <MenuOutlined />}
            </button>

            <nav className={`saasNavLinks ${menuOpen ? "saasNavLinksOpen" : ""}`}>
              <a href="/#features" onClick={closeMenu}>Features</a>
              <a href="/#pricing" onClick={closeMenu}>Pricing</a>
              <NavLink to="/contact" onClick={closeMenu}>Contact us</NavLink>
              <NavLink to="/auth" onClick={closeMenu}>Sign in</NavLink>
              <Link to="/signup" className="saasButton saasButtonPrimary saasNavCta" onClick={closeMenu}>
                Get started free
              </Link>
            </nav>
          </div>
        </header>

        <main>
          <Outlet />
        </main>

        <footer className="saasFooter">
          <div className="saasContainer saasFooterInner">
            <div>
              <div className="saasBrand myfont5">{SAAS_NAME}</div>
              <p className="saasMuted">Estate and hostel management, from listing to rent collection.</p>
            </div>
            <div className="saasFooterLinks">
              <a href="/#pricing">Pricing</a>
              <Link to="/signup">Sign up</Link>
              <Link to="/contact">Contact us</Link>
              <Link to="/auth">Sign in</Link>
            </div>
          </div>
          <div className="saasContainer saasFooterCopy saasMuted">
            © {new Date().getFullYear()} {SAAS_NAME}
          </div>
        </footer>
      </div>
    </ConfigProvider>
  );
};

export default SaasPublicLayout;
