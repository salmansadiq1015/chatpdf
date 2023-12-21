"use client";
import { cn } from "@/lib/utils";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { FaCopy } from "react-icons/fa";

export default function Deploy({ userId }: { userId: string | null }) {
  const [isCopied, setIsCopied] = useState(false);
  const [iframeCopy, setIframeCopy] = useState(false);

  const handleCopyText = () => {
    const textToCopy = `https://chatpdf-eosin.vercel.app/embed/${userId}`;
    navigator.clipboard.writeText(textToCopy);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
      toast.success("Copied the clipboard", {
        position: "top-center",
        theme: "dark",
      });
    }, 2000);
  };

  const handleCopyIframe = () => {
    const textToCopy = `<iframe style="width: 400px; height: 520px;  border-radius: .5rem;" src=https://chatpdf-eosin.vercel.app/embed/kp_29e735dde5f4494496c48a3becfdf113></iframe>`;
    navigator.clipboard.writeText(textToCopy);
    setIframeCopy(true);
    setTimeout(() => {
      setIframeCopy(false);
      toast.success("Copied the clipboard", {
        position: "top-center",
        theme: "dark",
      });
    }, 2000);
  };
  return (
    <div className="w-full min-h-screen py-12 lg:py-5 px-2 sm:px-4">
      <div className="flex flex-col gap-3">
        <h2
          className="text-xl sm:text-3xl text-black font-semibold "
          style={{ textShadow: "-1px 1px 0px #999" }}
        >
          Deploy / Share
        </h2>
        <p className="text-sm text-zinc-600 ">
          View instructions for deploying your chatbot on your websites.
        </p>
      </div>
      <div className="w-full bg-zinc-100/10 border shadow-md hover:shadow-xl border-zinc-200 py-4 px-2 rounded-lg cursor-pointer mt-6">
        <div className="flex flex-col gap-1">
          <h3 className="text-xl font-medium text-zinc-800">Share your bot</h3>
          <p className="text-sm  text-zinc-500">
            You can share your bot with anyone by sending them the link below.
          </p>
          <div
            className="w-full bg-zinc-100/10 border flex items-center justify-between shadow-md
           hover:shadow-xl border-zinc-200 py-3 px-3 mt-2"
          >
            <p className="text-sm font-normal sm:text-base sm:font-medium  text-zinc-600">
              https://chatpdf-eosin.vercel.app/embed/{userId}
            </p>
            <div
              onClick={handleCopyText}
              className={cn(
                "ml-2 bg-blue-500 text-white px-2 py-1 rounded focus:outline-none w-[2rem] cursor-pointer ",
                {
                  "opacity-70 cursor-not-allowed": isCopied,
                }
              )}
            >
              <FaCopy />
            </div>
          </div>
        </div>
      </div>
      {/* ----I Frame---- */}

      <div
        className="w-full bg-zinc-100/10 border shadow-md hover:shadow-xl
       border-zinc-200 py-4 px-2 rounded-lg cursor-pointer mt-8"
      >
        <div className="flex flex-col gap-1">
          <h3 className="text-xl font-medium text-zinc-800">Using Iframe</h3>
          <p className="text-sm  text-zinc-500">
            If you wish to embed the chat window directly into your website you
            can use the iframe snippet shown below.
          </p>
          <div
            className="w-full bg-zinc-100/10 border flex items-center justify-between shadow-md 
          hover:shadow-xl border-zinc-200 py-3 px-3 mt-2"
          >
            <p className="text-sm font-normal sm:text-base sm:font-medium text-blue-600">
              &lt;<span className="text-pink-600">iframe</span>{" "}
              style=&quot;width: 400px; height: 600px;&quot; src=
              {`https://chatpdf-eosin.vercel.app/embed/${userId}`}
              &gt;&lt;<span className="text-pink-600">/iframe</span>&gt;
            </p>
            <div
              onClick={handleCopyIframe}
              className={cn(
                "ml-2 bg-blue-500 text-white px-2 py-1 rounded focus:outline-none w-[2rem] cursor-pointer ",
                {
                  "opacity-70 cursor-not-allowed": iframeCopy,
                }
              )}
            >
              <FaCopy />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
