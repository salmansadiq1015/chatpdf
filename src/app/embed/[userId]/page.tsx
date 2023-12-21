"use client";

import React, { useEffect, useState } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { formSchema } from "./constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useRouter } from "next/navigation";
import { ChatCompletionRequestMessage } from "openai-edge";
import { cn } from "@/lib/utils";
import UserAvatar from "@/components/Models/UserAvatar";
import BotAvatar from "@/components/Models/BotAvatar";
import Image from "next/image";
import { IoSend } from "react-icons/io5";
import { BsThreeDots } from "react-icons/bs";

export default function Conversation({ params }: { params: any }) {
  const router = useRouter();
  const userID = params.userId;

  const [messages, setMessages] = useState<ChatCompletionRequestMessage[]>([]);
  console.log(messages);

  // -----------Default Message------------->
  useEffect(() => {
    // Set default message when component mounts
    const defaultMessage: ChatCompletionRequestMessage = {
      role: "assistant",
      content: "Hi, How can I help you today?",
    };

    setMessages([defaultMessage]);
  }, []);

  // -------------------->

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>,event: any) => {
    event.preventDefault();
    try {
      const userMessage: ChatCompletionRequestMessage = {
        role: "user",
        content: values.prompt,
      };
      const newMessages = [userMessage];

      const response = await axios.post("/api/embed", {
        userID,
        message: newMessages,
      });

      console.log("Result:", response);

      setMessages((current) => [...current, userMessage, response.data]);

      form.reset();
    } catch (error: any) {
      // TODO: Open Pro Model
      console.log(error);
    } finally {
      // router.refresh();
    }
  };

  //   -------------Move to top------------>

  useEffect(() => {
    const messageContainer = document.getElementById("message-container");
    if (messageContainer) {
      messageContainer.scrollTo({
        top: messageContainer.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  return (
    <div className="w-full h-[100vh]  ">
      <div className="relative w-full h-[100vh] overflow-hidden ">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 w-full bg-green-600 text-white py-3 px-2 ">
            <div className="w-[2.5rem] h-[2.5rem] rounded-full overflow-hidden">
              <Image
                src="/logo1.jpeg"
                width={100}
                height={100}
                alt="ChatDoc.ai"
                className={`rounded-full ${isLoading ? "rotate" : ""}`}
              />
            </div>
            <h1
              className="text-xl font-medium "
              style={{ textShadow: "-1px 1px 0px #444" }}
            >
              Chat<span>Doc</span>.ai
            </h1>
          </div>
        </div>
        {/* -------------- */}
        <div
          className="space-y-4  h-[75vh] border-2  overflow-y-scroll"
          id="message-container"
        >
          <div className="flex flex-col gap-y-4 py-3 px-3">
            {messages?.map((message, index) => (
              <div
                key={index}
                className={cn("flex", {
                  "justify-end pl-10": message.role === "user",
                  "justify-start pr-10": message.role === "assistant",
                })}
              >
                <div
                  className={cn(
                    "rounded-md px-3 text-sm py-1 shadow-md ring-1 ring-gray-900/10",
                    {
                      "bg-blue-600 text-white": message.role === "user",
                    }
                  )}
                >
                  {message.role === "user" ? (
                    <span className="w-full flex items-center justify-end">
                      <UserAvatar />
                    </span>
                  ) : (
                    <BotAvatar />
                  )}

                  <p>
                    {message.role === "user"
                      ? message.content
                      : message.content || String(message)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* -------------Input Fields */}
        <div className="absolute bottom-2 left-1 w-full">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className={cn(
                "rounded-md border w-[98vw]  flex items-center py-2  px-3 md:px-6 focus-within:shadow-sm gap-2",
                isLoading && "border-2 border-blue-600 animate-pulse"
              )}
            >
              <FormField
                name="prompt"
                render={({ field }) => (
                  <FormItem className="w-[98%]">
                    <FormControl className="m-0 p-0">
                      <Input
                        className="border-0 w-full outline-none focus-visible:ring-0
                        focus-visible:ring-transparent px-3 "
                        disabled={isLoading}
                        placeholder="Enter your prompt"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button className="w-[3rem]" disabled={isLoading}>
                {isLoading ? (
                  <BsThreeDots className="animate-pulse" size="24" />
                ) : (
                  <IoSend size="23" />
                )}
              </Button>
            </form>
          </Form>
        </div>
        {/*  */}
      </div>
    </div>
  );
}

// ---------------------------->

{
  /* <div
className={cn(
  "py-1 px-4 flex w-full gap-x-8 rounded-lg overflow-hidden",
  message.role === "user"
    ? "bg-white border font-medium w-fit x text-base border-black/10 justify-end"
    : "bg-muted justify-start",
  { "justify-end pl-10": message.role === "user" }
)}
key={index}
>
{message.role === "user" ? <UserAvatar /> : <BotAvatar />}
<p className="text-sm w-fit">
  {" "}
  {message.role === "user" ? message.content : String(message)}
</p>
</div> */
}
