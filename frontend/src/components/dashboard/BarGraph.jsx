import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "../../styles/dashboard.css";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarGraph = ({ barData, isDark }) => {
  const textPrimary = isDark ? "#f0f0f0" : "#333333";
  const textSecondary = isDark ? "#bbbbbb" : "#666666";
  const gridColor = isDark ? "#2a2a44" : "#e5e5e5";

  const data = {
    labels: ["Female", "Male"],
    datasets: [
      {
        label: "Learners",
        data: [barData.female, barData.male],
        backgroundColor: ["#e91e63", "#2196f3"],
        borderRadius: 8,
        barThickness: 80,
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
          font: { size: 13, weight: "600" },
          color: textPrimary,
        },
      },
    },
  };

  return (
    <div className="graph-container">
      <h3 className="graph-title">Learners by Gender</h3>
      <div className="graph-wrapper">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default BarGraph;