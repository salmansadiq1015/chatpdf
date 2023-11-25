import Layout from "@/components/layout/Layout";
import React from "react";

export default function page() {
  return (
    <Layout>
      <div className="w-full min-h-screen py-[3rem] sm:py-[1rem] px-3 ">
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl text-blue-500 font-semibold">Links</h1>
          <p className="text-zinc-500 text-sm">
            Web pages act as training material for your chatbot. You can manage
            links used for training the chatbot here.
          </p>
          <div
            className="w-full mt-8"
            style={{ height: "1px", background: "#ccc" }}
          ></div>
        </div>
        
      </div>
    </Layout>
  );
}
