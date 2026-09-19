import { IAdminDashboardData } from "../../../apiservice/admin-General-ApiService.type";
import { useAppSelector } from "../../../Redux/reduxCustomHook";
import { RootState } from "../../../Redux/store";
import { formatCurrency } from "../../../utils/basic.utils";
import "./adminChart.css";

export const AdminTableRevenueTab = () => {
  const adminDashboardData: IAdminDashboardData = useAppSelector(
    (state: RootState) => state?.AdminDashBoardData
  );
  return (
    <>
      <div className="w3-col w3-margin-bottom">
        <div className="w3-col w3-card chartBackground w3-padding w3-round-large">
          {/* Title */}
          <div className="w3-col">
            <span className="w3-small w3-text-white myfont1">
              Revenue BreakDown (Fiscal Year)
            </span>
          </div>

          {/* Grid */}
          <div className="w3-col w3-margin-top">
            <div className="w3-row">
              <div className="w3-col l6 s6 m6" style={{ padding: "5px" }}>
                <div className="w3-col gridBackGround w3-round w3-margin-bottom w3-round-large w3-padding">
                  <span className="myfont1 w3-tiny"> Total Revenue</span>
                  <br />
                  <b className="myfont1  w3-small">
                    {formatCurrency(
                      adminDashboardData.revenue?.totalRevenue || 0
                    )}
                  </b>
                </div>
              </div>
              <div className="w3-col l6 s6 m6" style={{ padding: "5px" }}>
                <div className="w3-col gridBackGround w3-round w3-margin-bottom w3-round-large w3-padding">
                  <span className="w3-tiny"> Amount Collected (Rent) </span>
                  <br />
                  <b className="myfont1  w3-small">
                    {formatCurrency(
                      adminDashboardData.revenue?.amountCollected || 0
                    )}
                  </b>
                </div>
              </div>
            </div>
            <div className="w3-row">
              <div className="w3-col l6 s6 m6" style={{ padding: "5px" }}>
                <div className="w3-col gridBackGround w3-round w3-margin-bottom w3-round-large w3-padding">
                  <span className="w3-tiny">
                    {" "}
                    Amount Collected (Other Fees)
                  </span>
                  <br />
                  <b className="myfont1  w3-small">
                    {formatCurrency(
                      adminDashboardData.revenue?.extraCharges || 0
                    )}
                  </b>
                </div>
              </div>

              <div className="w3-col l6 s6 m6" style={{ padding: "5px" }}>
                <div className="w3-col gridBackGround w3-round w3-margin-bottom w3-round-large w3-padding">
                  <span className="w3-tiny"> Total Amount </span>
                  <br />
                  <b className="myfont1  w3-small">
                    {formatCurrency(
                      (adminDashboardData.revenue?.extraCharges || 0) +
                        (adminDashboardData.revenue?.amountCollected || 0)
                    )}
                  </b>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminTableRevenueTab;
