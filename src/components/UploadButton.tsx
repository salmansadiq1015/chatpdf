"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import Dropzone from "react-dropzone";
import { Cloud, File, Loader2 } from "lucide-react";
import { Progress } from "./ui/progress";
import { useUploadThing } from "@/lib/uploadthing";
import { trpc } from "@/app/_trpc/client";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
// import { uploadToS3 } from "@/lib/s3";

const UploadDropzone = ({
  isSubscribed,
  setIsOpen,
}: {
  isSubscribed: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  // const { toast } = useToast();

  const { startUpload } = useUploadThing(
    isSubscribed ? "proPlanUploader" : "freePlanUploader"
  );

  const { mutate: startPolling } = trpc.getFile.useMutation({
    onSuccess: (file) => {
      router.push(`/dashboard`);
      window.location.reload();
      setIsOpen(false);
      toast.success("File uploaded successfully!", {
        position: "top-center",
        theme: "dark",
      });
    },
    retry: true,
    retryDelay: 500,
  });

  const startSimulatedProgress = () => {
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress((prevProgress) => {
        if (prevProgress >= 95) {
          clearInterval(interval);
          return prevProgress;
        }
        return prevProgress + 5;
      });
    }, 500);

    return interval;
  };

  return (
    <Dropzone
      multiple={true}
      onDrop={async (acceptedFiles) => {
        const acceptedExtensions = [".pdf", ".docx", ".csv", ".txt", ".pptx"];
        const validFiles = acceptedFiles.filter((file) =>
          acceptedExtensions.some((ext) =>
            file.name.toLowerCase().endsWith(ext)
          )
        );

        if (validFiles.length === 0) {
          // Display an error message to the user
          console.error(
            "Invalid file types. Please upload PDF, CSV, Docx & text files."
          );
          return;
        }

        // Continue with the valid files
        setIsUploading(true);
        const progressInterval = startSimulatedProgress();

        const promises = validFiles.map(async (file) => {
          const res = await startUpload([file]);

          // // Upload to S3
          // try {
          //   const data = await uploadToS3(file);
          //   console.log("Data:", data);
          // } catch (error) {
          //   console.log(error);
          // }

          if (!res) {
            return toast.error(
              "Invalid file types. Please upload PDF, CSV & text files.",
              {
                position: "top-center",
                theme: "colored",
              }
            );
          }

          const [fileResponse] = res;

          const key = fileResponse?.key;

          if (!key) {
            return toast.error("Something went wrong, try again!", {
              position: "top-center",
              theme: "colored",
            });
          }

          return key;
        });

        Promise.all(promises)
          .then((keys) => {
            clearInterval(progressInterval);
            setUploadProgress(100);

            keys.forEach((key) => {
              if (typeof key === "string") {
                startPolling({ key });
              }
            });
          })
          .catch((error) => {
            console.error("Error uploading files:", error);
          });
      }}
    >
      {({ getRootProps, getInputProps, acceptedFiles }) => (
        <div
          {...getRootProps()}
          className="border h-64 m-4 border-dashed border-gray-300 rounded-lg"
        >
          <div className="flex items-center justify-center h-full w-full">
            <label
              htmlFor="dropzone-fil"
              className="flex flex-col items-center justify-center w-full h-full rounded-lg cursor-pointer bg-gray-50 hover-bg-gray-100"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Cloud className="h-10 w-10 text-blue-500 mb-2" />
                <p className="mb-2 text-sm text-zinc-700">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
                <p className="text-xs text-zinc-500">
                  File (up to {isSubscribed ? "16" : "4"}MB)
                </p>
              </div>

              {acceptedFiles && acceptedFiles.length > 0 ? (
                <div className="max-w-xs bg-white flex items-center rounded-md overflow-hidden outline outline-[1px] outline-zinc-200 divide-x divide-zinc-200">
                  <div className="px-3 py-2 h-full grid place-items-center">
                    <File className="h-4 w-4 text-blue-500" />
                  </div>
                  <div className="px-3 py-2 h-full text-sm truncate">
                    {acceptedFiles.map((file) => (
                      <div key={file.name}>{file.name}</div>
                    ))}
                  </div>
                </div>
              ) : null}

              {isUploading ? (
                <div className="w-full mt-4 max-w-xs mx-auto">
                  <Progress
                    indicatorColor={
                      uploadProgress === 100 ? "bg-green-500" : ""
                    }
                    value={uploadProgress}
                    className="h-1 w-full bg-zinc-200"
                  />
                  {uploadProgress === 100 ? (
                    <div className="flex gap-1 items-center justify-center text-sm text-zinc-700 text-center pt-2">
                      <Loader2 className="h-3 w-3 animate-spin text-green-500" />
                      Uploading in progress...
                    </div>
                  ) : null}
                </div>
              ) : null}

              <input
                type="file"
                accept="/*"
                id="dropzone-file"
                className="hidden"
                multiple
                {...getInputProps()}
              />
            </label>
          </div>
        </div>
      )}
    </Dropzone>
  );
};

