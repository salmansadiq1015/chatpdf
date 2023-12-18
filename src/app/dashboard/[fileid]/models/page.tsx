"use client";
import React, { useEffect, useState } from "react";
import Layout from "@/components/layout/Layout";
import {
  ArrowRight,
  Code2Icon,
  ImageIcon,
  MessageSquare,
  Music,
  VideoIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

// import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

const tools = [
  {
    label: "Conversation Generation",
    icon: MessageSquare,
    color: "text-blue-600",
    bgColor: "bg-blue-500/10",
    href: "conversation",
  },

  {
    label: "Image Generation",
    icon: ImageIcon,
    color: "text-pink-700",
    bgColor: "bg-pink-500/10",
    href: "image",
  },
  {
    label: "Code Generation",
    icon: Code2Icon,
    color: "text-orange-700",
    bgColor: "bg-orange-500/10",
    href: "code",
  },
  // {
  //   label: "Video Generation",
  //   icon: VideoIcon,
  //   color: "text-green-700",
  //   bgColor: "bg-green-500/10",
  //   href: "video",
  // },
  // {
  //   label: "Music Generation",
  //   icon: Music,
  //   color: "text-violet-700",
  //   bgColor: "bg-violet-500/10",
  //   href: "music",
  // },
];

export default function Models() {
  const [id, setId] = useState("");
  useEffect(() => {
    const pathArray = window.location.pathname.split("/");
    const fileIdFromPath = pathArray[2]; // Assuming fileId is the third part of the path

    setId(fileIdFromPath);

    // exlint-disable-next-line
  }, []);
  console.log("ID:", id);
  return (
    <Layout>
      <div className="w-full min-h-screen px-3 py-[3rem] sm:py-3">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3">
            <h1 className="text-2xl md:text-3xl font-bold text-center">
              Explore the magic of AI with the brilliance of ChatDoc.ai
            </h1>
            <p className="text-sm text-center md:text-lg text-zinc-500 bgv">
              Engage with brilliant AI, Unleash the magic of intelligent <br />
              conversations. Elevate your experience now!
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
            {tools?.map((tool) => (
              <Link href={`/dashboard/${id}/${tool.href}`} key={tool.href}>
                <div
                  className="border border-zinc-300 rounded-md p-4 cursor-pointer shadow-md 
                hover:shadow-xl transition"
                >
                  <div
                    className="flex items-center justify-between gap-3
                "
                  >
                    <div className="flex items-center gap-2">
                      <div className={cn("p-2 rounded-md w-fit", tool.bgColor)}>
                        <tool.icon className={cn("w-8 h-8", tool.color)} />
                      </div>
                      <h3 className="text-lg font-medium text-zinc-800 ">
                        {tool.label}
                      </h3>
                    </div>

                    <div className="flex items-center justify-end">
                      <ArrowRight className="text-zinc-700 h-5 w-5 float-right" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
