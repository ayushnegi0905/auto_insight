import { Bar, Pie } from "react-chartjs-2";
import html2canvas from "html2canvas";

import {
  Chart as ChartJS,
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

function ChartResult({
  chartData,
  chartType,
  agg,
  valueCol,
  groupCol,
}) {  
      const downloadChart = async () => {
      const chart = document.getElementById("chart-container");
      const canvas = await html2canvas(chart);
      const link = document.createElement("a");
      link.download = "chart.png";
      link.href = canvas.toDataURL();
      link.click();
    };
  
  return (
    <>
      {/* RESULT */}
      {chartData && (
          <div className="chart-wrapper" id="chart-container">
          <h2 className="chart-title">
            {agg.toUpperCase()} of {valueCol} by {groupCol}
          </h2>

          <div className="chart-box">

  {chartType === "bar" ? (
    <Bar
      data={{
        labels: chartData.labels,
        datasets: [
          {
            label: valueCol,
            data: chartData.values,
            backgroundColor: [
              "#3b82f6",
              "#22c55e",
              "#f59e0b",
              "#ef4444",
              "#8b5cf6",
              "#06b6d4",
              "#84cc16",
              "#f97316",
              "#ec4899",
              "#14b8a6",
            ],
            borderRadius: 8,
          },
        ],
      }}
    />
  ) : (
    <Pie
      data={{
        labels: chartData.labels,
        datasets: [
          {
            data: chartData.values,
            backgroundColor: [
              "#3b82f6",
              "#22c55e",
              "#f59e0b",
              "#ef4444",
              "#8b5cf6",
              "#06b6d4",
              "#84cc16",
              "#f97316",
              "#ec4899",
              "#14b8a6",
            ],
          },
        ],
      }}

      options={{
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              padding: 20,
              font: {
                size: 14,
              },
            },
          },
        },
      }}
    />
  )}

</div>
          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <button onClick={downloadChart}>
              Download Chart
            </button>
          </div>

        </div>
      )}
    </>
  );
}

export default ChartResult;