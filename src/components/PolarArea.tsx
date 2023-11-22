"use client";

// components/FileCharts.tsx
import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

interface FileChartsProps {
  uploadedFiles: number;
  totalQuota: any;
}

const PolarAreaChart: React.FC<FileChartsProps> = ({
  uploadedFiles,
  totalQuota,
}) => {
  const doughnutChartRef = useRef<HTMLCanvasElement>(null!);

  useEffect(() => {
    // Calculate the percentage of uploaded files
    const percentage = (uploadedFiles / totalQuota) * 100;

    // Get the canvas elements
    const doughnutCtx = doughnutChartRef.current;

    // Destroy existing Chart instances
    if (doughnutCtx) {
      Chart.getChart(doughnutCtx)?.destroy();
    }

    // Create the doughnut chart
    const doughnutChart = new Chart(doughnutCtx, {
      type: "doughnut",
      data: {
        labels: ["Used", "Remaining"],
        datasets: [
          {
            data: [percentage, 100 - percentage],
            backgroundColor: ["#FF0000", "#36A2EB"],
          },
        ],
      },
    });

    // Cleanup on component unmount
    return () => {
      doughnutChart.destroy();
    };
  }, [uploadedFiles, totalQuota]);

  return <canvas ref={doughnutChartRef} width="400" height="400" />;
};

export default PolarAreaChart;
