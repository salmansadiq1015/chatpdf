import Layout from "@/components/layout/Layout";
import React from "react";
import { db } from "@/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import UserMessages from "@/components/UserMessages";

export default async function page() {
  const { getUser } = getKindeServerSession();
  const user = getUser();

  const totalMessages = await db.message.findMany({
    where: {
      userId: user.id,
    },
  });

  return (
    <Layout>
      <div
        className="min-h-screen py-[3.5rem] sm:py-[1rem] px-2"
        style={{ borderLeft: "1px solid #999" }}
      >
        <div className="flex flex-col gap-4">
          <h2
            className="text-3xl text-blue-600 font-semibold "
            style={{ textShadow: "-1px 1px 0px #888" }}
          >
            History
          </h2>
          <p className=" text-zinc-500 w-[95%] sm:w-[80%] text-justify ">
            {" "}
            Effortlessly view and export the highlights of the engaging
            conversations that have taken place between your bot and the
            visitors to your website.
          </p>
          <div className="w-full h-[1px] bg-slate-300 mt-6"></div>
        </div>
        <div className=" py-[.5rem] p-2 rounded-md shadow-lg bg-white mt-4">
          <UserMessages totalMessages={totalMessages} />
        </div>
      </div>
    </Layout>
  );
}
