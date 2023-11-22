"use client";

import React, { useEffect, useRef } from "react";
import Chart, { ChartConfiguration, ChartOptions } from "chart.js/auto";

interface LineChartProps {
  fileLength: number;
}

const PieCharts: React.FC<LineChartProps> = ({ fileLength }) => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart<"pie", number[], string> | null>(null);

  useEffect(() => {
    if (chartRef.current) {
      // Destroy existing chart if it exists
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const ctx = chartRef.current.getContext("2d");
      if (ctx) {
        chartInstance.current = new Chart(ctx, {
          type: "pie", // Set chart type to 'pie'
          data: {
            labels: Array.from(
              { length: fileLength },
              (_, i) => `File ${i + 1}`
            ),
            datasets: [
              {
                label: "Total Files",
                data: Array.from({ length: fileLength }, () =>
                  Math.floor(Math.random() * 100)
                ),
                backgroundColor: [
                  "rgba(255, 99, 132, 0.6)",
                  "rgba(54, 162, 235, 0.6)",
                  "rgba(255, 206, 86, 0.6)",
                  "rgba(75, 192, 192, 0.6)",
                  "rgba(153, 102, 255, 0.6)",
                  "rgba(255, 159, 64, 0.6)",
                  // Add more colors as needed
                ],
                borderWidth: 1,
              },
            ],
          },
          options: {} as ChartOptions<"pie">, // Use ChartOptions<'pie'> to resolve type issues
        });
      }
    }
  }, [fileLength]);

  return <canvas id="lineChart" width="200" height="200" ref={chartRef} />;
};

export default PieCharts;
