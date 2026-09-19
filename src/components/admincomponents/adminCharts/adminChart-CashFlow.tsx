import { Modal } from "antd";
import { useState } from "react";
import { IAdminDashboardData } from "../../../apiservice/admin-General-ApiService.type";
import { useAppSelector } from "../../../Redux/reduxCustomHook";
import { RootState } from "../../../Redux/store";
import "./adminChart.css";
import AdminTableCashFlow from "./adminTable-CashFlow-BreakDown";

export const AdminChartCashFlow = () => {
  const adminDashboardData: IAdminDashboardData = useAppSelector(
    (state: RootState) => state?.AdminDashBoardData
  );
  const [showCashFlowTable, setShowCashFlowTable] = useState(false);
  const { confirm } = Modal;

  const graphData = {
    type: "bar",
    data: {
      labels: (adminDashboardData?.cashFlow || []).map((cashFlow) => {
        return cashFlow.dateName;
      }),
      datasets: [
        {
          label: "",
          data: (adminDashboardData?.cashFlow || []).map((cashFlow) => {
            return cashFlow.revenueAmount;
          }),
          backgroundColor: ["#6FAB6E"],
          borderWidth: 0,
        },
        {
          label: "",
          data: (adminDashboardData?.cashFlow || []).map((cashFlow) => {
            return cashFlow.costAmount;
          }),
          backgroundColor: ["#AD3116"],
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
            <span className="w3-small w3-text-white myfont1">Cash Flow</span>
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
            {/* Inflow  */}
            <div
              className="w3-col l6 s6 m6 w3-margin-bottom"
              style={{ padding: "2px" }}
            >
              <div
                className="w3-col w3-round"
                style={{ width: "20px", height: "20px", background: "#6FAB6E" }}
              ></div>
              <div className="w3-rest">
                &nbsp;
                <span className="w3-small w3-text-white">InFlow</span>
              </div>
            </div>
            {/* Out Flow */}
            <div
              className="w3-col l6 s6 m6  w3-margin-bottom"
              style={{ padding: "2px" }}
            >
              <div
                className="w3-col w3-round"
                style={{ width: "20px", height: "20px", background: "#AD3116" }}
              ></div>
              <div className="w3-rest">
                &nbsp;
                <span className="w3-small w3-text-white">OutFlow</span>
              </div>
            </div>

            {/*Button */}
            <div
              className="w3-col  w3-margin-bottom"
              style={{ padding: "2px" }}
            >
              <u
                onClick={() => {
                  setShowCashFlowTable(!showCashFlowTable);
                }}
              >
                {showCashFlowTable
                  ? "Hide Cash Flow BreakDown"
                  : "Show Cash Flow BreakDown"}
              </u>
            </div>
          </div>
        </div>
      </div>

      {/* Cash Flow Modal */}
      {showCashFlowTable ? <AdminTableCashFlow></AdminTableCashFlow> : ""}
    </>
  );
};

export default AdminChartCashFlow;
