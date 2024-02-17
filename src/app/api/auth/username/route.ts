import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const username = req.nextUrl.searchParams.get("username");
  if (!username) return NextResponse.json({ found: true });
  const user = await db.user.findFirst({ where: { username } });
  if (user) return NextResponse.json({ found: true });
  return NextResponse.json({ found: false });
}
