import { db } from "@/db";
import { NextResponse } from "next/server";

export async function DELETE(req, content) {
  const id = content.params.id;

  await db.comment.delete({
    where: {
      id: id,
    },
  });
  return NextResponse.json(
    { message: "Delete successfullly", success: true },
    { status: 200 }
  );
}
