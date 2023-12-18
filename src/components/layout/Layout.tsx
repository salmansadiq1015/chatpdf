"use client";
import React, { useState } from "react";
import Sidebar from "../Sidebar";
import { AiOutlineBars } from "react-icons/ai";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isShow, setIsShow] = useState(false);
  return (
    <div className=" relative flex flex-1">
      <div
        className="absolute top-5 left-3 z-40 lg:hidden block"
        onClick={() => setIsShow(!isShow)}
      >
        <AiOutlineBars size="28" color="blue" />
      </div>
      {isShow && (
        <div className=" absolute top-0 z-35 flex-[.3] z-40 bg-white min-h-screen ">
          <Sidebar isShow={setIsShow} />
        </div>
      )}
      <div className=" flex-[.2] z-40 hidden lg:block min-h-screen">
        <Sidebar isShow={setIsShow} />
      </div>
      <main className="flex-1 pl-4" style={{ borderLeft: "1px solid #999" }}>
        {children}
      </main>
    </div>
  );
}
