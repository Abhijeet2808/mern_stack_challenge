import React, { useState, useEffect } from "react";
import axios from "axios";
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
import "./TransactionsBarChart.css";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const TransactionsBarChart = ({ month }) => {
  const [barChartData, setBarChartData] = useState([]);

  useEffect(() => {
    const fetchBarChartData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/bar-chart`,
          {
            params: { month },
          }
        );
        setBarChartData(response.data);
      } catch (error) {
        console.log("Error fetching bar chart data:", error);
      }
    };

    fetchBarChartData();
  }, [month]);

  const data = {
    labels: barChartData.map((item) => item.range),
    datasets: [
      {
        label: "# of Items",
        data: barChartData.map((item) => item.count),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Number of Items Sold in Different Price Ranges",
      },
    },
  };

  return (
    <div className="bar-chart-container">
      <h2>Transactions Bar Chart</h2>
      <Bar data={data} options={options} />
    </div>
  );
};

export default TransactionsBarChart;
