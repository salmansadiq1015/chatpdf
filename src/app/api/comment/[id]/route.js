import { db } from "@/db";
import { NextResponse } from "next/server";

export async function DELETE(req, content) {
  const id = content.params.id;

  try {
    await db.comment.delete({
      where: {
        id: id,
      },
    });
    return NextResponse.json(
      { message: "Delete successful", success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting comment:", error);
    return NextResponse.json(
      { message: "Error deleting comment", success: false },
      { status: 500 }
    );
  }
}
