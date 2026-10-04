import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Skeleton } from "antd";
import {
  ApartmentOutlined,
  BellOutlined,
  CreditCardOutlined,
  FileProtectOutlined,
  FormOutlined,
  LineChartOutlined,
} from "@ant-design/icons";
import { getPublicPlans, IPlan } from "../../../apiservice/public-ApiService";
import { SAAS_NAME } from "../../../utils/estate";

const features = [
  {
    icon: <ApartmentOutlined />,
    title: "Buildings and apartments",
    text: "Add your buildings, create units in one go and set rent, service charge and shared-occupant prices per unit.",
  },
  {
    icon: <FormOutlined />,
    title: "Online tenant applications",
    text: "Prospective tenants browse your available units, apply online with their guarantors and documents, and you approve or reject.",
  },
  {
    icon: <CreditCardOutlined />,
    title: "Rent collection",
    text: "Tenants pay by card through Paystack or upload a bank transfer receipt from a payment link. You confirm in one click.",
  },
  {
    icon: <FileProtectOutlined />,
    title: "Tenancy agreements",
    text: "Agreement forms are generated automatically when a tenancy starts or is renewed, ready to download and sign.",
  },
  {
    icon: <BellOutlined />,
    title: "Rent reminders",
    text: "Get told before rent falls due, so renewals and vacant units never catch you by surprise.",
  },
  {
    icon: <LineChartOutlined />,
    title: "Revenue and occupancy",
    text: "See revenue, cash flow, upcoming rent and occupancy per building on one dashboard, with admins and roles for your team.",
  },
];

const steps = [
  { title: "Create your estate", text: "Sign up with your estate's name. It takes a minute and the Free plan needs no card." },
  { title: "Add your buildings", text: "Enter your buildings and units with their prices. Your estate gets its own public page." },
  { title: "Start collecting rent", text: "Share your page with tenants. Applications, payments and agreements flow in on their own." },
];

const formatPrice = (price?: number | null) =>
  price === null || price === undefined ? null : price === 0 ? "₦0" : `₦${price.toLocaleString("en-NG")}`;

const formatLimit = (value: number | null | undefined, word: string) =>
  value === null || value === undefined ? `Unlimited ${word}s` : `${value} ${word}${value === 1 ? "" : "s"}`;

