import { db } from "@/db";
import { openai } from "@/lib/openai";
import { getPineconeClient } from "@/lib/pinecone";
import { SendMessageValidator } from "@/lib/validators/SendMessageValidator";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { PineconeStore } from "langchain/vectorstores/pinecone";
import { NextRequest } from "next/server";

import { OpenAIStream, StreamingTextResponse } from "ai";

export const POST = async (req: NextRequest) => {
  // endpoint for asking a question to a pdf file

  const body = await req.json();

  const { getUser } = getKindeServerSession();
  const user = getUser();

  const { id: userId } = user;

  if (!userId) return new Response("Unauthorized", { status: 401 });

  const { fileId, message } = SendMessageValidator.parse(body);

  const file = await db.file.findFirst({
    where: {
      id: fileId,
      userId,
    },
  });

  if (!file) return new Response("Not found", { status: 404 });

  await db.message.create({
    data: {
      text: message,
      isUserMessage: true,
      userId,
      fileId,
    },
  });

  // 1: vectorize message
  const embeddings = new OpenAIEmbeddings({
    openAIApiKey: process.env.OPENAI_API_KEY,
  });

  const pinecone = await getPineconeClient();
  const pineconeIndex = pinecone.Index("test");

  const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
    pineconeIndex,
    namespace: file.id,
  });

  const results = await vectorStore.similaritySearch(message, 4);

  const prevMessages = await db.message.findMany({
    where: {
      fileId,
    },
    orderBy: {
      createdAt: "asc",
    },
    take: 6,
  });

  const formattedPrevMessages = prevMessages.map((msg) => ({
    role: msg.isUserMessage ? ("user" as const) : ("assistant" as const),
    content: msg.text,
  }));
  // 3.5-turbo
  const response = await openai.chat.completions.create({
    model: "gpt-4",
    temperature: 0,
    stream: true,
    messages: [
      {
        role: "system",
        content:
          "Use the following pieces of context (or previous conversaton if needed) to answer the users question in markdown format.",
      },
      {
        role: "user",
        content: `Use the following pieces of context (or previous conversaton if needed) to answer the users question in markdown format. \nIf you don't know the answer, just say that you don't know, don't try to make up an answer.

  \n----------------\n

  PREVIOUS CONVERSATION:
  ${formattedPrevMessages.map((message) => {
    if (message.role === "user") return `User: ${message.content}\n`;
    return `Assistant: ${message.content}\n`;
  })}

  \n----------------\n

  CONTEXT:
  ${results.map((r) => r.pageContent).join("\n\n")}

  USER INPUT: ${message}`,
      },
    ],
  });

  const stream = OpenAIStream(response, {
    async onCompletion(completion) {
      await db.message.create({
        data: {
          text: completion,
          isUserMessage: false,
          fileId,
          userId,
        },
      });
    },
  });

  return new StreamingTextResponse(stream);
};

// -------------------3------------>

// import { db } from "@/db";
// import { openai } from "@/lib/openai";
// import { getPineconeClient } from "@/lib/pinecone";
// import { SendMessageValidator } from "@/lib/validators/SendMessageValidator";
// import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
// import { OpenAIEmbeddings } from "langchain/embeddings/openai";
// import { PineconeStore } from "langchain/vectorstores/pinecone";
// import { NextRequest } from "next/server";

// import { OpenAIStream, StreamingTextResponse } from "ai";

// export const POST = async (req: NextRequest) => {
//   const body = await req.json();

//   const { getUser } = getKindeServerSession();
//   const user = getUser();

//   const { id: userId } = user;

//   if (!userId) return new Response("Unauthorized", { status: 401 });

//   const { fileId, message } = SendMessageValidator.parse(body);

//   const file = await db.file.findFirst({
//     where: {
//       id: fileId,
//       userId,
//     },
//   });

//   if (!file) return new Response("Not found", { status: 404 });

//   await db.message.create({
//     data: {
//       text: message,
//       isUserMessage: true,
//       userId,
//       fileId,
//     },
//   });

//   // 1: vectorize message
//   const embeddings = new OpenAIEmbeddings({
//     openAIApiKey: process.env.OPENAI_API_KEY,
//   });

//   const pinecone = await getPineconeClient();
//   const pineconeIndex = pinecone.Index("test");

//   const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
//     pineconeIndex,
//     namespace: file.id,
//   });

//   const results = await vectorStore.similaritySearch(message, 4);

//   const prevMessages = await db.message.findMany({
//     where: {
//       fileId,
//     },
//     orderBy: {
//       createdAt: "asc",
//     },
//     take: 6,
//   });

//   const formattedPrevMessages = prevMessages.map((msg) => ({
//     role: msg.isUserMessage ? "user" : "assistant",
//     content: msg.text,
//   }));

//   // System message as context
//   const systemMessage = {
//     role: "system",
//     content:
//       "Use the following pieces of context to answer the user's question.",
//   };

//   // User message
//   const userMessage = {
//     role: "user",
//     content: `User input: ${message}`,
//   };

//   // Combine system, previous messages, and user message
//   const allMessages = [systemMessage, ...formattedPrevMessages, userMessage];

//   // Truncate messages to fit within the token limit
//   const truncatedMessages = truncateMessages(allMessages, 4097);

//   // 3.5-turbo
//   const response = await openai.chat.completions.create({
//     model: "gpt-3.5-turbo",
//     temperature: 0,
//     stream: true,
//     messages: truncatedMessages,
//   });

//   const stream = OpenAIStream(response, {
//     async onCompletion(completion) {
//       await db.message.create({
//         data: {
//           text: completion,
//           isUserMessage: false,
//           fileId,
//           userId,
//         },
//       });
//     },
//   });

//   return new StreamingTextResponse(stream);
// };

// // Function to truncate messages to fit within the token limit
// function truncateMessages(messages: any, maxTokens: any) {
//   let totalTokens = 0;
//   let truncatedMessages = [];

//   for (const msg of messages) {
//     const msgTokens = msg.content.split(" ").length; // Adjust based on your tokenization logic
//     if (totalTokens + msgTokens <= maxTokens) {
//       truncatedMessages.push(msg);
//       totalTokens += msgTokens;
//     } else {
//       break;
//     }
//   }

//   return truncatedMessages;
// }

// ----------------------3------------------>
