"use client";
import React, { useEffect, useState } from "react";
import { BsFillLightningChargeFill } from "react-icons/bs";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import Link from "next/link";

export default function Upgrade({
  file,
  subscription,
}: {
  file: number;
  subscription: boolean;
}) {
  const [isShow, setIsShow] = useState(false);

  return (
    <>
      {!isShow && (
        <div
          className="p-3 rounded-full text-white shadow-lg hover:shadow-2xl border border-zinc-300 bg-green-500 "
          onClick={() => setIsShow(true)}
          // style={{display:}}
        >
          <BsFillLightningChargeFill />
        </div>
      )}
      {isShow && (
        <div className="w-[12.8rem]  bg-zinc-100 border border-zinc-300 rounded-sm shadow-lg hover:shadow-2xl py-3 px-2 relative">
          <IoIosCloseCircleOutline
            className="absolute top-2 right-2 text-pink-600"
            size="24"
            onClick={() => setIsShow(false)}
          />
          <div className="flex flex-col items-center justify-center gap-3">
            <h3 className="text-lg text-blue-600 text-center font-semibold">
              Free Plan
            </h3>
            <Link href={subscription ? "/dashboard/billing" : "/pricing"}>
              <Button className="flex items-center gap-2 ">
                {subscription ? "Manage Sub" : "Upgrade"}{" "}
                <BsFillLightningChargeFill />
              </Button>
            </Link>
          </div>
          <div className=" mt-4 flex flex-col gap-2">
            <p>
              {file}/{subscription ? "100" : "3"} knowledge sources
            </p>
            {subscription ? (
              <Progress
                indicatorColor={file === 3 ? "bg-red-500" : ""}
                value={file}
                className="h-2 w-full bg-zinc-200"
              />
            ) : (
              <Progress
                indicatorColor={file === 3 ? "bg-red-500" : ""}
                value={file === 3 ? 100 : file * (100 / 3)}
                className="h-2 w-full bg-zinc-200"
              />
            )}
          </div>
        </div>
      )}
    </>
  );
}
