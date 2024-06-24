import { NextRequest, NextResponse } from "next/server"
import { Argon2id } from "oslo/password"

export async function GET(req: NextRequest) {
  const password = req.nextUrl.searchParams.get("password") as string
  if (!password) return NextResponse.json({})
  const hashedPassword = await new Argon2id().hash(password)
  return NextResponse.json({ hashedPassword: hashedPassword })
}
