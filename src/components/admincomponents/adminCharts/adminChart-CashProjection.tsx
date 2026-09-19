import { IAdminDashboardData } from "../../../apiservice/admin-General-ApiService.type";
import { useAppSelector } from "../../../Redux/reduxCustomHook";
import { RootState } from "../../../Redux/store";
import "./adminChart.css";

export const AdminChartCashProjection = () => {
  const adminDashboardData: IAdminDashboardData = useAppSelector(
    (state: RootState) => state?.AdminDashBoardData
  );
  const graphData = {
    type: "bar",
    data: {
      labels: (adminDashboardData?.cashProjection || []).map(
        (cashProjection) => {
          return cashProjection.dateName;
        }
      ),
      datasets: [
        {
          label: "",
          data: (adminDashboardData?.cashProjection || []).map(
            (cashProjection) => {
              return cashProjection.amount;
            }
          ),
          backgroundColor: ["#6FAB6E"],
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
      },
    },
  };
  const graphHtmlString = `<div style="height: 240px">
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
              Cash Projection
            </span>
          </div>
          {/* Chart */}
          <div className="w3-col">
            <iframe
              style={{ width: "100%", height: "260px", border: "0px" }}
              srcDoc={graphHtmlString}
              title="Graph"
            ></iframe>
          </div>
          {/* Chart Indicator */}
          <div className="w3-col">
            {/* Total Revenue Text */}
            <div className="w3-col w3-margin-bottom">
              <div
                className="w3-col w3-round"
                style={{ width: "20px", height: "20px", background: "#6FAB6E" }}
              ></div>
              <div className="w3-rest">
                &nbsp;
                <span className="w3-small w3-text-white">Cash Projected</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminChartCashProjection;
