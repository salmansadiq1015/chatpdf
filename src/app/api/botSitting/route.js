import { db } from "@/db";
import { NextResponse } from "next/server";

export async function POST(req, res) {
  const body = await req.json();
  const { userId, botName, avatar, message, color } = body;

  const isUserBotExist = await db.botSettings.findFirst({
    where: {
      userId: userId,
    },
  });

  if (isUserBotExist) {
    return NextResponse.json({ message: "Bot already exist" }, { status: 400 });
  }

  if (!userId) {
    return NextResponse.json(
      { error: " UserId are required fields" },
      { status: 400 }
    );
  }

  try {
    const botSettings = await db.BotSettings.create({
      data: {
        userId,
        botName,
        avatar,
        message,
        color,
      },
    });

    return NextResponse.json({ botSettings, success: true }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
