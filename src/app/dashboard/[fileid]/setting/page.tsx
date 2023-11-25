import Layout from "@/components/layout/Layout";
import React from "react";

export default function page() {
  return (
    <Layout>
      <div className="w-full min-h-screen py-[3rem] sm:py-[1rem] px-3 ">
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl text-blue-500 font-semibold">Settings</h1>
          <p className="text-zinc-500 text-sm"></p>
        </div>
      </div>
    </Layout>
  );
}
