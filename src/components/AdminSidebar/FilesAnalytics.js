"use client";
import React, { useEffect, useState } from "react";

export default function FilesAnalytics({ AllFiles }) {
  const fileLength = AllFiles.length;
  const [Chart, setChart] = useState(null);
  const [state, setState] = useState({
    options: {
      chart: {
        id: "basic-bar",
      },
      xaxis: {
        categories: AllFiles.map((file) => {
          // Assuming createdAt is a Date object in your file
          const monthNames = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ];
          const createdAt = new Date(file.createdAt);
          return `${
            monthNames[createdAt.getMonth()]
          } ${createdAt.getFullYear()}`;
        }),
      },
    },
    series: [
      {
        name: "series-1",
        data: [], // Initialize with an empty array
      },
    ],
  });

  useEffect(() => {
    let isMounted = true;

    import("react-apexcharts").then((module) => {
      if (isMounted) {
        setChart(() => module.default);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []); // Empty dependency array ensures that this effect runs once, similar to componentDidMount

  useEffect(() => {
    // Update series data based on fileLength
    const newData = Array.from({ length: fileLength }, (_, index) => index + 1);

    setState((prevState) => ({
      ...prevState,
      series: [
        {
          name: "series-1",
          data: newData,
        },
      ],
    }));
  }, [fileLength]);

  return (
    <div className="">
      {Chart && state.options && state.series && (
        <Chart
          options={state.options}
          series={state.series}
          type="area"
          className="text-black w-full"
        />
      )}
    </div>
  );
}
