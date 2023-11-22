import React from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { db } from "@/db";
import { FaSackDollar } from "react-icons/fa6";
import MoneyChart from "@/components/AdminSidebar/MoneyChart";
import Image from "next/image";

export default async function page() {
  const AllUser = await db.user.findMany();

  const totalAmount = AllUser.reduce((acc, user) => {
    // Assuming a default price of $15 if stripePriceId is available
    const userAmount = user.stripePriceId ? 15 : 0;
    return acc + userAmount;
  }, 0);

  return (
    <AdminLayout>
      <div
        className="w-full min-h-screen py-[3rem] sm:py-[1rem] px-3 "
        style={{ background: "#111", color: "#fff" }}
      >
        <h1 className="text-3xl font-semibold text-white">Subscription</h1>

        <div className="mt-[2rem] grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {AllUser?.map((user, i) => (
            <div
              className=" flex flex-col gap-6 items-center justify-center py-[1.5rem] px-3 rounded-md cursor-pointer bg-white  w-full"
              key={i}
              style={{
                background: "linear-gradient(to top right, #666 , orangered )",
                border: "1px solid aqua",
              }}
            >
              <span>
                {" "}
                <FaSackDollar size="34" color="blue" />
              </span>
              <h3 className="text-black font-medium text-base ">
                {user?.email}
              </h3>
              <div className=" flex items-center  gap-4">
                <b className="text-black">Subscription:</b>
                {!user?.stripePriceId ? (
                  <Image
                    src="/unsuccess.png"
                    alt="unsuccess"
                    width="32"
                    height="32"
                    className="w-[2rem] h-[2rem]"
                  />
                ) : (
                  <Image
                    src="/success1.png"
                    alt="unsuccess"
                    width="32"
                    height="32"
                    className="w-[2rem] h-[2rem]"
                  />
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-4 mt-4">
          <h1 className="text-3xl font-semibold text-white">Analytics</h1>
          <MoneyChart totalAmount={totalAmount} />
        </div>
      </div>
    </AdminLayout>
  );
}
