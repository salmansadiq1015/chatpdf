"use client";

import { trpc } from "@/app/_trpc/client";
import UploadButton from "./UploadButton";
import { Calendar, Ghost, Loader2, MessageSquare, Trash } from "lucide-react";
import Skeleton from "react-loading-skeleton";
import Link from "next/link";
import { format } from "date-fns";
import { Button } from "./ui/button";
import React, { useState, useEffect } from "react";
import { getUserSubscriptionPlan } from "@/lib/stripe";
import Image from "next/image";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { toast } from "react-toastify";

interface PageProps {
  subscriptionPlan: Awaited<ReturnType<typeof getUserSubscriptionPlan>>;
  uploadedFiles: Number;
}

const Dashboard = ({ subscriptionPlan, uploadedFiles }: PageProps) => {
  const [currentlyDeletingFile, setCurrentlyDeletingFile] = useState<
    string | null
  >(null);

  const utils = trpc.useContext();

  const { data: files, isLoading } = trpc.getUserFiles.useQuery();

  // ------------------->
  // const fileExtensions = files?.map((file) => {
  //   const url = file.url;
  //   const parts = url.split(".");
  //   if (parts.length > 1) {
  //     return `.${parts[parts.length - 1]}`;
  //   } else {
  //     // Handle the case where there is no file extension
  //     return "Unknown";
  //   }
  // });

  // ------------------->
  const { mutate: deleteFile } = trpc.deleteFile.useMutation({
    onSuccess: () => {
      utils.getUserFiles.invalidate();
    },
    onMutate({ id }) {
      setCurrentlyDeletingFile(id);
    },
    onSettled() {
      setCurrentlyDeletingFile(null);
    },
  });

  console.log(subscriptionPlan.isSubscribed);

  // ------------------Merge Files------------>
  const [tourShown, setTourShown] = useState(false);

  // -----------Heightlights------------->
  useEffect(() => {
    const tourAlreadyShown = localStorage.getItem("tourShown");

    if (!tourAlreadyShown) {
      const driverObj = driver({
        showProgress: true,
        steps: [
          {
            element: "#title",
            popover: {
              title: "Title",
              description: "Your uploads!",
              side: "left",
              align: "start",
            },
          },
          {
            element: "#mergefile",
            popover: {
              title: "Merge PDF Files",
              description:
                "Click and upload multiple file and merge it into single file!",
              side: "left",
              align: "start",
            },
          },
          {
            element: "#upload",
            popover: {
              title: "Upload File",
              description: "Click this button and upload new files",
              side: "bottom",
              align: "start",
            },
          },
          {
            element: "#owner",
            popover: {
              title: "Owner",
              description:
                "Feel the power as the rightful owner of this file! Your creation, your control!",
              side: "bottom",
              align: "start",
            },
          },
          {
            element: "#delete",
            popover: {
              title: "Delete Files",
              description:
                "Clear the path for new beginnings and make room for fresh ideas. Deleting files has never been this empowering—seize control of your digital canvas and let your creativity flow freely!",
              align: "start",
            },
          },
          {
            element: "#initialte_chat",
            popover: {
              title: "Initiate Chat",
              description:
                "Click 'Initiate Chat' to unlock the magic! Unleash conversation by interacting with this file. Let the dialogue begin!",

              side: "left",
              align: "start",
            },
          },
          {
            popover: {
              title: "Happy Use",
              description:
                "Congratulations! You've reached the end of your tour. Now, go ahead and infuse joy into your applications. Happy exploring!",
            },
          },
        ],
      });

      driverObj.drive();

      setTourShown(true);
      localStorage.setItem("tourShown", "true");
    }
  }, [tourShown]);

  return (
    <main className="mx-auto max-w-7xl md:p-10 p-2 relative  min-h-screen">
      <div
        className="mt-8 flex flex-col items-start justify-between gap-4 border-b
       border-gray-200 pb-5 sm:flex-row sm:items-center sm:gap-0"
      >
        <h1
          className="mb-3 font-bold text-5xl text-gray-900"
          style={{ textShadow: "-1px 1px 0px #777" }}
          id="title"
        >
          My Fi<span className="text-blue-600">les</span>
        </h1>

        <div id="upload">
          <UploadButton
            isSubscribed={subscriptionPlan.isSubscribed}
            quota={subscriptionPlan.quota}
            uploadedFiles={uploadedFiles}
          />
        </div>
      </div>

      {/* -------Display All User Files--------- */}
      {files && files.length !== 0 ? (
        <div className="">
          <ul
            className="mt-8 grid grid-cols-1 gap-6 divide-y divide-zinc-200 md:grid-cols-2
          lg:grid-cols-3 z-30"
          >
            {files
              .sort(
                (a, b) =>
                  new Date(b.createdAt).getTime() -
                  new Date(b.createdAt).getTime()
              )
              .map((file) => (
                <li
                  key={file.id}
                  className="col-span-1 divide-y shadow-xl divide-gray-200 rounded-lg bg-white
               transition hover:shadow-lg"
                >
                  <Link
                    href={`/dashboard/${file.id}`}
                    className="flex flex-col gap-2 "
                    id="initialte_chat"
                  >
                    <div className=" py-0 px-2  w-[5rem] flex items-center justify-center  rounded-3xl bg-zinc-300 hover:bg-green-200 mt-3 ml-2 border border-green-500">
                      <span
                        className="font-medium text-sm text-zinc-600"
                        id="owner"
                      >
                        OWNER
                      </span>
                    </div>
                    <div className="pt-6 px-6 flex w-full items-center justify-between space-x-6 ">
                      {/* Change Icons */}
                      <div className="h-10 w-10 flex items-center justify-center flex-shrink-0 rounded-full ">
                        {" "}
                        {file?.url.endsWith(".pdf") ? (
                          <Image
                            src="/pdf.png"
                            alt="PDF"
                            width={37}
                            height={37}
                            style={{ width: "2.3rem", height: "2.3rem" }}
                          />
                        ) : (
                          ""
                        )}
                        {file?.url.endsWith(".csv") ? (
                          <Image
                            src="/csv.png"
                            alt="PDF"
                            width={43}
                            height={45}
                            style={{ width: "2.6rem", height: "2.7rem" }}
                          />
                        ) : (
                          ""
                        )}
                        {file?.url.endsWith(".txt") ? (
                          <Image
                            src="/txt.png"
                            alt="PDF"
                            width={42}
                            height={40}
                            style={{ width: "2.5rem", height: "2.3rem" }}
                          />
                        ) : (
                          ""
                        )}
                      </div>
                      <div className="flex-1 truncate">
                        <div className="flex items-center space-x-3">
                          <h3 className="truncate text-lg font-medium text-zinc-900">
                            {file.name}
                          </h3>
                        </div>
                      </div>
                    </div>
                  </Link>
                  <div
                    className="px-6 mt-4 grid grid-cols-3 place-items-center py-2 gap-6 text-xs text-zinc-500
                  "
                  >
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-purple-600" />
                      {format(new Date(file.createdAt), "dd MMM yyyy")}
                    </div>
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      Test
                    </div>
                    {subscriptionPlan.isSubscribed === true ? (
                      <Button
                        id="delete"
                        size="sm"
                        className=" bg-red-500 hover:bg-red-600"
                        variant="destructive"
                        onClick={() => deleteFile({ id: file.id })}
                      >
                        {currentlyDeletingFile === file.id ? (
                          <Loader2 className="w-4 h-4 animate-spin text-white" />
                        ) : (
                          <Trash className="w-4 h-4 text-white" />
                        )}
                      </Button>
                    ) : (
                      <Button
                        id="delete"
                        size="sm"
                        className=" bg-red-500 hover:bg-red-600"
                        variant="destructive"
                        onClick={() =>
                          toast.error(
                            "Free user cannot delete knowledge source",
                            { position: "top-center" }
                          )
                        }
                      >
                        {currentlyDeletingFile === file.id ? (
                          <Loader2 className="w-4 h-4 animate-spin text-white" />
                        ) : (
                          <Trash className="w-4 h-4 text-white" />
                        )}
                      </Button>
                    )}
                  </div>
                </li>
              ))}
          </ul>
        </div>
      ) : isLoading ? (
        <div className="">
          <Skeleton height={100} count={5} className="my-2" />
        </div>
      ) : (
        <div className="mt-16 flex flex-col items-center gap-2">
          <Ghost className="h-8 w-8 text-zinc-800" />
          <h3 className="font-semibold text-zinc-800 text-xl" id="empty">
            Pretty empty around here
          </h3>
          <p>let&apos;s upload your first PDF.</p>
        </div>
      )}
    </main>
  );
};

export default Dashboard;

//  //bg-gradient-to-r from-cyan-500 to-blue-500
