import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const username = req.nextUrl.searchParams.get("username");
  if (!username) return NextResponse.json({ found: true });
  const user = await db.user.findFirst({ where: { username } });
  if (user) return NextResponse.json({ found: true });
  return NextResponse.json({ found: false });
}
