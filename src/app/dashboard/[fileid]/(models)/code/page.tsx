"use client";

import React, { useState } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import Layout from "@/components/layout/Layout";
import Heading from "@/components/Models/Heading";
import { Code2 } from "lucide-react";
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
import ReactMarkdown from "react-markdown";

// type MyFormProviderProps = FormProviderProps<z.infer<typeof formSchema>> & {
//   children: React.ReactNode;
// };

export default function Code() {
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

      const response = await axios.post("/api/code", {
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
      <div className="w-full min-h-screen px-2 py-[3rem] sm:py-3">
        <Heading
          title="Code Generation"
          description="Generate Code using descriptive text."
          icon={Code2}
          iconColor="text-orange-600"
          bgColor="bg-orange-500/10"
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
                          placeholder="Enter prompt to generate code"
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

          <div className="space-y-4 mt-4 ">
            {isLoading && (
              <div className="p-8 rounded-lg w-full flex items-center justify-center bg-muted">
                <Loader />
              </div>
            )}
            {messages.length === 0 && !isLoading && (
              <div className="w-full overflow-hidden">
                <Empty lable="No conversation started." />
              </div>
            )}
            <div className="flex flex-col-reverse gap-y-4 w-full overflow-hidden">
              {messages?.map((message, index) => (
                <div
                  className={cn(
                    "py-8 px-3 w-full flex items-start gap-x-6 rounded-lg",
                    message.role === "user"
                      ? "bg-white border border-black/10"
                      : "bg-muted"
                  )}
                  key={index}
                >
                  {message.role === "user" ? <UserAvatar /> : <BotAvatar />}

                  <ReactMarkdown className="prose text-sm overflow-hidden leading-7">
                    {message.content || ""}
                  </ReactMarkdown>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

{
  /* <ReactMarkdown
                    components={{
                      pre: ({ node, ...props }) => (
                        <div className="overflow-auto w-full my-2 bg-blue-500/10 p-2 rounded-lg">
                          <pre {...props} />
                        </div>
                      ),
                      code: ({ node, ...props }) => (
                        <code
                          className="bg-black/10 rounded-lg p-1"
                          {...props}
                        />
                      ),
                    }}
                    className="text-sm overflow-hidden leading-7"
                  >
                    {message.content || ""}
                  </ReactMarkdown> */
}
