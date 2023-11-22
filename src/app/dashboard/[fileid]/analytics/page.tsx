import React from "react";
import Layout from "@/components/layout/Layout";
import { db } from "@/db";
import LinesChart from "@/components/LinesChart";
import MessageChart from "@/components/MessageChart";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export default async function Analytics() {
  const { getUser } = getKindeServerSession();
  const user = getUser();

  const allFiles = await db.file.findMany();
  const AllUser = await db.user.findMany();
  // Get Total User messages
  const totalMessages = await db.message.findMany();

  const uploadedFiles = await db.file.findMany({
    where: {
      userId: user.id,
    },
  });

  const fileLength = allFiles.length;

  return (
    <Layout>
      <div
        className="w-full min-h-screen px-2"
        style={{ borderLeft: "2px solid #777" }}
      >
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
          <MessageChart AllMessages={totalMessages.length} />
        </div>
      </div>
    </Layout>
  );
}
