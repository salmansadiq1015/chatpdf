import Appearance from "@/components/Appearance";
import Layout from "@/components/layout/Layout";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import React from "react";

export default function page() {
  const { getUser } = getKindeServerSession();
  const user = getUser();

  return (
    <Layout>
      <div className="w-full min-h-screen py-[3rem] sm:py-[1rem] px-3 ">
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl text-blue-500 font-semibold">Appearance</h1>
          <p className="text-zinc-500 text-sm">
            You can customise the look and feel of your chatbot interface here.
          </p>
        </div>
        <div
          className="w-full mt-6"
          style={{ width: "100%", height: "1px", background: "#ccc" }}
        ></div>
        <Appearance userId={user.id} />
      </div>
    </Layout>
  );
}
