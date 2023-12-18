import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY as string, // Assuming OPENAI_API_KEY is a string
});

export async function POST(req: Request) {
  try {
    const { getUser } = getKindeServerSession();
    const user = getUser();
    const userId = user.id;

    const body = await req.json();
    // const { prompt, amount = "1", resolution = "512x512" } = body;
    const { prompt, amount = 1, resolution = "512x512" } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 404 });
    }
    if (!openai.apiKey) {
      return new NextResponse("OpenAI API key not configured", { status: 500 });
    }

    if (!prompt) {
      return new NextResponse("Prompt are required", { status: 400 });
    }

    if (!amount) {
      return new NextResponse("Amount are required", { status: 400 });
    }
    if (!resolution) {
      return new NextResponse("Resolution are required", { status: 400 });
    }

    const response = await openai.images.generate({
      prompt: prompt,
      size: resolution,
      n: parseInt(amount, 10),
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.log("[Image Error]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
