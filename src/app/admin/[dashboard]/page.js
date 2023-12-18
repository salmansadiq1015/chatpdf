import AdminLayout from "@/components/layout/AdminLayout";
import { db } from "@/db";
import React from "react";
import { FaUsers } from "react-icons/fa";
import { IoDocumentsSharp } from "react-icons/io5";
import UsersAnalytics from "@/components/AdminSidebar/UsersAnalytics";
import FilesAnalytics from "@/components/AdminSidebar/FilesAnalytics";
import MoneyChart from "@/components/AdminSidebar/MoneyChart";
import { FaSackDollar } from "react-icons/fa6";

export default async function page() {
  const AllUser = await db.user.findMany();
  const uploadedFiles = await db.file.findMany();

  const totalAmount = AllUser.reduce((acc, user) => {
    // Assuming a default price of $15 if stripePriceId is available
    const userAmount = user.stripePriceId ? 15 : 0;
    return acc + userAmount;
  }, 0);

  return (
    <AdminLayout>
      <div
        className="w-full min-h-screen  text-white py-[3rem] sm:py-[1rem]  px-2"
        style={{
          background: "#111",
          borderLeft: "1px solid #ccc",
          borderLeft: "2px solid #cccs",
        }}
      >
        <h1 className="text-white text-3xl font-semibold">Dashboard</h1>
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 mt-[2rem] md:grid-cols-3 lg:grid-cols-4 gap-3">
          <div
            className=" rounded-md flex flex-col gap-4 shadow-md hover:shadow-2xl transition-all 
          cursor-pointer text-white py-4 px-4"
            style={{
              background: "linear-gradient(to bottom, #3498db, #2ecc71)",
            }}
          >
            <div className=" flex items-center justify-between">
              <h2 className="text-white text-2xl font-semibold">Users</h2>
              <FaUsers size="25" color="white" />
            </div>
            <h1 className="mt-[2rem] text-center w-full font-semibold text-2xl">
              {AllUser.length}
            </h1>
          </div>
          {/* 2 */}
          <div
            className=" rounded-md flex flex-col gap-4 shadow-md hover:shadow-2xl transition-all 
          cursor-pointer text-white py-4 px-4"
            style={{
              background:
                "linear-gradient(to bottom, rgb(255, 0, 0), rgb(140, 0, 255))",
            }}
          >
            <div className=" flex items-center justify-between">
              <h2 className="text-white text-2xl font-semibold">Files</h2>
              <IoDocumentsSharp size="25" color="white" />
            </div>
            <h1 className="mt-[2rem] text-center w-full font-semibold text-2xl">
              {uploadedFiles.length}
            </h1>
          </div>
          {/* 3 */}
          <div
            className=" rounded-md flex flex-col gap-4 shadow-md hover:shadow-2xl transition-all 
          cursor-pointer text-white py-4 px-4"
            style={{
              background:
                "linear-gradient(to bottom, rgb(255, 0, 140), rgb(0, 255, 195)",
            }}
          >
            <div className=" flex items-center justify-between">
              <h2 className="text-white text-2xl font-semibold">
                Total Amount
              </h2>
              <FaSackDollar size="25" color="white" />
            </div>
            <h1 className="mt-[2rem] text-center w-full font-semibold text-2xl">
              $ {totalAmount}
            </h1>
          </div>
        </div>

        {/* ----------Analytics---- */}
        <div className="w-full flex flex-col gap-4 mt-6">
          <h1 className="text-white text-3xl font-semibold">Analytics</h1>
          <div className="w-full  grid grid-cols-1 sm:grid-cols-2">
            <div className="flex flex-col gap-3">
              <h2 className="text-xl text-white font-semibold">
                Users Analytics
              </h2>

              <UsersAnalytics
                userLength={AllUser.length}
                totalUsers={AllUser}
              />
            </div>

            <div className="flex flex-col gap-3">
              <h2 className="text-xl text-white font-semibold">
                Files Analytics
              </h2>
              <FilesAnalytics AllFiles={uploadedFiles} />
            </div>

            <div className="flex flex-col gap-3">
              <h2 className="text-xl text-white font-semibold">
                Amount Analytics
              </h2>
              <MoneyChart totalAmount={totalAmount} />
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
