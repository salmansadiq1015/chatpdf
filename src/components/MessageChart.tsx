"use client";

import React, { useState, useEffect } from "react";

interface ChartState {
  options: {
    chart: {
      id: string;
    };
    xaxis: {
      categories: string[];
      title: {
        text: string;
      };
    };
  };
  series: { name: string; data: number[] }[];
}

const MessageChart = ({ AllMessages }: { AllMessages: number }) => {
  const [state, setState] = useState<ChartState | null>(null);

  useEffect(() => {
    // Dynamic import of required libraries
    import("react-apexcharts").then((ApexCharts) => {
      import("apexcharts").then((ApexChartsJS) => {
        // Now you can use ApexCharts and ApexChartsJS
        setState({
          options: {
            chart: {
              id: "apexchart-example",
            },
            xaxis: {
              categories: [
                "Sep",
                "Oct",
                "Nov",
                "Dec",
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
              ],
              title: {
                text: "Chat Index",
              },
            },
          },
          series: [
            {
              name: "All Chats",
              data: Array.from(
                { length: AllMessages },
                () => Math.floor(Math.random() * 2) + AllMessages
              ),
            },
          ],
        });
      });
    });
  }, [AllMessages]);

  if (!state) {
    // Return loading state or placeholder while the chart is being loaded
    return <div>Loading chart...</div>;
  }

  const Chart = state ? require("react-apexcharts").default : null;

  return (
    <div>
      {Chart && (
        <Chart
          options={state.options}
          series={state.series}
          type="area"
          //   width="300"
          height={400}
          style={{ width: "100%" }}
        />
      )}
    </div>
  );
};

export default MessageChart;
