import { db } from "@/lib/db";
import { validateRequest } from "@/lib/server-validate-request";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { collectionId: string } }
) {
  const { user } = await validateRequest();
  if (!user) {
    return new NextResponse("Not Authorized", {
      status: 401,
    });
  }
  const collectionId = params.collectionId;
  await db.collection.delete({
    where: {
      id: collectionId,
      userId: user.id,
    },
  });

  return NextResponse.json({ success: true });
}
