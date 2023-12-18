"use client";
import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable"; // Import the plugin
import { formatDistanceToNow } from "date-fns";
import { BiSolidFilePdf } from "react-icons/bi";
import { FaFileDownload } from "react-icons/fa";
import Link from "next/link";
import { FaEye } from "react-icons/fa";

interface Message {
  id: string;
  text: string;
  fileId?: string | null; // Make fileId optional
  createdAt: Date;
}

interface UserMessagesProps {
  totalMessages: Message[];
}

export default function UserMessages({ totalMessages }: UserMessagesProps) {
  const [messagesByFileId, setMessagesByFileId] = useState<
    Map<string, Message[]>
  >(new Map());
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);

  useEffect(() => {
    const groupedMessages = new Map<string, Message[]>();
    totalMessages.forEach((message) => {
      const fileId = message.fileId || "NoFileId"; // Use a default value if fileId is null
      if (!groupedMessages.has(fileId)) {
        groupedMessages.set(fileId, []);
      }
      groupedMessages.get(fileId)?.push(message);
    });
    setMessagesByFileId(groupedMessages);
  }, [totalMessages]);

  const downloadAsPDF = async () => {
    if (!selectedFileId) return;

    const messages = messagesByFileId.get(selectedFileId);

    if (!messages) return;

    const pdf = new jsPDF();

    // Now TypeScript should recognize the autoTable property
    (pdf as any).autoTable({
      head: [["Text", "Created At"]],
      body: messages.map((message) => [
        message.text,
        formatDistanceToNow(message.createdAt),
      ]),
    });

    // Save the PDF
    pdf.save(`chat_history_${selectedFileId}.pdf`);
    setSelectedFileId(null);
  };

  return (
    <div className="mt-[2rem] min-h-screen">
      <div className="w-full flex items-center justify-end py-4 px-4">
        {selectedFileId && (
          <button
            onClick={downloadAsPDF}
            className="py-2 px-4 bg-green-600 flex gap-1 text-white rounded-md cursor-pointer hover:shadow-xl"
          >
            <FaFileDownload size="24" color="white" />
            Download as PDF
          </button>
        )}
      </div>
      <div className="overflow-x-auto chatHistory">
        <table
          className="w-full"
          style={{ border: "2px solid #222", borderBottom: "none" }}
          border={2}
          cellPadding={2}
          cellSpacing={2}
        >
          <thead>
            <tr className="messageHistory1">
              <th>Started</th>
              <th>Last Message</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.from(messagesByFileId).map(([fileId, messages]) => (
              <React.Fragment key={fileId}>
                {messages.length >= 2 &&
                  messages.map(
                    (message, index) =>
                      index === messages.length - 2 && (
                        <tr key={index} className="messageHistory">
                          <td data-label="Started">
                            {formatDistanceToNow(message.createdAt)} ago
                          </td>
                          <td
                            data-label="Last Message"
                            // className="hidden md:flex"
                          >
                            {message.text.slice(0, 30)}...
                          </td>
                          {/* <td
                            data-label="Last Message"
                            className="flex md:hidden"
                          >
                            {message.text.slice(0, 40)}...
                          </td> */}

                          <td
                            className=" flex flex-col sm:flex-row gap-2  "
                            data-label="Actions"
                          >
                            <Link
                              href={`/dashboard/${fileId}`}
                              className="py-2 text-sm px-2  items-center justify-center m-auto border-none bg-blue-600 flex gap-1 text-white 
                              rounded-md cursor-pointer hover:shadow-2xl"
                            >
                              <FaEye size="22" color="white" />
                              view
                            </Link>
                            <button
                              onClick={() => setSelectedFileId(fileId)}
                              className="py-2  text-sm px-2 sm:px-2 mt-2 md:mt-0 m-auto border-none bg-green-600 flex gap-1 text-white 
                              rounded-md cursor-pointer hover:shadow-2xl"
                            >
                              <BiSolidFilePdf size="22" color="white" />{" "}
                              Download
                            </button>
                          </td>
                        </tr>
                      )
                  )}
                <hr />
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
