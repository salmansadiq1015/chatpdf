"use client";

import React, { useState } from "react";
import * as z from "zod";
import { useForm, FormProviderProps } from "react-hook-form";
import Layout from "@/components/layout/Layout";
import Heading from "@/components/Models/Heading";
import { MessageSquare } from "lucide-react";
import { formSchema } from "./constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useRouter } from "next/navigation";
import { ChatCompletionRequestMessage } from "openai-edge";
import Empty from "@/components/Models/Empty";
import Loader from "@/components/Models/Loader";
import { cn } from "@/lib/utils";
import UserAvatar from "@/components/Models/UserAvatar";
import BotAvatar from "@/components/Models/BotAvatar";

// type MyFormProviderProps = FormProviderProps<z.infer<typeof formSchema>> & {
//   children: React.ReactNode;
// };

export default function Conversation() {
  const router = useRouter();

  const [messages, setMessages] = useState<ChatCompletionRequestMessage[]>([]);

  console.log(messages);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const userMessage: ChatCompletionRequestMessage = {
        role: "user",
        content: values.prompt,
      };
      const newMessages = [...messages, userMessage];

      const response = await axios.post("/api/conversation", {
        messages: newMessages,
      });

      setMessages((current) => [...current, userMessage, response.data]);

      form.reset();
    } catch (error: any) {
      // TODO: Open Pro Model
      console.log(error);
    } finally {
      router.refresh();
    }
  };

  return (
    <Layout>
      <div className="w-full min-h-screen px-2 py-[3rem] sm:py-3 ">
        <Heading
          title="Conversation"
          description="Revolutionize conversations with our leading-edge AI model, setting new standards in natural language understanding"
          icon={MessageSquare}
          iconColor="text-blue-600"
          bgColor="bg-blue-500/10"
        />

        <div className="px-4">
          <div className="">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="rounded-md border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid
                grid-cols-12 gap-2"
              >
                <FormField
                  name="prompt"
                  render={({ field }) => (
                    <FormItem className="col-span-12 lg:col-span-10">
                      <FormControl className="m-0 p-0">
                        <Input
                          className="border-0 outline-none focus-visible:ring-0
                        focus-visible:ring-transparent px-3 "
                          disabled={isLoading}
                          placeholder="Enter your prompt"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button
                  className="col-span-12 lg:col-span-2"
                  disabled={isLoading}
                >
                  Generate
                </Button>
              </form>
            </Form>
          </div>

          <div className="space-y-4 mt-4">
            {isLoading && (
              <div className="p-8 rounded-lg w-full flex items-center justify-center bg-muted">
                <Loader />
              </div>
            )}
            {messages.length === 0 && !isLoading && (
              <div className="">
                <Empty lable="No conversation started." />
              </div>
            )}
            <div className="flex flex-col-reverse gap-y-4">
              {messages?.map((message, index) => (
                <div
                  className={cn(
                    "py-8 px-3 w-full flex items-start gap-x-8 rounded-lg",
                    message.role === "user"
                      ? "bg-white border border-black/10"
                      : "bg-muted"
                  )}
                  key={index}
                >
                  {message.role === "user" ? <UserAvatar /> : <BotAvatar />}
                  <p className="text-sm"> {message.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
