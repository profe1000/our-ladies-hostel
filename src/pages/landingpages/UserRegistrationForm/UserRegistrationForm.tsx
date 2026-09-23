import { useParams } from "react-router-dom";
import {
  AppstoreOutlined,
  CheckOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { Skeleton } from "antd";
import TopBar from "../../../components/LayoutComponent/TopBar/topBar";
import TenantRegistrationForm from "../../../components/userscomponents/apartmentsFormsComp/registratiionForms/tenantRegistrationForm";
import {
  useSelectedApartment,
  useSelectedBuilding,
} from "../../../hooks/useTenantSelection";
import { formatCurrency } from "../../../utils/basic.utils";
import "./UserRegistrationForm.css";

const registrationSteps = ["Building", "Apartment", "Registration", "Payment"];
const currentStep = 2;

export const UserRegistrationForm = () => {
  const params = useParams();
  const selectedApartment = useSelectedApartment(params?.id);
  const selectedBuilding = useSelectedBuilding(selectedApartment?.buildingId);

  return (
    <>
      <TopBar
        showBackButton={true}
        backButtonHref={`/landing/user-apartment-Unit/${selectedApartment?.buildingId}`}
      ></TopBar>

      <div className="w3-content regPageWrapper">
        {/* Progress Steps */}
        <ol className="regSteps myfont1">
          {registrationSteps.map((step, index) => (
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
                You are registering for
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

      <TenantRegistrationForm></TenantRegistrationForm>
    </>
  );
};

export default UserRegistrationForm;
