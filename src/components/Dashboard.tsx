"use client";

import { trpc } from "@/app/_trpc/client";
import UploadButton from "./UploadButton";
import { Ghost, Loader2, MessageSquare, Plus, Trash } from "lucide-react";
import Skeleton from "react-loading-skeleton";
import Link from "next/link";
import { format } from "date-fns";
import { Button } from "./ui/button";
import { useState } from "react";
import { getUserSubscriptionPlan } from "@/lib/stripe";
import { HiDocumentPlus } from "react-icons/hi2";
import MergeFIles from "./MergeFIles";

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
  const [showMerge, setShowMerge] = useState<boolean>(false);
  return (
    <main className="mx-auto max-w-7xl md:p-10 p-2 relative ">
      <div
        className="absolute right-10 merge-files mt-[-2rem] mb-6"
        title="Merge Multiple files"
        onClick={() => setShowMerge(true)}
      >
        <HiDocumentPlus />
      </div>
      {/* -----------Merge Files-------- */}
      {showMerge && (
        <div className="mergefiles absolute w-full min-h-screen flex items-center justify-center">
          <MergeFIles setShowMerge={setShowMerge} />
        </div>
      )}

      {/* ------------- */}

      <div className="mt-8 flex flex-col items-start justify-between gap-4 border-b border-gray-200 pb-5 sm:flex-row sm:items-center sm:gap-0">
        <h1 className="mb-3 font-bold text-5xl text-gray-900">My Files</h1>

        <UploadButton isSubscribed={subscriptionPlan.isSubscribed} />
      </div>

      {/* display all user files */}
      {files && files?.length !== 0 ? (
        <ul className="mt-8 grid grid-cols-1 gap-6 divide-y divide-zinc-200 md:grid-cols-2 lg:grid-cols-3">
          {files
            .sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            )
            .map((file) => (
              <li
                key={file.id}
                className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow transition hover:shadow-lg"
              >
                <Link
                  href={`/dashboard/${file.id}`}
                  className="flex flex-col gap-2"
                >
                  <div className="pt-6 px-6 flex w-full items-center justify-between space-x-6">
                    <div className="h-10 w-10 flex items-center justify-center flex-shrink-0 rounded-full ">
                      {" "}
                      {file?.url.endsWith(".pdf") ? (
                        <img
                          src="/pdf.png"
                          alt="PDF"
                          style={{ width: "2.3rem", height: "2.3rem" }}
                        />
                      ) : (
                        ""
                      )}
                      {file?.url.endsWith(".csv") ? (
                        <img
                          src="/csv.png"
                          alt="PDF"
                          style={{ width: "2.6rem", height: "2.7rem" }}
                        />
                      ) : (
                        ""
                      )}
                      {file?.url.endsWith(".txt") ? (
                        <img
                          src="/txt.png"
                          alt="PDF"
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

                <div className="px-6 mt-4 grid grid-cols-3 place-items-center py-2 gap-6 text-xs text-zinc-500">
                  <div className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    {format(new Date(file.createdAt), "MMM yyyy")}
                  </div>

                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    mocked
                  </div>

                  <Button
                    onClick={() => deleteFile({ id: file.id })}
                    size="sm"
                    className="w-full"
                    variant="destructive"
                  >
                    {currentlyDeletingFile === file.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </li>
            ))}
        </ul>
      ) : isLoading ? (
        <Skeleton height={100} className="my-2" count={3} />
      ) : (
        <div className="mt-16 flex flex-col items-center gap-2">
          <Ghost className="h-8 w-8 text-zinc-800" />
          <h3 className="font-semibold text-xl">Pretty empty around here</h3>
          <p>Let&apos;s upload your first PDF.</p>
        </div>
      )}
    </main>
  );
};

export default Dashboard;

//  //bg-gradient-to-r from-cyan-500 to-blue-500
