import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { validateRequest } from "@/lib/server-validate-request";

export async function GET(req: NextRequest) {
  const { user } = await validateRequest();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const collections = await db.collection.findMany({
    where: {
      userId: user.id,
    },
    include: {
      books: true,
      user: false,
    },
  });
  return NextResponse.json(collections);
}

export async function POST(req: NextRequest) {
  const { user } = await validateRequest();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const data = await req.json();
  const collection = await db.collection.create({
    data: {
      ...data,
      userId: user.id,
    },
  });
  return NextResponse.json(collection);
}
