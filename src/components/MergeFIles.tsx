import React, { useEffect, useState } from "react";
import { PDFDocument, rgb } from "pdf-lib";
import Papa from "papaparse";
import Link from "next/link";
import { IoCloudUploadOutline } from "react-icons/io5";
import { AiOutlineCloseCircle, AiOutlineCloudDownload } from "react-icons/ai";
import UploadButton from "./UploadButton";

type MergeFilesProps = {
  setShowMerge: (show: boolean) => void;
};

export default function MergeFIles({ setShowMerge }: MergeFilesProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [mergedFile, setMergedFile] = useState<Blob | null>(null);

  console.log(mergedFile);

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
            <img
              src="/success.png"
              alt="success"
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
      <div className="hidden">
        <UploadButton />
      </div>
    </div>
  );
}
