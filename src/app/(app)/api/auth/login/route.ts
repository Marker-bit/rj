import { verify } from "@node-rs/argon2";
import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { lucia } from "@/lib/auth";
import { db } from "@/lib/db";
import { checkRateLimit } from "@/lib/rate-limit";
import { validateRequest } from "@/lib/server-validate-request";

export async function POST(request: NextRequest) {
  const data = await request.json();
  const username = data.username;
  const password = data.password;

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const rateLimit = checkRateLimit(
    `login:${ip}:${typeof username === "string" ? username : "unknown"}`,
    { limit: 5, windowMs: 15 * 60 * 1000 },
  );
  if (!rateLimit.ok) {
    return NextResponse.json(
      {
        error: "Слишком много попыток",
      },
      { status: 429 },
    );
  }

  if (typeof username !== "string" || typeof password !== "string") {
    return NextResponse.json(
      {
        error: "Неправильный логин или пароль",
      },
      { status: 400 },
    );
  }

  const user = await db.user.findFirst({
    where: {
      username: username,
    },
  });
  if (user) {
    const validPassword = await verify(user.hashedPassword, password);

    if (validPassword) {
      const session = await lucia.createSession(user.id, {});
      const sessionCookie = lucia.createSessionCookie(session.id);
      (await cookies()).set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      );

      return NextResponse.json({ id: user.id }, { status: 200 });
    } else {
      return NextResponse.json(
        {
          error: "Неправильный логин или пароль",
        },
        {
          status: 400,
        },
      );
    }
  }

  return NextResponse.json(
    {
      error: "Неправильный логин или пароль",
    },
    {
      status: 400,
    },
  );
}

export async function DELETE(_request: NextRequest) {
  const { session } = await validateRequest();
  if (!session) {
    return NextResponse.json({
      error: "Unauthorized",
    });
  }

  await lucia.invalidateSession(session.id);

  const sessionCookie = lucia.createBlankSessionCookie();
  (await cookies()).set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );
  return new NextResponse();
}
