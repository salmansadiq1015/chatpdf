import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextResponse } from "next/server";
import OpenAI from "openai";
import { ChatCompletionRequestMessage } from "openai-edge";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY as string, // Assuming OPENAI_API_KEY is a string
});

const instructionMessage: ChatCompletionRequestMessage = {
  role: "system",
  content:
    "You are a code generator. You must answer only markdown code snippets. Use code comments  for explanations.",
};

export async function POST(req: Request): Promise<NextResponse> {
  try {
    const { getUser } = getKindeServerSession();
    const user = getUser();
    const userId = user.id;

    const body = await req.json();
    const { messages } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 404 });
    }
    if (!openai.apiKey) {
      return new NextResponse("OpenAI API key not configured", { status: 500 });
    }

    if (!messages) {
      return new NextResponse("Messages are required", { status: 400 });
    }

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [instructionMessage, ...messages],
    });

    return NextResponse.json(response.choices[0].message);
  } catch (error) {
    console.log("[Code Error]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
