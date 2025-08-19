"use client";
import { GraphProps } from "@/types/graphProps";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

// Register chart components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Graph = ({ labels, values, title }: GraphProps) => {
  const data = {
    // labels: ["Jan", "Feb", "Mar", "Apr", "May"],
    labels: labels,
    datasets: [
      {
        label: "Sales",
        // data: [12, 19, 3, 5, 2],
        data: values,
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
      },
    ],
  };
  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" as const },
      title: { display: true, text: title },
    },
  };

  return <Line data={data} options={options} />;
};

export default Graph;
