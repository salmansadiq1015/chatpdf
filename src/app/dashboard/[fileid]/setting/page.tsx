import Layout from "@/components/layout/Layout";
import { Loader2 } from "lucide-react";
import React from "react";

export default function page() {
  return (
    <Layout>
      <div className="w-full min-h-screen py-[3rem] sm:py-[1rem] px-3 ">
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl text-blue-500 font-semibold">Settings</h1>
          <p className="text-zinc-500 text-sm"></p>
        </div>
        <div
          className="w-full"
          style={{ width: "100%", height: "1px", background: "#ccc" }}
        ></div>
        <div className="w-full min-h-[50vh] mt-[2rem] flex flex-col items-center justify-center gap-4">
          <h2 className="text-2xl text-blue-500 font-semibold">
            Development Mode
            <span className="animate-pulse inline-block">...</span>
          </h2>
          <span>
            <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
          </span>
        </div>
      </div>
    </Layout>
  );
}
