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
            Explore Your Journey
          </h2>
          <p className=" text-zinc-500 w-[95%] sm:w-[80%] text-justify ">
            {" "}
            Effortlessly view and export the highlights of the engaging
            conversations that have taken place between your bot and the
            visitors to your website.
          </p>
          <div className="w-full h-[1px] bg-slate-300 mt-6"></div>
        </div>
        {totalMessages.length !== 0 ? (
          <div className=" py-[.5rem] p-2 rounded-md shadow-lg bg-white mt-4">
            <UserMessages totalMessages={totalMessages} />
          </div>
        ) : (
          <div className="w-full min-h-[50vh] flex  items-center justify-center ">
            <div className="flex flex-col gap-3 w-[95%] sm:w-[80%] md:w-[60%] ">
              <p className="text-zinc-900 text-center text-lg font-medium">
                We couldn&apos;t find any history for your account yet, but
                don&apos;t worry! Your journey is just beginning.
              </p>
              <p className="text-zinc-600 text-center ">
                Start exploring and interacting with our platform to create your
                unique history. Whether it&apos;s discovering new content,
                making connections, or achieving milestones, every moment
                contributes to your story.
              </p>
              <p className="text-zinc-600 text-center ">
                Enjoy the adventure ahead, and make your mark on our community!
              </p>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
