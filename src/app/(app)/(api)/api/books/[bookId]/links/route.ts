import { db } from "@/lib/db";
import { validateRequest } from "@/lib/server-validate-request";
import { NextRequest, NextResponse } from "next/server";
export async function POST(
  req: NextRequest,
  { params }: { params: { bookId: string } }
) {
  const bookId = params.bookId;
  const { user } = await validateRequest();
  if (!user) {
    return new NextResponse("Not Authorized", {
      status: 401,
    });
  }
  const link = await db.bookLink.create({
    data: {
      bookId,
    },
  });
  return NextResponse.json(link);
}
