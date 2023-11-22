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
import { HiDocumentPlus } from "react-icons/hi2";
// import MergeFIles from "./MergeFIles";
import { PDFDocument, rgb } from "pdf-lib";
import Papa from "papaparse";

import { IoCloudUploadOutline } from "react-icons/io5";
import { AiOutlineCloseCircle, AiOutlineCloudDownload } from "react-icons/ai";
import Image from "next/image";

interface PageProps {
  subscriptionPlan: Awaited<ReturnType<typeof getUserSubscriptionPlan>>;
}

const Dashboard = ({ subscriptionPlan }: PageProps) => {
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

  // ------------------Merge Files------------>
  const [showMerge, setShowMerge] = useState<boolean>(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [mergedFile, setMergedFile] = useState<Blob | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      setSelectedFiles(files);
    }
  };

  useEffect(() => {
    const mergeFiles = async () => {
      const pdfDoc = await PDFDocument.create();

      for (const file of selectedFiles) {
        if (file.type === "application/pdf") {
          const arrayBuffer = await file.arrayBuffer();
          const srcDoc = await PDFDocument.load(arrayBuffer);

          for (const pageIndex of srcDoc.getPageIndices()) {
            const [copiedPage] = await pdfDoc.copyPages(srcDoc, [pageIndex]);
            pdfDoc.addPage(copiedPage);
          }
        } else if (file.type === "text/plain") {
          const text = await file.text();
          const pages = text.split("\n");

          for (const page of pages) {
            const pageObject = pdfDoc.addPage([500, 500]);
            pageObject.drawText(page, {
              x: 50,
              y: 450,
              size: 12,
              color: rgb(0, 0, 0),
            });
          }
        } else if (file.type === "text/csv") {
          const text = await file.text();
          const csvData = Papa.parse(text, { header: true });

          for (const row of csvData.data as Record<string, string>[]) {
            const pageObject = pdfDoc.addPage([500, 500]);
            const textContent = Object.values(csvData.data).join(",");

            pageObject.drawText(textContent, {
              x: 50,
              y: 450,
              size: 12,
              color: rgb(0, 0, 0),
            });
          }
        } else {
          // Handle other file types as needed
          continue;
        }
      }

      const mergedPdfBytes = await pdfDoc.save();
      const mergedBlob = new Blob([mergedPdfBytes], {
        type: "application/pdf",
      });

      setMergedFile(mergedBlob);
    };

    if (selectedFiles.length > 0) {
      mergeFiles();
    }
  }, [selectedFiles]);

  const handleOnClick: any = () => {
    setShowMerge(false);
  };

  return (
    <main className="mx-auto max-w-7xl md:p-10 p-2 relative  min-h-screen">
      <div
        className="absolute right-10 merge-files mt-[2rem] mb-6 sm:mt-[-2rem]"
        title="Merge Multiple files"
        onClick={() => setShowMerge(true)}
      >
        <HiDocumentPlus />
      </div>
      {/* -----------Merge Files-------- */}
      {showMerge && (
        <div className="mergefiles absolute w-full min-h-screen flex items-center justify-center ">
          {/* <MergeFIles setShowMerge={setShowMerge} /> */}
          <div
            className="fixed  z-50 bg-black bg-opacity-50 rounded-md shadow-2xl w-[20rem] sm:w-[28rem] mt-[-10rem] 
    border-2 border-blue-600 flex items-center flex-col gap-4 justify-center py-[2rem] text-white"
          >
            <div
              className="absolute top-4 right-4 "
              onClick={() => setShowMerge(false)}
            >
              <AiOutlineCloseCircle color="orangered" size="28" />
            </div>
            <h3
              className="text-2xl font-bold text-white"
              style={{ textShadow: "-1px 1px 0px rgb(0, 145, 255)" }}
            >
              Combine multiple files
            </h3>
            <div className="flex flex-col gap-6">
              <label
                htmlFor="select-files"
                className="w-[15rem] ml-2 h-[12rem] rounded-md  flex 
          items-center justify-center"
                style={{ border: "3px dotted rgb(0, 255, 0)" }}
              >
                {mergedFile ? (
                  <Image
                    src="/success.png"
                    alt="success"
                    width={65}
                    height={65}
                    className="w-[4rem] h-[4rem]"
                  />
                ) : (
                  <IoCloudUploadOutline size="35" color="white" />
                )}
              </label>
              <input
                type="file"
                id="select-files"
                multiple
                onChange={handleFileSelect}
                className="hidden"
              />
              {mergedFile && (
                <Link
                  href={URL.createObjectURL(mergedFile)}
                  download="Combilefiles.pdf"
                  target="blank"
                  className=" py-2 px-4 rounded-md flex items-center justify-center gap-2 cursor-pointer bg-blue-500 text-white"
                  onClick={handleOnClick}
                >
                  Download Converted File{" "}
                  <AiOutlineCloudDownload size="26" color="white" />
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

      {/* -------------Merge Files----------> */}

      <div
        className="mt-8 flex flex-col items-start justify-between gap-4 border-b
       border-gray-200 pb-5 sm:flex-row sm:items-center sm:gap-0"
      >
        <h1
          className="mb-3 font-bold text-5xl text-gray-900"
          style={{ textShadow: "-1px 1px 0px #777" }}
        >
          My Fi<span className="text-blue-600">les</span>
        </h1>

        <UploadButton isSubscribed={subscriptionPlan.isSubscribed} />
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
                  >
                    <div className=" py-0 px-2  w-[5rem] flex items-center justify-center  rounded-3xl bg-zinc-300 hover:bg-green-200 mt-3 ml-2 border border-green-500">
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
                    <Button
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
  );
};

export default Dashboard;

//  //bg-gradient-to-r from-cyan-500 to-blue-500
