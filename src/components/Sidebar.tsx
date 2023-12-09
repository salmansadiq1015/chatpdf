"use client";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { BiSolidDashboard } from "react-icons/bi";
import { PiFilesFill } from "react-icons/pi";
import { LiaCogSolid } from "react-icons/lia";
import { LuHistory } from "react-icons/lu";
import { BiLink } from "react-icons/bi";
import { IoClose } from "react-icons/io5";
import { DiGoogleAnalytics } from "react-icons/di";

export default function Sidebar({ isShow }: { isShow: any }) {
  const [id, setId] = useState("");

  useEffect(() => {
    // Extract fileId from the URL path
    const pathArray = window.location.pathname.split("/");
    const fileIdFromPath = pathArray[2]; // Assuming fileId is the third part of the path

    // Update the state with the fileId
    setId(fileIdFromPath);

    // exlint-disable-next-line
  }, []);

  const isLinkActive = (href: any) => {
    if (typeof window !== "undefined") {
      // Check if the current path matches the href
      return window.location.pathname === href;
    }

    return false;
  };

  return (
    <div className=" w-full min-h-screen ">
      <div
        className=" mb-4 mt-3 w-full flex items-center md:hidden  justify-end px-4"
        onClick={() => isShow(false)}
      >
        <IoClose size="28" color="blue" />
      </div>
      <div className=" py-6 px-1 ">
        <Link
          id="dashboard_btn"
          href="/dashboard"
          className="flex items-center gap-1 rounded-md py-[6px] px-2 border  border-zinc-200 text-black
             hover:bg-blue-500 hover:text-white hover:shadow-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5 " /> Dashboard
        </Link>

        <div className="w-full bg-zinc-400 h-[1px] mt-6"></div>

        <div className=" mt-6">
          <nav className="flex flex-col gap-4">
            <Link
              id="overview"
              href={`/dashboard/${id}`}
              className={`flex gap-1 items-center text-black rounded-md py-[6px] px-2 border  border-zinc-200
              hover:bg-blue-500 hover:text-white hover:shadow-lg transition-colors ${
                isLinkActive(`/dashboard/${id}`) ? "bg-blue-500 text-white" : ""
              }`}
            >
              <BiSolidDashboard size="22" />
              Overview
            </Link>
            {/*  */}
            <Link
              id="knowledge"
              href={`/dashboard/${id}/files`}
              className={`flex gap-1 items-center text-black rounded-md py-[6px] px-2 border  border-zinc-200
              hover:bg-blue-500 hover:text-white hover:shadow-lg transition-colors ${
                isLinkActive(`/dashboard/${id}/files`)
                  ? "bg-blue-500 text-white"
                  : ""
              }`}
            >
              <PiFilesFill size="22" />
              Knowledge Base
            </Link>
            {/*  */}
            <Link
              id="history"
              href={`/dashboard/${id}/history`}
              className={`flex gap-1 items-center text-black rounded-md py-[6px] px-2 border  border-zinc-200
              hover:bg-blue-500 hover:text-white hover:shadow-lg transition-colors ${
                isLinkActive(`/dashboard/${id}/history`)
                  ? "bg-blue-500 text-white"
                  : ""
              }`}
            >
              <LuHistory size="22" />
              Chat History
            </Link>
            {/*  */}
            <Link
              id="links"
              href={`/dashboard/${id}/links`}
              className={`flex gap-1 items-center text-black rounded-md py-[6px] px-2 border  border-zinc-200
              hover:bg-blue-500 hover:text-white hover:shadow-lg transition-colors ${
                isLinkActive(`/dashboard/${id}/links`)
                  ? "bg-blue-500 text-white"
                  : ""
              }`}
            >
              <BiLink size="22" /> Links
            </Link>
            {/*  */}
            <Link
              id="analytics"
              href={`/dashboard/${id}/analytics`}
              className={`flex gap-1 items-center text-black rounded-md py-[6px] px-2 border  border-zinc-200
              hover:bg-blue-500 hover:text-white hover:shadow-lg transition-colors ${
                isLinkActive(`/dashboard/${id}/analytics`)
                  ? "bg-blue-500 text-white"
                  : ""
              }`}
            >
              <DiGoogleAnalytics size="22" />
              Analytics
            </Link>
            {/*  */}
            <Link
              id="setting"
              href={`/dashboard/${id}/setting`}
              className={`flex gap-1 items-center text-black rounded-md py-[6px] px-2 border  border-zinc-200
              hover:bg-blue-500 hover:text-white hover:shadow-lg transition-colors ${
                isLinkActive(`/dashboard/${id}/setting`)
                  ? "bg-blue-500 text-white"
                  : ""
              }`}
            >
              <LiaCogSolid size="22" />
              Setting
            </Link>
          </nav>
        </div>
      </div>
    </div>
  );
}
