"use client";
import React, { useEffect, useState } from "react";

export default function MoneyChart({ totalAmount }) {
  const [Chart, setChart] = useState(null);
  const [state, setState] = useState({
    options: {
      chart: {
        id: "area-chart",
        stacked: true,
        toolbar: {
          show: false,
        },
      },
      colors: ["#4CAF50", "yellow"], // Green and Blue colors
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
      },
      fill: {
        opacity: 0.5, // Adjust the opacity of the area chart
        type: "solid", // You can also use "gradient" for a gradient fill
      },
      dataLabels: {
        enabled: false, // Disable data labels to keep the chart clean
      },
      stroke: {
        curve: "smooth", // Smooth curve for the area chart
      },
      grid: {
        borderColor: "#f1f1f1", // Color of the grid lines
      },
    },
    series: [
      {
        name: "Total Users",
        data: [], // Initialize with an empty array
      },
      {
        name: "Total Amount",
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
    // Calculate the total users based on a fixed value for each user's earnings
    const earningsPerUser = 15; // Adjust this value based on your requirement
    const totalUsers = Math.floor(totalAmount / earningsPerUser);

    // Create an array representing the total users for each category
    const totalUsersArray = Array(state.options.xaxis.categories.length).fill(
      totalUsers
    );

    // Create an array representing the total amount for each category
    const totalAmountArray = Array(state.options.xaxis.categories.length).fill(
      totalAmount
    );

    setState((prevState) => ({
      ...prevState,
      series: [
        {
          name: "Total Users",
          data: totalUsersArray,
        },
        {
          name: "Total Amount",
          data: totalAmountArray,
        },
      ],
    }));
  }, [totalAmount, state.options.xaxis.categories.length]);

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
