import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { checkRateLimit } from "@/lib/rate-limit";

export async function GET(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const rateLimit = checkRateLimit(`username:${ip}`, {
    limit: 60,
    windowMs: 60 * 1000,
  });
  if (!rateLimit.ok) {
    return NextResponse.json(
      {
        error: "Слишком много попыток",
      },
      { status: 429 },
    );
  }

  const username = req.nextUrl.searchParams.get("username");
  if (!username) return NextResponse.json({ found: true });
  const user = await db.user.findFirst({ where: { username } });
  if (user) return NextResponse.json({ found: true });
  return NextResponse.json({ found: false });
}
