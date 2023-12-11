import { cn } from "@/lib/utils";
import { ExtendedMessage } from "@/types/message";
import { Icons } from "../Icons";
import ReactMarkdown from "react-markdown";
import { format } from "date-fns";
import { forwardRef, useState } from "react";
import { FaCopy } from "react-icons/fa";
import { toast } from "react-toastify";
import { FaShareAlt } from "react-icons/fa";

interface MessageProps {
  message: ExtendedMessage;
  isNextMessageSamePerson: boolean;
}

const Message = forwardRef<HTMLDivElement, MessageProps>(
  ({ message, isNextMessageSamePerson }, ref) => {
    const [isCopied, setIsCopied] = useState(false);

    const handleCopyText = () => {
      const textToCopy = typeof message.text === "string" ? message.text : "";
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

    // Share System

    const handleShareMessage = () => {
      const textToShare = typeof message.text === "string" ? message.text : "";
      if (navigator.share) {
        navigator
          .share({
            title: "Share Message",
            text: textToShare,
          })
          .then(() => console.log("Shared successfully"))
          .catch((error) => console.error("Error sharing:", error));
      } else {
        // Fallback for browsers that do not support Web Share API
        // You can implement your own sharing mechanism here
        console.log("Web Share API not supported");
      }
    };

    return (
      <div
        ref={ref}
        className={cn("flex items-end", {
          "justify-end": message.isUserMessage,
        })}
      >
        <div
          className={cn(
            "relative flex h-6 w-6 aspect-square items-center justify-center",
            {
              "order-2 bg-blue-600 rounded-sm": message.isUserMessage,
              "order-1 bg-zinc-200 rounded-sm w-[2rem] h-[2rem] ":
                !message.isUserMessage,
              invisible: isNextMessageSamePerson,
            }
          )}
        >
          {message.isUserMessage ? (
            <Icons.user className="fill-zinc-200 text-zinc-200 h-3/4 w-3/4" />
          ) : (
            <Icons.logo className="fill-zinc-300 h-[5rem] w-[5rem]" />
          )}
        </div>

        <div
          className={cn("flex flex-col space-y-2 text-base max-w-md mx-2", {
            "order-1 items-end": message.isUserMessage,
            "order-2 items-start": !message.isUserMessage,
          })}
        >
          <div
            className={cn("px-4 py-2 rounded-lg inline-block", {
              "bg-blue-600 text-white": message.isUserMessage,
              "bg-gray-200 text-gray-900": !message.isUserMessage,
              "rounded-br-none":
                !isNextMessageSamePerson && message.isUserMessage,
              "rounded-bl-none":
                !isNextMessageSamePerson && !message.isUserMessage,
            })}
          >
            {typeof message.text === "string" ? (
              <div className="flex items-center flex-col">
                <ReactMarkdown
                  className={cn("prose", {
                    "text-zinc-50": message.isUserMessage,
                  })}
                >
                  {message.text}
                </ReactMarkdown>
                {message.text && (
                  <div
                    className={cn("flex items-center justify-end w-full", {
                      hidden: message.isUserMessage,
                    })}
                  >
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
                    <div
                      onClick={handleShareMessage}
                      className={cn(
                        "ml-2 bg-green-500 text-white px-2 py-1 rounded focus:outline-none w-[2rem] cursor-pointer ",
                        {
                          "opacity-70 cursor-not-allowed": isCopied,
                        }
                      )}
                    >
                      {/* <Icons.share className="h-4 w-4" /> */}
                      <FaShareAlt />
                    </div>
                  </div>
                )}
              </div>
            ) : (
              message.text
            )}
            {message.id !== "loading-message" ? (
              <div
                className={cn(
                  "text-xs select-none mt-2 w-full text-right flex flex-col gap-1",
                  {
                    "text-zinc-500": !message.isUserMessage,
                    "text-blue-300": message.isUserMessage,
                  }
                )}
              >
                {message.isUserMessage && (
                  <>{format(new Date(message.createdAt), "HH:mm")}</>
                )}
                {!message.isUserMessage && (
                  <>
                    <div className="w-full flex items-center justify-between py-[.2rem] px-2 rounded-2xl">
                      <span
                        className="text-blue-500 py-1 rounded-3xl px-2 "
                        style={{
                          background: "rgba(0,0,0,0.1)",
                        }}
                      >
                        {message.title?.slice(0, 35)}
                      </span>
                      <span
                        className="text-blue-500 py-1 flex items-center justify-center  rounded-sm shadow-md"
                        style={{
                          background: "rgba(0,0,0,0.1)",
                          width: "1.5rem",
                        }}
                      >
                        {message.pageNumber}
                      </span>
                    </div>
                  </>
                )}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    );
  }
);

Message.displayName = "Message";

export default Message;
