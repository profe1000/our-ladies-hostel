import { IAdminDashboardData } from "../../../apiservice/admin-General-ApiService.type";
import { useAppSelector } from "../../../Redux/reduxCustomHook";
import { RootState } from "../../../Redux/store";
import { formatCurrency } from "../../../utils/basic.utils";
import "./adminChart.css";

export const AdminChartRevenue = () => {
  const adminDashboardData: IAdminDashboardData = useAppSelector(
    (state: RootState) => state?.AdminDashBoardData
  );

  const graphData = {
    type: "doughnut",
    data: {
      labels: ["Total Revenue", "Amount Collected"],
      datasets: [
        {
          label: "",
          data: [
            adminDashboardData?.revenue?.currentYear.totalRevenue || 0,
            adminDashboardData?.revenue?.currentYear.amountCollected || 0,
          ],
          backgroundColor: ["#165BAA", "#6FAB6E"],
          borderWidth: 0,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
        title: {
          display: true,
          text: "",
        },
        labels: {
          render: "label",
          fontStyle: "normal",
          fontSize: 12,
          fontColor: "#fff",
          fontFamily: "Arial",
          arc: true,
        },
        datalabels: {
          formatter: function (value, context) {
            return context.chart.data.labels[context.dataIndex];
          },
          color: "white",
          font: {
            weight: "bold",
            size: 18,
          },
          padding: 4,
        },
      },
    },
  };
  const graphHtmlString = `<div style="height: 200px">
  <canvas id="myChart"></canvas>
</div>

<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

<script>
  const ctx = document.getElementById("myChart");

  new Chart(ctx, ${JSON.stringify(graphData)});
</script>
`;
  return (
    <>
      <div className="w3-col w3-margin-bottom">
        <div className="w3-col w3-card chartBackground w3-padding w3-round-large">
          {/* Chart Title */}
          <div className="w3-col">
            <span className="w3-small w3-text-white myfont1">
              Total Revenue
            </span>
            <h4 className="w3-text-white myfont2 revenueChartAmount">
              {formatCurrency(
                adminDashboardData?.revenue?.currentYear.totalRevenue || 0
              )}
            </h4>
          </div>
          {/* Chart */}
          <div className="w3-col l6 s6 m6">
            <iframe
              style={{ width: "100%", height: "220px", border: "0px" }}
              srcDoc={graphHtmlString}
              title="Graph"
            ></iframe>
          </div>
          {/* Chart Indicator */}
          <div className="w3-col l6 s6 m6">
            {/* Total Revenue Text */}
            <div className="w3-col w3-margin-bottom">
              <div
                className="w3-col w3-round"
                style={{ width: "20px", height: "20px", background: "#165BAA" }}
              ></div>
              <div className="w3-rest">
                &nbsp;
                <span className="w3-small w3-text-white">Total Revenue</span>
              </div>
            </div>

            {/* Amount Collected */}
            <div className="w3-col w3-margin-bottom">
              <div
                className="w3-col w3-round"
                style={{ width: "20px", height: "20px", background: "#6FAB6E" }}
              ></div>
              <div className="w3-rest">
                &nbsp;
                <span className="w3-small w3-text-white">
                  Amount Collected (Rent)
                </span>
              </div>
            </div>

            {/* Number To be balance */}
            <div className="w3-col w3-margin-bottom">
              <div
                className="w3-col w3-round"
                style={{ width: "20px", height: "20px", background: "#FF2C2C" }}
              ></div>
              <div className="w3-rest">
                &nbsp;
                <span className="w3-small w3-text-white">
                  Amount Balance :{" "}
                  {formatCurrency(
                    (adminDashboardData?.revenue?.currentYear.totalRevenue ||
                      0) -
                      (adminDashboardData?.revenue?.currentYear
                        .amountCollected || 0)
                  )}
                </span>
              </div>
            </div>

            {/* Total House */}
            <div className="w3-col w3-margin-bottom">
              <div
                className="w3-col w3-round"
                style={{ width: "20px", height: "20px", background: "#165BAA" }}
              ></div>
              <div className="w3-rest">
                &nbsp;
                <span className="w3-small w3-text-white">
                  Total Apartment:{" "}
                  {adminDashboardData?.revenue?.apartmentDetails?.total}
                </span>
              </div>
            </div>

            {/* Number of paid unit */}
            <div className="w3-col w3-margin-bottom">
              <div
                className="w3-col w3-round"
                style={{ width: "20px", height: "20px", background: "#6FAB6E" }}
              ></div>
              <div className="w3-rest">
                &nbsp;
                <span className="w3-small w3-text-white">
                  No. of Paid Unit :{" "}
                  {adminDashboardData?.revenue?.apartmentDetails?.noOfPaid}
                </span>
              </div>
            </div>

            {/* Number of unpaid unit */}
            <div className="w3-col w3-margin-bottom">
              <div
                className="w3-col w3-round"
                style={{ width: "20px", height: "20px", background: "#FF2C2C" }}
              ></div>
              <div className="w3-rest">
                &nbsp;
                <span className="w3-small w3-text-white">
                  No. of UnPaid Unit :{" "}
                  {adminDashboardData?.revenue?.apartmentDetails?.noOfUnpaid}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminChartRevenue;