// ... (UploadButton and export statement remain the same)

const UploadButton = ({
  isSubscribed,
  quota,
  uploadedFiles,
}: {
  isSubscribed: boolean;
  quota: Number | undefined;
  uploadedFiles: Number;
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  console.log(uploadedFiles, quota);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(v) => {
        if (!v) {
          setIsOpen(v);
        }
      }}
    >
      <DialogTrigger onClick={() => setIsOpen(true)} asChild>
        {!isSubscribed && uploadedFiles === 3 ? (
          <Button disabled>+ Upload File</Button>
        ) : (
          <Button>+ Upload File</Button>
        )}
      </DialogTrigger>

      <DialogContent>
        <UploadDropzone isSubscribed={isSubscribed} setIsOpen={setIsOpen} />
      </DialogContent>
    </Dialog>
  );
};

export default UploadButton;

// ----------------------------2-------------------->

// const UploadDropzone = ({
//   isSubscribed,
//   setIsOpen,
// }: {
//   isSubscribed: boolean;
//   setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
// }) => {
//   const router = useRouter();
//   const [isUploading, setIsUploading] = useState<boolean>(false);
//   const [uploadProgress, setUploadProgress] = useState<number>(0);
//   const [url, setUrl] = useState<string>("");

//   const { startUpload } = useUploadThing(
//     isSubscribed ? "proPlanUploader" : "freePlanUploader"
//   );

//   const { mutate: startPolling } = trpc.getFile.useMutation({
//     onSuccess: (file) => {
//       router.push(`/dashboard`);
//       window.location.reload();
//       setIsOpen(false);
//       toast.success("File uploaded successfully!", {
//         position: "top-center",
//         theme: "dark",
//       });
//     },
//     retry: true,
//     retryDelay: 500,
//   });

//   const startSimulatedProgress = () => {
//     setUploadProgress(0);

//     const interval = setInterval(() => {
//       setUploadProgress((prevProgress) => {
//         if (prevProgress >= 95) {
//           clearInterval(interval);
//           return prevProgress;
//         }
//         return prevProgress + 5;
//       });
//     }, 500);

//     return interval;
//   };

//   const handleUrlUpload = () => {
//     if (url) {
//       // Process the URL (replace this with your URL handling logic)
//       toast.success("URL Uploaded!");
//       setUrl("");
//     } else {
//       console.error("URL is empty");
//     }
//   };

//   return (
//     <div>
//       {/* Input field for URL */}
//       <div className="w-full flex items-center">
//         <input
//           type="text"
//           placeholder="Enter URL"
//           value={url}
//           onChange={(e) => setUrl(e.target.value)}
//           className="border p-2 mb-4 rounded-md "
//         />
//         {/* Button for URL upload */}
//         <button
//           onClick={handleUrlUpload}
//           className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md mb-5"
//         >
//           Upload URL
//         </button>
//       </div>

//       <Dropzone
//         multiple={true}
//         onDrop={async (acceptedFiles) => {
//           const acceptedExtensions = [".pdf", ".docx", ".csv", ".txt", ".pptx"];
//           const validFiles = acceptedFiles.filter((file) =>
//             acceptedExtensions.some((ext) =>
//               file.name.toLowerCase().endsWith(ext)
//             )
//           );

//           if (validFiles.length === 0 && !url) {
//             console.error(
//               "Invalid file types or empty URL. Please upload PDF, CSV, Docx & text files or provide a valid URL."
//             );
//             return;
//           }

//           setIsUploading(true);
//           const progressInterval = startSimulatedProgress();

//           const promises = validFiles.map(async (file) => {
//             const res = await startUpload([file]);

//             if (!res) {
//               return toast.error(
//                 "Invalid file types. Please upload PDF, CSV & text files.",
//                 {
//                   position: "top-center",
//                   theme: "colored",
//                 }
//               );
//             }

