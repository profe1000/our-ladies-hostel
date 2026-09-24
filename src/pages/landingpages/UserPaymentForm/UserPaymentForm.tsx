import { useParams } from "react-router-dom";
import {
  AppstoreOutlined,
  CheckOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { Skeleton } from "antd";
import TopBar from "../../../components/LayoutComponent/TopBar/topBar";
import TenantPaymentForm from "../../../components/userscomponents/apartmentsFormsComp/paymentForms/tenantPaymentForm";
import {
  useSelectedApartment,
  useSelectedBuilding,
} from "../../../hooks/useTenantSelection";
import { formatCurrency } from "../../../utils/basic.utils";
// Shares the step tracker and summary card styles with the registration page
import "../UserRegistrationForm/UserRegistrationForm.css";
import "./UserPaymentForm.css";

const paymentSteps = ["Building", "Apartment", "Registration", "Payment"];
const currentStep = 3;

export const UserPaymentForm = () => {
  const params = useParams();
  const selectedApartment = useSelectedApartment(params?.id);
  const selectedBuilding = useSelectedBuilding(selectedApartment?.buildingId);

  return (
    <>
      <TopBar
        showBackButton={true}
        backButtonHref={`/landing/user-tenant-registration/${params?.id}`}
      ></TopBar>

      <div className="w3-content regPageWrapper">
        {/* Progress Steps */}
        <ol className="regSteps myfont1">
          {paymentSteps.map((step, index) => (
            <li
              key={step}
              className={`regStep ${
                index < currentStep
                  ? "regStepDone"
                  : index === currentStep
                  ? "regStepActive"
                  : ""
              }`}
            >
              <span className="regStepDot">
                {index < currentStep ? <CheckOutlined /> : index + 1}
              </span>
              <span className="regStepLabel">{step}</span>
            </li>
          ))}
        </ol>

        {/* Selected Building & Apartment Summary */}
        {selectedApartment && selectedBuilding ? (
          <div className="regSummaryCard">
            <img
              className="regSummaryImage"
              src={selectedBuilding.imageUrl}
              alt={selectedBuilding.title || "Building"}
            />
            <div className="regSummaryContent">
              <span className="regSummaryEyebrow myfont1">
                You are paying for
              </span>
              <h2 className="regSummaryTitle myfont5">
                {selectedApartment.title}
              </h2>
              <p className="regSummaryBuilding myfont1">
                <HomeOutlined /> {selectedBuilding.title}
              </p>
              <p className="regSummaryText myfont1">
                {selectedBuilding.description}
              </p>

              <div className="regSummaryStats">
                <div className="regSummaryStat">
                  <span className="regSummaryStatLabel myfont1">Rent</span>
                  <span className="regSummaryStatValue myfont3">
                    {formatCurrency(selectedApartment.price)}
                  </span>
                </div>
                <div className="regSummaryStat">
                  <span className="regSummaryStatLabel myfont1">Status</span>
                  <span
                    className={`regSummaryStatValue myfont3 ${
                      selectedApartment.isOccupied
                        ? "regStatusOccupied"
                        : "regStatusAvailable"
                    }`}
                  >
                    {selectedApartment.isOccupied ? "Occupied" : "Available"}
                  </span>
                </div>
                <div className="regSummaryStat">
                  <span className="regSummaryStatLabel myfont1">Building</span>
                  <span className="regSummaryStatValue myfont3">
                    <AppstoreOutlined /> {selectedBuilding.noOfApartments}{" "}
                    Units
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="regSummaryCard regSummaryLoading">
            <Skeleton.Image active className="regSummaryImage" />
            <div className="regSummaryContent">
              <Skeleton active paragraph={{ rows: 3 }} />
            </div>
          </div>
        )}
      </div>

      <TenantPaymentForm></TenantPaymentForm>
    </>
  );
};

export default UserPaymentForm;
