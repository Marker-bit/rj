import { hash } from "@node-rs/argon2"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  const password = req.nextUrl.searchParams.get("password") as string
  if (!password) return NextResponse.json({})
  const hashedPassword = await hash(password)
  return NextResponse.json({ hashedPassword: hashedPassword })
}
