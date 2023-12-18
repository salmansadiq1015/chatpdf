"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { MdDashboard } from "react-icons/md";
import { FaUsers } from "react-icons/fa";
import { FaCcMastercard } from "react-icons/fa";
import { IoIosHome } from "react-icons/io";
import { IoClose } from "react-icons/io5";

export default function AdminSidebar({ setIsShow }) {
  const [id, setId] = useState("");

  useEffect(() => {
    // Extract fileId from the URL path
    const pathArray = window.location.pathname.split("/");
    const fileIdFromPath = pathArray[2]; // Assuming fileId is the third part of the path

    // Update the state with the fileId
    setId(fileIdFromPath);

    // exlint-disable-next-line
  }, []);

  const isLinkActive = (href) => {
    if (typeof window !== "undefined") {
      // Check if the current path matches the href
      return window.location.pathname === href;
    }

    return false;
  };

  return (
    <div className=" w-full min-h-screen  bg-zinc-900 text-white">
      <div
        className=" mb-4 mt-3 w-full flex items-center md:hidden  justify-end px-4"
        onClick={() => setIsShow(false)}
      >
        <IoClose size="28" color="blue" />
      </div>
      <div className=" py-6 px-1 min-h-screen bg-zinc-900">
        <Link
          href="/"
          className={`flex gap-1 items-center text-white rounded-md py-[6px] px-2 border  border-zinc-200
          hover:bg-blue-500 hover:text-white hover:shadow-lg transition-colors ${
            isLinkActive(`/`) ? "bg-blue-500 text-white" : ""
          }`}
        >
          <IoIosHome className="h-5 w-5 " /> Home
        </Link>

        <div className="w-full bg-zinc-400 h-[1px] mt-6"></div>

        <Link
          href="/admin/dashboard"
          className={`flex gap-1 items-center mt-4 text-white rounded-md py-[6px] px-2 border  border-zinc-200
          hover:bg-blue-500 hover:text-white hover:shadow-lg transition-colors ${
            isLinkActive(`/admin/dashboard`) ? "bg-blue-500 text-white" : ""
          }`}
        >
          <MdDashboard className="h-5 w-5 " /> Dashboard
        </Link>

        <div className=" mt-6">
          <nav className="flex flex-col gap-4">
            <Link
              href={`/admin/dashboard/users`}
              className={`flex gap-1 items-center text-white rounded-md py-[6px] px-2 border  border-zinc-200
              hover:bg-blue-500 hover:text-white hover:shadow-lg transition-colors ${
                isLinkActive(`/admin/dashboard/users`)
                  ? "bg-blue-500 text-white"
                  : ""
              }`}
            >
              <FaUsers size="22" />
              Users
            </Link>
            {/*  */}
            <Link
              href={`/admin/dashboard/subscription`}
              className={`flex gap-1 items-center text-white rounded-md py-[6px] px-2 border  border-zinc-200
              hover:bg-blue-500 hover:text-white hover:shadow-lg transition-colors ${
                isLinkActive(`/admin/dashboard/subscription`)
                  ? "bg-blue-500 text-white"
                  : ""
              }`}
            >
              <FaCcMastercard size="22" />
              Subscription
            </Link>
            {/*  */}
            {/* <Link
              href={`/dashboard/${id}/history`}
              className={`flex gap-1 items-center text-white rounded-md py-[6px] px-2 border  border-zinc-200
              hover:bg-blue-500 hover:text-white hover:shadow-lg transition-colors ${
                isLinkActive(`/dashboard/${id}/history`)
                  ? "bg-blue-500 text-white"
                  : ""
              }`}
            >
              <LuHistory size="22" />
              Chat History
            </Link> */}

            {/*  */}
          </nav>
        </div>
      </div>
    </div>
  );
}
