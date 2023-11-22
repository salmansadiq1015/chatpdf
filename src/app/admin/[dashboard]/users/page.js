import React from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { db } from "@/db";
import { FaUserCircle } from "react-icons/fa";
import UsersAnalytics from "@/components/AdminSidebar/UsersAnalytics";

export default async function page() {
  const AllUser = await db.user.findMany();
  console.log(AllUser.length);
  return (
    <AdminLayout>
      <div
        className="w-full min-h-screen py-[3rem] sm:py-[1rem] px-3 "
        style={{
          background: "#111",
          color: "#fff",
          borderLeft: "2px solid #ccc",
        }}
      >
        <h1 className="text-3xl text-white font-semibold ">All Users</h1>
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mt-[2rem]">
          {AllUser?.map((user, i) => (
            <div
              className=" flex flex-col gap-6 items-center justify-center py-[1.5rem] px-3 rounded-md cursor-pointer bg-white  w-full"
              key={i}
              style={{
                background:
                  "linear-gradient(to top right, #666 50%, yellow 50%)",
                border: "1px solid aqua",
              }}
            >
              <span>
                {" "}
                <FaUserCircle size="34" color="blue" />
              </span>
              <h3 className="text-black font-medium text-base ">
                {user?.email}
              </h3>
            </div>
          ))}
        </div>
        {/* Analytics */}
        <div className="flex flex-col gap-4 mt-8">
          <h2 className="text-xl text-white font-semibold">Users Analytics</h2>
          <UsersAnalytics userLength={AllUser.length} />
        </div>
      </div>
    </AdminLayout>
  );
}
