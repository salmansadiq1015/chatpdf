"use client";

import { trpc } from "@/app/_trpc/client";
import { Calendar, Ghost, Loader2, MessageSquare, Trash } from "lucide-react";
import Skeleton from "react-loading-skeleton";
import Link from "next/link";
import { format } from "date-fns";
import React, { useState } from "react";

// import UploadButton from "@/components/UploadButton";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import Image from "next/image";

const Dashboard = () => {
  const [currentlyDeletingFile, setCurrentlyDeletingFile] = useState<
    string | null
  >(null);

  const utils = trpc.useContext();

  const { data: files, isLoading } = trpc.getUserFiles.useQuery();

  // ------------------->
  const fileExtensions = files?.map((file) => {
    const url = file.url;
    const parts = url.split(".");
    if (parts.length > 1) {
      return `.${parts[parts.length - 1]}`;
    } else {
      // Handle the case where there is no file extension
      return "Unknown";
    }
  });

  // console.log(fileExtensions);

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

  return (
    <Layout>
      <main className="mx-auto max-w-7xl md:p-10 p-2 relative  min-h-screen">
        <div
          className="mt-[2.6rem] sm:mt-5 flex flex-col items-center justify-center gap-4 border-b
       border-gray-200 pb-5 sm:items-center sm:gap-0"
        >
          <h1
            className="mb-3 font-bold text-center text-5xl text-gray-900"
            style={{ textShadow: "-1px 1px 0px #777" }}
          >
            All <span className="text-blue-600">Uploaded</span> Files
          </h1>
          <p className="text-center mt-3 text-zinc-500">
            Elevate your communication with our Chat with Document feature,
            seamlessly integrating file uploads. Transform your conversations
            into dynamic exchanges, enabling you to share files effortlessly.
          </p>

          <div className="float-right w-full py-[2rem]">
            {/* <UploadButton isSubscribed={true} /> */}
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
               transition hover:shadow-lg  filter hover:drop-shadow-2xl  "
                  >
                    <Link
                      href={`/dashboard/${file.id}`}
                      className="flex flex-col gap-2 "
                    >
                      <div className=" py-0 px-2  w-[5rem] flex items-center justify-center  rounded-3xl filter drop-shadow-lg bg-green-200 mt-3 ml-2 border border-green-500">
                        <span className="font-medium text-sm text-zinc-600">
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
                              width="37"
                              height="37"
                              style={{ width: "2.3rem", height: "2.3rem" }}
                            />
                          ) : (
                            ""
                          )}
                          {file?.url.endsWith(".csv") ? (
                            <Image
                              src="/csv.png"
                              alt="PDF"
                              width="37"
                              height="37"
                              style={{ width: "2.6rem", height: "2.7rem" }}
                            />
                          ) : (
                            ""
                          )}
                          {file?.url.endsWith(".txt") ? (
                            <Image
                              src="/txt.png"
                              alt="PDF"
                              width="37"
                              height="37"
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
                      className="px-3 mt-4 grid grid-cols-2 place-items-center py-2 gap-8 text-xs text-zinc-500
                  "
                    >
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-purple-600" />
                        {format(new Date(file.createdAt), "dd MMM yyyy")}
                      </div>

                      <Button
                        size="sm"
                        className=" bg-red-500 hover:bg-red-600"
                        variant="destructive"
                        onClick={() => deleteFile({ id: file.id })}
                        disabled
                      >
                        {currentlyDeletingFile === file.id ? (
                          <Loader2 className="w-4 h-4 animate-spin text-white" />
                        ) : (
                          <Trash className="w-4 h-4 text-white" />
                        )}
                      </Button>
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
            <h3 className="font-semibold text-zinc-800 text-xl">
              Pretty empty around here
            </h3>
            <p>let&apos;s upload your first PDF.</p>
          </div>
        )}
      </main>
    </Layout>
  );
};

export default Dashboard;
