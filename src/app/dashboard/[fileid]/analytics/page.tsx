import React from "react";
import Layout from "@/components/layout/Layout";
import { db } from "@/db";
import LinesChart from "@/components/LinesChart";
import MessageChart from "@/components/MessageChart";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import PieChart from "@/components/PieChart";
import PolarAreaChart from "@/components/PolarArea";
import { getUserSubscriptionPlan } from "@/lib/stripe";

export default async function Analytics() {
  const { getUser } = getKindeServerSession();
  const user = getUser();

  const allFiles = await db.file.findMany();
  const AllUser = await db.user.findMany();
  // Get Total User messages
  const totalMessages = await db.message.findMany({
    where: {
      userId: user.id,
    },
  });

  const uploadedFiles = await db.file.findMany({
    where: {
      userId: user.id,
    },
  });

  const fileLength = allFiles.length;

  const plan = await getUserSubscriptionPlan();
  const totalQuota = plan.quota || 10;

  return (
    <Layout>
      <div className="w-full min-h-screen px-2">
        <div className="py-[3rem] sm:py-3 px-2"></div>
        <h2
          className="text-3xl text-blue-600 font-semibold "
          style={{ textShadow: "-1px 1px 0px #888" }}
        >
          Files Analytics
        </h2>
        <div className="">
          <LinesChart
            fileLength={fileLength}
            AllUser={AllUser.length}
            UserFile={uploadedFiles.length}
          />
        </div>
        <h2
          className="text-3xl text-blue-600 font-semibold "
          style={{ textShadow: "-1px 1px 0px #888" }}
        >
          Chats Analytics
        </h2>
        <div className="">
          <MessageChart AllMessages={totalMessages} />
        </div>

        {/* User Statics */}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-[3rem] ">
          <div
            className="w-full mt-[4rem] md:mt-[4rem] max-h-[17.5rem] flex flex-col py-[.5rem] px-4
             rounded-lg shadow-xl bg-slate-200 hover:shadow-2xl transition-all "
          >
            <h1
              className="text-xl text-green-950 font-bold"
              style={{ textShadow: "-1px 1px 0px #ccc" }}
            >
              Messages Analytics
            </h1>
            <div
              className="w-full h-[19rem] mt-3 flex  items-center justify-center"
              style={{
                filter: "drop-shadow(0.3rem 0.3rem 0.2rem rgba(0, 0, 0, 0.5))",
              }}
            >
              <PieChart totalMessages={totalMessages.length} />
            </div>
          </div>

          {/*  */}
          <div
            className="w-full mt-[4rem] md:mt-[4rem] max-h-[17.5rem] flex flex-col py-[.5rem] px-4
             rounded-lg shadow-xl bg-slate-200 hover:shadow-2xl transition-all "
          >
            <h1
              className="text-xl text-green-950 font-bold"
              style={{ textShadow: "-1px 1px 0px #ccc" }}
            >
              Files Analytics
            </h1>
            <div
              className="w-full h-[19rem] mt-3 flex  items-center justify-center"
              style={{
                filter: "drop-shadow(0.3rem 0.3rem 0.2rem rgba(0, 0, 0, 0.5))",
              }}
            >
              <PolarAreaChart
                uploadedFiles={uploadedFiles.length}
                totalQuota={totalQuota}
              />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
