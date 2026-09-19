import { IAdminDashboardData } from "../../../apiservice/admin-General-ApiService.type";
import { useAppSelector } from "../../../Redux/reduxCustomHook";
import { RootState } from "../../../Redux/store";
import { formatCurrency } from "../../../utils/basic.utils";
import { convertToShortDate } from "../../../utils/date.utils";
import "./adminChart.css";

export const AdminTableCashFlow = () => {
  const adminDashboardData: IAdminDashboardData = useAppSelector(
    (state: RootState) => state?.AdminDashBoardData
  );

  const cashFlowType = {
    1: { color: " w3-text-green", text: "Inflow Rent" },
    2: { color: " w3-text-red", text: "Expenses" },
    3: { color: " w3-text-yellow", text: "Inflow Fees" },
  };

  return (
    <>
      <>
        <div className="w3-col w3-margin-bottom">
          <div className="w3-col w3-card chartBackground w3-padding w3-round-large">
            {/* Title */}
            <div className="w3-col">
              <span className="w3-small w3-text-white myfont1">
                Cash Flow Break Down
              </span>
            </div>

            {/* Grid */}
            <div className="w3-col w3-margin-top">
              {/* <div className="w3-col gridBackGround w3-round w3-margin-bottom w3-round-large w3-padding">
                <p> No Cash Flow BreakDown At the moment</p>
              </div> */}
              {adminDashboardData?.cashFlowSummary?.length > 0 ? (
                <>
                  {adminDashboardData?.cashFlowSummary.map(
                    (cashFlowSummary, index) => (
                      <div
                        key={index}
                        className="w3-col gridBackGround w3-round w3-margin-bottom w3-round-large w3-padding"
                      >
                        <div
                          className="w3-col l12 s12 m12"
                          style={{ padding: "2px" }}
                        >
                          <b className="myfont1 w3-tiny">{`${cashFlowSummary.buildingTitle} ${cashFlowSummary.apartmentTitle}`}</b>
                          <br />
                          <span className="myfont1 w3-small">{`${
                            cashFlowSummary.title
                          } (${
                            cashFlowType[cashFlowSummary.typeId].text
                          })`}</span>
                        </div>
                        <div
                          className="w3-col l5 s5 m5"
                          style={{ padding: "2px" }}
                        >
                          <span className="myfont1 w3-tiny">
                            {convertToShortDate(cashFlowSummary.date)}
                          </span>
                        </div>
                        <div
                          className="w3-col l7 s7 m7 w3-right-align"
                          style={{ padding: "2px" }}
                        >
                          <b
                            className={
                              "myfont1 w3-small " +
                              cashFlowType[cashFlowSummary.typeId].color
                            }
                          >
                            {formatCurrency(cashFlowSummary.amount)}
                          </b>
                        </div>
                      </div>
                    )
                  )}
                </>
              ) : (
                <div className="w3-col gridBackGround w3-round w3-margin-bottom w3-round-large w3-padding">
                  <p> No Cash Flow BreakDown At the moment </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </>
    </>
  );
};

export default AdminTableCashFlow;
