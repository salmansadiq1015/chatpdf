import { db } from "@/db";
import { NextResponse } from "next/server";

// Handle POST request
export async function POST(req, res) {
  const { userId, text, email, rating } = await req.json();

  if (!text || !userId) {
    return NextResponse.json(
      { error: "Text and userId are required fields" },
      { status: 400 }
    );
  }

  // Create a new Comment using Prisma
  try {
    const comment = await db.comment.create({
      data: {
        text,
        userId,
        email,
        rating,
      },
    });

    // Return the created Comment
    return NextResponse.json({ comment, success: true }, { status: 200 });
  } catch (error) {
    console.error("Error creating Comment:", error);

    // Return an error response
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req, res) {
  const { id } = await req.json();

  await db.comment.delete({
    id: id,
  });

  return NextResponse.json(
    { message: "Delete successfullly", success: true },
    { status: 200 }
  );
}
