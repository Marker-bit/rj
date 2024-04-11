import { lucia } from "@/lib/auth";
import { db } from "@/lib/db";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { Argon2id } from "oslo/password";

export async function POST(request: NextRequest) {
  const data = await request.json();
  const username = data.username;
  const password = data.password;
  const hashedPassword = await new Argon2id().hash(password);

  const user = await db.user.findFirst({
    where: {
      username: username,
    },
  });
  if (user) {
    return NextResponse.json(
      {
        error: "Пользователь с таким именем уже существует",
      },
      { status: 400 }
    );
  }

  const createdUser = await db.user.create({
    data: {
      username: username,
      hashedPassword,
      active: true,
      firstName: data.firstName,
      lastName: data.lastName,
    },
  });

  const session = await lucia.createSession(createdUser.id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );
  return new NextResponse(null, { status: 200 });
}
