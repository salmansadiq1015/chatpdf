"use client";
import React, { useEffect } from "react";
import Chart from "chart.js/auto";

interface PieChartProps {
  totalMessages: number;
}

const PieChart: React.FC<PieChartProps> = ({ totalMessages }) => {
  const totalLimit = 500;
  useEffect(() => {
    // Calculate the percentage of total messages
    const percentage = (totalMessages / totalLimit) * 100;

    // Get the canvas element
    const ctx = document.getElementById("pieChart") as HTMLCanvasElement;

    // Create the pie chart
    const chart = new Chart(ctx, {
      type: "pie",
      data: {
        datasets: [
          {
            data: [percentage, 100 - percentage],
            backgroundColor: ["#36A2EB", "#FFCE56"],
          },
        ],
        labels: ["Used", "Remaining"],
      },
    });

    // Cleanup on component unmount
    return () => {
      chart.destroy();
    };
  }, [totalMessages, totalLimit]);

  return (
    <div className="h-[220px]">
      <canvas id="pieChart" width="220" height="220" />
    </div>
  );
};

export default PieChart;
