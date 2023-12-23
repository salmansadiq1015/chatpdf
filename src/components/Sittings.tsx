"use client";
import axios from "axios";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Button } from "./ui/button";
import { IoSend } from "react-icons/io5";

export default function Sittings({ userId }: { userId: any }) {
  const [botName, setBotName] = useState<string | undefined>("");
  const [message, setMessage] = useState("");
  const [avatar, setAvatar] = useState("");
  const [color, setColor] = useState("#28a745");
  console.log(color);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!botName || !message || !avatar)
      return toast.error("Please fill all the fields", {
        position: "top-center",
      });
    try {
      const { data } = await axios.put(`/api/botSitting/${userId}`, {
        botName,
        avatar,
        message,
        color,
      });

      if (data.success) {
        toast.success("Bot setting updated successfully!", {
          position: "top-center",
        });
      } else {
        toast.success("Bot already exist!", {
          position: "top-center",
        });
      }
    } catch (error: any) {
      console.log(error);
      toast.error(
        "Bot already exist with this userId, Please update your bot.",
        { position: "top-center" }
      );
    }
  };

  //   Get Bot Imformation

  const getBotInformation = async () => {
    try {
      const { data } = await axios.get(`/api/botSitting/${userId}`);

      const responseData = data.response;

      setBotName(responseData?.botName);
      setMessage(responseData?.message);
      setAvatar(responseData?.avatar);
      setColor(responseData?.color);
    } catch (error) {
      console.error("Bot Error", error);
    }
  };

  useEffect(() => {
    getBotInformation();

    // eslint-disable-next-line
  }, [userId]);

  // ----------------------------Return---------------->
  return (
    <div className="w-full min-h-screen overflow-hidden mt-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <div className=" rounded-md border border-zinc-200 shadow-md py-6 px-4 ">
          {!botName && !message && !avatar && (
            <p className="text-sm text-red-500 mb-3">
              First add your bot information form <b>&apos;Appearance&apos; </b>
              then update here.
            </p>
          )}
          <form onSubmit={handleSubmit} className=" flex flex-col gap-4 ">
            <label
              htmlFor=""
              className="flex flex-col gap-2 shadow-md py-3 px-2 border border-zinc-200 "
            >
              <h3 className="text-base font-medium">Title</h3>
              <p className="text-sm text-zinc-500">
                Title to be shown in the chat window
              </p>
              <input
                type="text"
                placeholder="Enter your chatbot title here."
                value={botName}
                onChange={(e) => setBotName(e.target.value)}
                className="py-1 px-2 border-none shadow-md "
              />
            </label>
            <label
              htmlFor=""
              className="flex flex-col gap-2 shadow-md py-3 px-2 border border-zinc-200 "
            >
              <h3 className="text-base font-medium">Welcome Message</h3>
              <p className="text-sm text-zinc-500">
                This will be shown as the first message from bot when a new chat
                begins. Leave it empty if you want to disab
              </p>
              <input
                type="text"
                placeholder="Hi, How can I help you today?"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="py-1 px-2 border-none shadow-md "
              />
            </label>

            {/* -------------Color------- */}
            <label
              htmlFor=""
              className="flex flex-col gap-2 shadow-md py-3 px-2 border border-zinc-200 "
            >
              <h3 className="text-base font-medium">Bot Header Color</h3>
              <p className="text-sm text-zinc-500">
                This color will be applied to the header of your bot when
                displayed in the chat window. Click on the color input to choose
                your preferred header color.
              </p>
              <input
                type="color"
                placeholder="Hi, How can I help you today?"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="py-1 px-2 border-none shadow-md "
              />
            </label>
            {/* Avatar */}
            <label
              htmlFor=""
              className="flex flex-col gap-2 shadow-md py-3 px-2 border border-zinc-200 "
            >
              <h3 className="text-base font-medium">Chatbot Avatar</h3>
              <p className="text-sm text-zinc-500">
                Upload your avatar profile image to display in the chat window.
                Leave empty if you don&apos;t want an avatar.
              </p>
              <input
                type="text"
                placeholder="Hi, How can I help you today?"
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                className="py-1 px-2 border-none shadow-md "
              />
            </label>
            {avatar && (
              <Image
                src={avatar}
                width={50}
                height={50}
                alt="avatar"
                className="rounded-md shadow-md border border-zinc-300"
              />
            )}

            <div className="w-full flex items-center justify-end">
              <Button
                className=""
                onClick={handleSubmit}
                disabled={!botName && !message && !avatar}
              >
                Update
              </Button>
            </div>
          </form>
        </div>

        {/* ----------Bot-------------- */}
        <div className="">
          <div className="rounded-md shadow-md overflow-hidden border border-zinc-300">
            <div
              className="w-full h-[3rem] flex gap-2 items-center py-2 px-2"
              style={{ background: color }}
            >
              {avatar ? (
                <div className="w-[2rem] h-[2rem] rounded-full overflow-hidden">
                  <Image src={avatar} height={32} width={32} alt="avatar" />
                </div>
              ) : (
                <div className="w-[2rem] h-[2rem] rounded-full overflow-hidden">
                  <Image
                    src="/logo1.jpeg"
                    width={32}
                    height={32}
                    alt="avatar"
                  />
                </div>
              )}
              <h3 className="text-white text-xl font-semibold">
                {botName ? botName : "ChatDoc.ai"}
              </h3>
            </div>
            <div className="w-full h-[20rem] py-3 px-2">
              <div className="flex flex-col items-start gap-1 py-1 px-2 border border-zinc-100 shadow-md rounded-md w-fit">
                <Image src="/ChatbotF.png" width={25} height={25} alt="bot" />
                <p>{message ? message : "Hi, How can I help you today?"}</p>
              </div>
            </div>
          </div>
          <div
            className="flex items-center gap-2 w-full h-[3rem] px-1 mt-1 
          shadow-md border border-zinc-300 rounded-md "
          >
            <input
              type="text"
              placeholder="Add your avatar address here..."
              className="w-full py-2 px-2 disabled"
              disabled
            />
            <Button disabled>
              <IoSend size="18" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
