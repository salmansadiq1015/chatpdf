import { LayoutProps } from "./../../../../.next/types/app/page";
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
  // 3.5-turbo //gpt-3.5-turbo-16k
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo-16k",
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

// // --------------2---------------->

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
//     role: msg.isUserMessage ? ("user" as const) : ("assistant" as const),
//     content: msg.text,
//   }));

//   // Function to truncate text to fit within a certain token limit
//   const truncateTextToFitModelLimit = (
//     text: string,
//     maxTokens: number
//   ): string => {
//     const tokens = text.split(/\s+/);
//     let currentTokens = 0;
//     let truncatedText = "";

//     for (const token of tokens) {
//       currentTokens += token.length + 1; // Add 1 for the space between tokens
//       if (currentTokens <= maxTokens) {
//         truncatedText += `${token} `;
//       } else {
//         break;
//       }
//     }

//     return truncatedText.trim();
//   };

//   // Reduce the number of tokens in formattedPrevMessages to fit within the model's limit
//   const truncatedPrevMessages = formattedPrevMessages.slice(0, 5); // Adjust the number as needed

//   // Concatenate previous conversation and context, truncating if necessary
//   const context = `
//   PREVIOUS CONVERSATION:
//   ${truncatedPrevMessages.map((message) => {
//     if (message.role === "user") return `User: ${message.content}\n`;
//     return `Assistant: ${message.content}\n`;
//   })}

//   \n----------------\n

//   CONTEXT:
//   ${results.map((r) => r.pageContent).join("\n\n")}

//   USER INPUT: ${message}`;

//   // Truncate the context if it exceeds the model's token limit
//   const truncatedContext = truncateTextToFitModelLimit(context, 4097); // Define this function (see above)

//   const response = await openai.chat.completions.create({
//     model: "gpt-3.5-turbo",
//     temperature: 0,
//     stream: true,
//     messages: [
//       {
//         role: "system",
//         content:
//           "Use the following pieces of context (or previous conversation if needed) to answer the users question in markdown format.",
//       },
//       {
//         role: "user",
//         content: truncatedContext, // Use the truncated context
//       },
//     ],
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

// ----------------3--------------->
