// /api/embed

import { openai } from "@/lib/openai";
import { getPineconeClient } from "@/lib/pinecone";

import { OpenAIStream, StreamingTextResponse } from "ai";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { PineconeStore } from "langchain/vectorstores/pinecone";
import { NextRequest } from "next/server";

export const POST = async (req: NextRequest) => {
  // endpoint for asking a question to a pdf file

  const body = await req.json();

  const { userID, message } = body;

  const messages = message[0].content.toString();

  // 1: vectorize message
  const embeddings = new OpenAIEmbeddings({
    openAIApiKey: process.env.OPENAI_API_KEY,
  });

  const pinecone = await getPineconeClient();
  const pineconeIndex = pinecone.Index("test");

  const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
    pineconeIndex,
    namespace: userID,
  });

  // Ensure that message is a string
  const stringMessage = messages.toString();

  const results = await vectorStore.similaritySearch(stringMessage, 4);

  //   console.log(results);

  // 3.5-turbo //gpt-3.5-turbo-16k
  const response: any = await openai.chat.completions.create({
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

  CONTEXT:
  ${results.map((r) => r.pageContent).join("\n\n")}

  USER INPUT: ${stringMessage}`,
      },
    ],
  });

  const stream = OpenAIStream(response, {
    async onCompletion(completion: any) {
      return completion;
    },
  });

  return new StreamingTextResponse(stream);
};
