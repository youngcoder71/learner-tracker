import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import "../../styles/dashboard.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const LineGraph = ({ lineData, isDark }) => {
  const textPrimary = isDark ? "#f0f0f0" : "#333333";
  const textSecondary = isDark ? "#bbbbbb" : "#666666";
  const gridColor = isDark ? "#2a2a44" : "#e5e5e5";

  const labels = lineData.map((item) => item.level);
  const counts = lineData.map((item) => item.count);

  const data = {
    labels: labels,
    datasets: [
      {
        label: "Learners",
        data: counts,
        borderColor: "#ff6b00",
        backgroundColor: "rgba(255, 107, 0, 0.1)",
        borderWidth: 3,
        pointBackgroundColor: "#ff6b00",
        pointBorderColor: "#ffffff",
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: isDark ? "#1e1e32" : "#1a1a1a",
        titleFont: { size: 14 },
        bodyFont: { size: 13 },
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: (context) => `${context.raw} learners`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: gridColor,
          drawBorder: false,
        },
        ticks: {
          font: { size: 12 },
          color: textSecondary,
        },
        title: {
          display: true,
          text: "Amount of Learners",
          font: { size: 13, weight: "600" },
          color: textPrimary,
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: { size: 12, weight: "500" },
          color: textPrimary,
        },
      },
    },
  };

  return (
    <div className="graph-container">
      <h3 className="graph-title">Learners by Education Level</h3>
      <div className="graph-wrapper">
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default LineGraph;