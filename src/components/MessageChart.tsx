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

const MessageChart = ({ AllMessages }: { AllMessages: any }) => {
  const [state, setState] = useState<ChartState | null>(null);

  useEffect(() => {
    if (AllMessages && AllMessages.length > 0) {
      // Extract relevant data from AllMessages
      const messageCounts = AllMessages.map((message: any) => ({
        createdAt: new Date(message.createdAt).toLocaleString(), // Assuming createdAt is a date field
      }));

      // Group messageCounts by month and count messages in each month
      const groupedMessages = messageCounts.reduce((acc: any, message: any) => {
        const month = message.createdAt.split(",")[0];
        acc[month] = (acc[month] || 0) + 1;
        return acc;
      }, {});

      // Generate x-axis categories and series data
      const categories = Object.keys(groupedMessages);
      const seriesData = categories.map(
        (category) => groupedMessages[category]
      );

      // Update the state with the new data
      setState({
        options: {
          chart: {
            id: "apexchart-example",
          },
          xaxis: {
            categories,
            title: {
              text: "Chat Index",
            },
          },
        },
        series: [
          {
            name: "All Chats",
            data: seriesData,
          },
        ],
      });
    }
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
          height={400}
          style={{ width: "100%" }}
        />
      )}
    </div>
  );
};

export default MessageChart;

// -------------------------------------------->

// import React, { useState, useEffect } from "react";

// interface ChartState {
//   options: {
//     chart: {
//       id: string;
//     };
//     xaxis: {
//       categories: string[];
//       title: {
//         text: string;
//       };
//     };
//   };
//   series: { name: string; data: number[] }[];
// }

// const MessageChart = ({ AllMessages }: { AllMessages: any }) => {
//   const messageLength = AllMessages.length;
//   const [state, setState] = useState<ChartState | null>(null);

//   useEffect(() => {
//     // Dynamic import of required libraries
//     import("react-apexcharts").then((ApexCharts) => {
//       import("apexcharts").then((ApexChartsJS) => {
//         // Now you can use ApexCharts and ApexChartsJS
//         setState({
//           options: {
//             chart: {
//               id: "apexchart-example",
//             },
//             xaxis: {
//               categories: [
//                 "Sep",
//                 "Oct",
//                 "Nov",
//                 "Dec",
//                 "Jan",
//                 "Feb",
//                 "Mar",
//                 "Apr",
//                 "May",
//                 "Jun",
//                 "Jul",
//                 "Aug",
//               ],
//               title: {
//                 text: "Chat Index",
//               },
//             },
//           },
//           series: [
//             {
//               name: "All Chats",
//               data: Array.from(
//                 { length: messageLength },
//                 () => Math.floor(Math.random() * 1) + messageLength
//               ),
//             },
//           ],
//         });
//       });
//     });
//   }, [messageLength]);

//   if (!state) {
//     // Return loading state or placeholder while the chart is being loaded
//     return <div>Loading chart...</div>;
//   }

//   const Chart = state ? require("react-apexcharts").default : null;

//   return (
//     <div>
//       {Chart && (
//         <Chart
//           options={state.options}
//           series={state.series}
//           type="area"
//           //   width="300"
//           height={400}
//           style={{ width: "100%" }}
//         />
//       )}
//     </div>
//   );
// };

// export default MessageChart;
