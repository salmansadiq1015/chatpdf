"use client";

import React, { useEffect, useState } from "react";

export default function UsersAnalytics({ userLength, totalUsers }) {
  const [Chart, setChart] = useState(null);
  const [state, setState] = useState({
    options: {
      chart: {
        id: "basic-bar",
        stacked: true,
      },
      colors: ["red"],
      xaxis: {
        categories: [], // Initialize with an empty array
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
    // Extracting and formatting createdAt values from users
    const dateOptions = { day: "numeric", month: "short" };
    const createdAtValues = totalUsers?.map((user) =>
      new Date(user.createdAt).toLocaleString("default", dateOptions)
    );

    // Update x-axis categories based on createdAt values
    setState((prevState) => ({
      ...prevState,
      options: {
        ...prevState.options,
        xaxis: {
          ...prevState.options.xaxis,
          categories: createdAtValues,
        },
      },
    }));

    // Update series data based on userLength
    const newData = Array.from({ length: userLength }, (_, index) => index + 1);

    setState((prevState) => ({
      ...prevState,
      series: [
        {
          name: "series-1",
          data: newData,
        },
      ],
    }));
  }, [userLength, totalUsers]);

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

// ----------------Before---------->

// import React, { useEffect, useState } from "react";

// export default function UsersAnalytics({ userLength, totalUsers }) {
//   const [Chart, setChart] = useState(null);
//   const [state, setState] = useState({
//     options: {
//       chart: {
//         id: "basic-bar",
//         stacked: true,
//       },
//       colors: ["red"],

//       xaxis: {
//         categories: [
//           "Sep",
//           "Oct",
//           "Nov",
//           "Dec",
//           "Jan",
//           "Feb",
//           "Mar",
//           "Apr",
//           "May",
//           "Jun",
//           "Jul",
//           "Aug",
//         ],
//       },
//     },
//     series: [
//       {
//         name: "series-1",
//         data: [], // Initialize with an empty array
//       },
//     ],
//   });

//   useEffect(() => {
//     let isMounted = true;

//     import("react-apexcharts").then((module) => {
//       if (isMounted) {
//         setChart(() => module.default);
//       }
//     });

//     return () => {
//       isMounted = false;
//     };
//   }, []); // Empty dependency array ensures that this effect runs once, similar to componentDidMount

//   useEffect(() => {
//     // Update series data based on userLength
//     const newData = Array.from({ length: userLength }, (_, index) => index + 1);

//     setState((prevState) => ({
//       ...prevState,
//       series: [
//         {
//           name: "series-1",
//           data: newData,
//         },
//       ],
//     }));
//   }, [userLength]);

//   return (
//     <div className="">
//       {Chart && state.options && state.series && (
//         <Chart
//           options={state.options}
//           series={state.series}
//           type="area"
//           className="text-black w-full"
//         />
//       )}
//     </div>
//   );
// }
