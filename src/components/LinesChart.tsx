"use client";

import Chart from "react-apexcharts";

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

const LinesChart = ({
  fileLength,
  AllUser,
  UserFile,
}: {
  fileLength: number;
  AllUser: number;
  UserFile: number;
}) => {
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
                text: "File Index",
              },
            },
          },
          series: [
            {
              name: "All Users",
              data: Array.from(
                { length: fileLength },
                () => Math.floor(Math.random() * 100) + AllUser
              ),
            },
            {
              name: "Total Files",
              data: Array.from(
                { length: fileLength },
                () => Math.floor(Math.random() * 100) + fileLength
              ),
            },
            {
              name: "Your Uploads",
              data: Array.from(
                { length: fileLength },
                () => Math.floor(Math.random() * 100) + UserFile
              ),
            },
          ],
        });
      });
    });
  }, [fileLength, AllUser, UserFile]);

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

export default LinesChart;