export const SaasLandingPage = () => {
  const [plans, setPlans] = useState<IPlan[] | null>(null);
  const [plansFailed, setPlansFailed] = useState(false);

  useEffect(() => {
    getPublicPlans()
      .then(setPlans)
      .catch(() => setPlansFailed(true));
  }, []);

  return (
    <>
      {/* Hero */}
      <section className="saasHero">
        <div className="saasHeroGlow" aria-hidden="true"></div>
        <div className="saasContainer saasHeroInner">
          <div>
            <span className="saasEyebrow">Estate &amp; hostel management</span>
            <h1 className="saasHeroTitle myfont5">
              Run your estate <em>without</em> the paperwork.
            </h1>
            <p className="saasHeroSubtitle saasMuted">
              {SAAS_NAME} puts your buildings, tenants, rent payments and agreements in one place. Tenants apply and pay
              online; you see who has paid, who is due and how full every building is.
            </p>
            <div className="saasHeroActions">
              <Link to="/signup" className="saasButton saasButtonPrimary">
                Create your estate
              </Link>
              <a href="#pricing" className="saasButton saasButtonGhost">
                See pricing
              </a>
            </div>
            <div className="saasHeroNote saasMuted">Free for 1 building and 10 apartments. No card needed.</div>
          </div>

          <div className="saasHeroPreview" aria-hidden="true">
            <div className="saasPreviewStats">
              <div className="saasPreviewStat">
                <b>92%</b>
                <span>Occupancy</span>
              </div>
              <div className="saasPreviewStat">
                <b>₦4.2m</b>
                <span>Collected</span>
              </div>
              <div className="saasPreviewStat">
                <b>6</b>
                <span>Due soon</span>
              </div>
            </div>
            <div className="saasPreviewRow">
              <span>Block A · Room 4</span>
              <span className="saasPreviewTag">Paid</span>
            </div>
            <div className="saasPreviewRow">
              <span>Block B · Room 12</span>
              <span className="saasPreviewTag saasPreviewTagDue">Due in 5 days</span>
            </div>
            <div className="saasPreviewRow">
              <span>New application · Room 7</span>
              <span className="saasPreviewTag">Review</span>
            </div>
            <div className="saasPreviewRow">
              <span>Transfer receipt · Room 2</span>
              <span className="saasPreviewTag">Confirm</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="saasSection">
        <div className="saasContainer">
          <div className="saasSectionHeader">
            <span className="saasEyebrow">Features</span>
            <h2 className="saasSectionTitle myfont5">Everything from vacancy to renewal</h2>
            <p className="saasMuted">
              Built with a working hostel and refined on real tenants, payments and renewals.
            </p>
          </div>
          <div className="saasFeatures">
            {features.map((feature) => (
              <div className="saasFeature" key={feature.title}>
                <span className="saasFeatureIcon">{feature.icon}</span>
                <h3 className="myfont3">{feature.title}</h3>
                <p className="saasMuted">{feature.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="saasSection">
        <div className="saasContainer">
          <div className="saasSectionHeader">
            <span className="saasEyebrow">How it works</span>
            <h2 className="saasSectionTitle myfont5">Up and running today</h2>
          </div>
          <div className="saasSteps">
            {steps.map((step) => (
              <div className="saasStep" key={step.title}>
                <h3 className="myfont3">{step.title}</h3>
                <p className="saasMuted">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="saasSection">
        <div className="saasContainer">
          <div className="saasSectionHeader saasSectionHeaderCenter">
            <span className="saasEyebrow">Pricing</span>
            <h2 className="saasSectionTitle myfont5">Start free, grow when you need to</h2>
            <p className="saasMuted">Every plan includes all features. Plans differ only in how many buildings and apartments you manage.</p>
          </div>

          <div className="saasPlans">
            {plans === null && !plansFailed &&
              [1, 2, 3].map((i) => (
                <div className="saasPlan" key={i}>
                  <Skeleton active />
                </div>
              ))}

            {plans?.map((plan) => (
              <div className="saasPlan" key={plan.id}>
                <h3 className="myfont3">{plan.title}</h3>
                <div className="saasPlanPrice myfont3">
                  {formatPrice(plan.monthlyPrice) ?? "Ask us"}
                  {!!plan.monthlyPrice && <small> / month</small>}
                </div>
                <ul className="saasPlanList">
                  <li>{formatLimit(plan.maxBuildings, "building")}</li>
                  <li>{formatLimit(plan.maxApartments, "apartment")}</li>
                  <li>Online applications and payments</li>
                  <li>Admins and roles for your team</li>
                </ul>
                <Link to="/signup" className={`saasButton ${plan.isDefault ? "saasButtonPrimary" : "saasButtonGhost"}`}>
                  {plan.isDefault ? "Start free" : `Choose ${plan.title}`}
                </Link>
              </div>
            ))}

            {/* Custom plans are agreed per estate, so they are not listed by the API */}
            <div className="saasPlan saasPlanFeatured">
              <h3 className="myfont3">Custom</h3>
              <div className="saasPlanPrice myfont3">Let's talk</div>
              <ul className="saasPlanList">
                <li>Unlimited buildings</li>
                <li>Unlimited apartments</li>
                <li>Help moving your existing tenants in</li>
                <li>Priced for your estate</li>
              </ul>
              <Link to="/contact" className="saasButton saasButtonPrimary">
                Contact us
              </Link>
            </div>
          </div>

          {plansFailed && (
            <p className="saasMuted" style={{ textAlign: "center", marginTop: 16 }}>
              Prices could not be loaded right now. <Link to="/contact">Contact us</Link> for a quote.
            </p>
          )}
          {plans?.some((plan) => !plan.isDefault && plan.monthlyPrice) && (
            <p className="saasMuted" style={{ textAlign: "center", marginTop: 16, fontSize: 13 }}>
              Everyone starts on Free. To upgrade, contact us after signing up and we will move your estate to the plan you choose.
            </p>
          )}
        </div>
      </section>

      {/* Call to action */}
      <section className="saasSection">
        <div className="saasContainer">
          <div className="saasCta">
            <h2 className="saasSectionTitle myfont5">Ready to see your estate in one place?</h2>
            <p className="saasMuted">Create your estate in a minute, or talk to us about moving an existing one.</p>
            <div className="saasHeroActions" style={{ justifyContent: "center" }}>
              <Link to="/signup" className="saasButton saasButtonPrimary">
                Create your estate
              </Link>
              <Link to="/contact" className="saasButton saasButtonGhost">
                Talk to us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default SaasLandingPage;
