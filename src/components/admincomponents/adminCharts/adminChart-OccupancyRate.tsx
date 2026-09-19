import { IAdminDashboardData } from "../../../apiservice/admin-General-ApiService.type";
import { useAppSelector } from "../../../Redux/reduxCustomHook";
import { RootState } from "../../../Redux/store";
import "./adminChart.css";

export const AdminChartOccupancy = () => {
  const adminDashboardData: IAdminDashboardData = useAppSelector(
    (state: RootState) => state?.AdminDashBoardData
  );

  const graphData = {
    type: "pie",
    data: {
      labels: ["Occupied", "Empty"],
      datasets: [
        {
          label: "",
          data: [
            adminDashboardData?.occupancyRate?.noOfOccupied || 0,
            adminDashboardData?.occupancyRate?.noOfEmpty || 0,
          ],
          backgroundColor: ["#16BFD6", "#A155B9"],
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
      <div className="w3-col  w3-margin-bottom">
        <div className="w3-col w3-card chartBackground w3-padding w3-round-large">
          {/* Chart Title */}
          <div className="w3-col">
            <span className="w3-small w3-text-white myfont1">
              Occupancy Rate
            </span>
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
                style={{ width: "20px", height: "20px", background: "#16BFD6" }}
              ></div>
              <div className="w3-rest">
                &nbsp;
                <span className="w3-small w3-text-white">
                  Occupied :
                  {adminDashboardData?.occupancyRate?.noOfOccupied || 0}
                </span>
              </div>
            </div>
            {/* Amount Collected */}
            <div className="w3-col w3-margin-bottom">
              <div
                className="w3-col w3-round"
                style={{ width: "20px", height: "20px", background: "#A155B9" }}
              ></div>
              <div className="w3-rest">
                &nbsp;
                <span className="w3-small w3-text-white">
                  Empty: {adminDashboardData?.occupancyRate?.noOfEmpty || 0}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminChartOccupancy;