//             const [fileResponse] = res;

//             const key = fileResponse?.key;

//             if (!key) {
//               return toast.error("Something went wrong, try again!", {
//                 position: "top-center",
//                 theme: "colored",
//               });
//             }

//             return key;
//           });

//           // Handle URL
//           if (url) {
//             // Process the URL (replace this with your URL handling logic)
//             console.log("URL:", url);
//           }

//           Promise.all(promises)
//             .then((keys) => {
//               clearInterval(progressInterval);
//               setUploadProgress(100);

//               keys.forEach((key) => {
//                 if (typeof key === "string") {
//                   startPolling({ key });
//                 }
//               });
//             })
//             .catch((error) => {
//               console.error("Error uploading files:", error);
//             });
//         }}
//       >
//         {/* ... (existing code) */}

//         {({ getRootProps, getInputProps, acceptedFiles }) => (
//           <div
//             {...getRootProps()}
//             className="border h-64 m-4 border-dashed border-gray-300 rounded-lg"
//           >
//             <div className="flex items-center justify-center h-full w-full">
//               <label
//                 htmlFor="dropzone-fil"
//                 className="flex flex-col items-center justify-center w-full h-full rounded-lg cursor-pointer bg-gray-50 hover-bg-gray-100"
//               >
//                 <div className="flex flex-col items-center justify-center pt-5 pb-6">
//                   <Cloud className="h-10 w-10 text-blue-500 mb-2" />
//                   <p className="mb-2 text-sm text-zinc-700">
//                     <span className="font-semibold">Click to upload</span> or
//                     drag and drop
//                   </p>
//                   <p className="text-xs text-zinc-500">
//                     File (up to {isSubscribed ? "16" : "4"}MB)
//                   </p>
//                 </div>

//                 {acceptedFiles && acceptedFiles.length > 0 ? (
//                   <div className="max-w-xs bg-white flex items-center rounded-md overflow-hidden outline outline-[1px] outline-zinc-200 divide-x divide-zinc-200">
//                     <div className="px-3 py-2 h-full grid place-items-center">
//                       <File className="h-4 w-4 text-blue-500" />
//                     </div>
//                     <div className="px-3 py-2 h-full text-sm truncate">
//                       {acceptedFiles.map((file) => (
//                         <div key={file.name}>{file.name}</div>
//                       ))}
//                     </div>
//                   </div>
//                 ) : null}

//                 {isUploading ? (
//                   <div className="w-full mt-4 max-w-xs mx-auto">
//                     <Progress
//                       indicatorColor={
//                         uploadProgress === 100 ? "bg-green-500" : ""
//                       }
//                       value={uploadProgress}
//                       className="h-1 w-full bg-zinc-200"
//                     />
//                     {uploadProgress === 100 ? (
//                       <div className="flex gap-1 items-center justify-center text-sm text-zinc-700 text-center pt-2">
//                         <Loader2 className="h-3 w-3 animate-spin text-green-500" />
//                         Uploading in progress...
//                       </div>
//                     ) : null}
//                   </div>
//                 ) : null}

//                 <input
//                   type="file"
//                   accept="/*"
//                   id="dropzone-file"
//                   className="hidden"
//                   multiple
//                   {...getInputProps()}
//                 />
//               </label>
//             </div>
//           </div>
//         )}
//       </Dropzone>
//     </div>
//   );
// };

// const UploadButton = ({
//   isSubscribed,
//   quota,
//   uploadedFiles,
// }: {
//   isSubscribed: boolean;
//   quota: Number | undefined;
//   uploadedFiles: Number;
// }) => {
//   const [isOpen, setIsOpen] = useState<boolean>(false);
//   console.log(uploadedFiles, quota);

//   return (
//     <Dialog
//       open={isOpen}
//       onOpenChange={(v) => {
//         if (!v) {
//           setIsOpen(v);
//         }
//       }}
//     >
//       <DialogTrigger onClick={() => setIsOpen(true)} asChild>
//         {!isSubscribed && uploadedFiles === 3 ? (
//           <Button disabled>+ Upload File</Button>
//         ) : (
//           <Button>+ Upload File</Button>
//         )}
//       </DialogTrigger>

//       <DialogContent>
//         <UploadDropzone isSubscribed={isSubscribed} setIsOpen={setIsOpen} />
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default UploadButton;
