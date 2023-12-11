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
    namespace: userId,
  });
  // namespace: file.id,

  const results = await vectorStore.similaritySearch(message, 4);
  const pageNumber =
    results[0].metadata["loc.pageNumber"] ||
    (results[0].metadata["line"] as number);
  const title =
    results[0].metadata["pdf.info.Title"] ||
    (results[0].metadata["blobType"] as string);
  console.log(results);
  console.log(title, pageNumber);

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
          pageNumber: pageNumber,
          title: title,
        },
      });
    },
  });

  return new StreamingTextResponse(stream);
};

// // -------------------2------------------->

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
//   // endpoint for asking a question to a pdf file

//   const body = await req.json();

//   const { getUser } = getKindeServerSession();
//   const user = getUser();

//   const { id: userId } = user;

//   if (!userId) return new Response("Unauthorized", { status: 401 });

//   const { fileId, message } = SendMessageValidator.parse(body);

//   const file = await db.file.findMany({
//     where: {
//       userId,
//     },
//   });

//   if (!file || file.length === 0) {
//     return new Response("Files not found", { status: 404 });
//   }

//   // Assuming you want to loop through each file.id
//   for (const fileInfo of file) {
//     const fileId = fileInfo.id;

//     // Your existing code to create a message
//     await db.message.create({
//       data: {
//         text: message,
//         isUserMessage: true,
//         userId,
//         fileId,
//       },
//     });

//     // 1: vectorize message
//     const embeddings = new OpenAIEmbeddings({
//       openAIApiKey: process.env.OPENAI_API_KEY,
//     });

//     const pinecone = await getPineconeClient();
//     const pineconeIndex = pinecone.Index("chatpdf");

//     // Assuming you want to use fileId as the namespace
//     const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
//       pineconeIndex,
//       namespace: fileId,
//     });

//     // Perform any additional actions using fileId if needed

//     const results = await vectorStore.similaritySearch(message, 4);
//     console.log(results);

//     const prevMessages = await db.message.findMany({
//       where: {
//         fileId,
//       },
//       orderBy: {
//         createdAt: "asc",
//       },
//       take: 6,
//     });

//     const formattedPrevMessages = prevMessages.map((msg) => ({
//       role: msg.isUserMessage ? ("user" as const) : ("assistant" as const),
//       content: msg.text,
//     }));
//     // 3.5-turbo //gpt-3.5-turbo-16k
//     const response = await openai.chat.completions.create({
//       model: "gpt-3.5-turbo-16k",
//       temperature: 0,
//       stream: true,
//       messages: [
//         {
//           role: "system",
//           content:
//             "Use the following pieces of context (or previous conversaton if needed) to answer the users question in markdown format.",
//         },
//         {
//           role: "user",
//           content: `Use the following pieces of context (or previous conversaton if needed) to answer the users question in markdown format. \nIf you don't know the answer, just say that you don't know, don't try to make up an answer.

//   \n----------------\n

//   PREVIOUS CONVERSATION:
//   ${formattedPrevMessages.map((message) => {
//     if (message.role === "user") return `User: ${message.content}\n`;
//     return `Assistant: ${message.content}\n`;
//   })}

//   \n----------------\n

//   CONTEXT:
//   ${results.map((r) => r.pageContent).join("\n\n")}

//   USER INPUT: ${message}`,
//         },
//       ],
//     });

//     const stream = OpenAIStream(response, {
//       async onCompletion(completion) {
//         await db.message.create({
//           data: {
//             text: completion,
//             isUserMessage: false,
//             fileId,
//             userId,
//           },
//         });
//       },
//     });

//     return new StreamingTextResponse(stream);
//   }
// };

// // -------------------2------------------->
