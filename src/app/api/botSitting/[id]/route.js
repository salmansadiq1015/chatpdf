import { db } from "@/db";
import { NextResponse } from "next/server";

export async function PUT(req, content) {
  const userId = content.params.id;
  const body = await req.json();
  const { botName, avatar, message, color } = body;

  try {
    const existingBotSettings = await db.botSettings.findFirst({
      where: {
        userId: userId,
      },
    });

    if (!existingBotSettings) {
      return NextResponse.json(
        { message: "Bot not found to this userId" },
        { status: 400 }
      );
    }

    const updatedBotSettings = await db.BotSettings.update({
      where: {
        id: existingBotSettings.id,
      },
      data: {
        botName,
        avatar,
        message,
        color,
      },
    });

    return NextResponse.json(
      { botSettings: updatedBotSettings, success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// Get BotSettings bu User ID(api/botSitting/${userId})
export async function GET(req, content) {
  try {
    const userId = content.params.id;

    const response = await db.botSettings.findFirst({
      where: {
        userId: userId,
      },
    });

    return NextResponse.json({ response }, { status: 200 });
  } catch (error) {
    console.log(errpr);
    return NextResponse.json("Error while getting bot settings", {
      status: 500,
    });
  }
}
