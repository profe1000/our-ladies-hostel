import { useEffect, useRef } from "react";
import { App } from "@capacitor/app";
import { Link } from "react-router-dom";
import {
  ArrowDownOutlined,
  CreditCardOutlined,
  HomeOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";
import TopBar from "../../../components/LayoutComponent/TopBar/topBar";
import { BuildingListUser } from "../../../components/userscomponents/buildingsComp/building-list/building-list";
import "./Home.css";

const homeHighlights = [
  {
    icon: <SafetyCertificateOutlined />,
    title: "Safe & Secure",
    text: "Gated buildings with round-the-clock security.",
  },
  {
    icon: <HomeOutlined />,
    title: "Comfortable Units",
    text: "Clean, well-finished rooms ready to move into.",
  },
  {
    icon: <CreditCardOutlined />,
    title: "Easy Payments",
    text: "Register and pay for your unit online in minutes.",
  },
];

export const HomePage = () => {
  const listingsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const backHandler = () => {
      App.exitApp();
      return true;
    };
    const backButtonListener = App.addListener("backButton", backHandler);
    return () => {
      backButtonListener.remove();
    };
  }, []);

  // Scroll down to the building listings
  const scrollToListings = () => {
    listingsRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <TopBar></TopBar>

      {/* Hero Section */}
      <section className="homeHero">
        <div className="homeHeroGlow" aria-hidden="true"></div>
        <div className="w3-content homeHeroInner">
          <div className="homeHeroText">
            <span className="homeHeroEyebrow myfont1">
              Our Ladies Lodge
            </span>
            <h1 className="homeHeroTitle myfont5">
              A home that feels <em>right</em>, from day one.
            </h1>
            <p className="homeHeroSubtitle myfont1">
              Browse our buildings, pick the unit that suits you, and complete
              your registration and payment all in one place.
            </p>
            <div className="homeHeroActions">
              <button
                type="button"
                className="homeHeroButton homeHeroButtonPrimary myfont3"
                onClick={scrollToListings}
              >
                Explore Buildings <ArrowDownOutlined />
              </button>
              <Link
                to="/auth"
                className="homeHeroButton homeHeroButtonGhost myfont1"
              >
                Tenant Sign In
              </Link>
            </div>
          </div>

          <div className="homeHeroGallery" aria-hidden="true">
            <img
              className="homeHeroImage homeHeroImageMain"
              src="/images/sample/house1.png"
              alt=""
            />
            <img
              className="homeHeroImage homeHeroImageTop"
              src="/images/sample/house2.png"
              alt=""
            />
            <img
              className="homeHeroImage homeHeroImageBottom"
              src="/images/sample/house3.png"
              alt=""
            />
          </div>
        </div>

        {/* Highlights */}
        <div className="w3-content homeHighlights">
          {homeHighlights.map((item) => (
            <div className="homeHighlight" key={item.title}>
              <span className="homeHighlightIcon">{item.icon}</span>
              <div>
                <h6 className="homeHighlightTitle myfont3">{item.title}</h6>
                <p className="homeHighlightText myfont1">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Building Listings */}
      <div ref={listingsRef} className="homeListings">
        <div className="w3-content homeListingsHeader">
          <span className="homeHeroEyebrow myfont1">Available Now</span>
          <h2 className="homeListingsTitle myfont5">Our Buildings</h2>
        </div>
        <BuildingListUser></BuildingListUser>
      </div>
    </>
  );
};

export default HomePage;
