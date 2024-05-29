import { db } from "@/lib/db";
import { validateRequest } from "@/lib/server-validate-request";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: { collectionId: string } }
) {
  const { user } = await validateRequest();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await req.json();
  await db.collection.update({
    where: {
      id: params.collectionId,
    },
    data: {
      books: {
        connect: data.map((d: string) => ({ id: d })),
      },
    },
  });

  return NextResponse.json({ success: true });
}
