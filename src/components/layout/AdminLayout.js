"use client";
import React from "react";
import AdminSidebar from "../AdminSidebar/AdminSidebar";
import { useState } from "react";
import { AiOutlineBars } from "react-icons/ai";

export default function AdminLayout({ children }) {
  const [isShow, setIsShow] = useState(false);

  return (
    <div className="w-full min-h-screen relative flex flex-1">
      <div
        className="absolute top-5 left-3 z-40 md:hidden block"
        onClick={() => setIsShow(!isShow)}
      >
        <AiOutlineBars size="28" color="blue" />
      </div>
      {isShow && (
        <div
          className=" absolute top-0  flex-[.3] z-40  min-h-screen "
          style={{ background: "#222" }}
        >
          <AdminSidebar setIsShow={setIsShow} />
        </div>
      )}
      <div
        className="flex-[.2] z-40 hidden md:block min-h-screen "
        style={{ background: "#222" }}
      >
        <AdminSidebar setIsShow={setIsShow} />
      </div>
      <main className="flex-1">{children}</main>
    </div>
  );
}
