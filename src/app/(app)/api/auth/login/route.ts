import { lucia } from "@/lib/auth";
import { db } from "@/lib/db";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { Argon2id } from "oslo/password";
import { validateRequest } from "@/lib/server-validate-request";

export async function POST(request: NextRequest) {
  const data = await request.json();
  const username = data.username;
  const password = data.password;

  const user = await db.user.findFirst({
    where: {
      username: username,
    },
  });
  if (user) {
    const validPassword = await new Argon2id().verify(
      user.hashedPassword,
      password
    );

    if (validPassword) {
      const session = await lucia.createSession(user.id, {});
      const sessionCookie = lucia.createSessionCookie(session.id);
      (await cookies()).set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      );
      
      return NextResponse.json(null, { status: 200 });
    } else {
      return NextResponse.json(
        {
          error: "Неправильный логин или пароль",
        },
        {
          status: 400,
        }
      );
    }
  }

  return NextResponse.json(
    {
      error: "Неправильный логин или пароль",
    },
    {
      status: 400,
    }
  );
}

export async function PATCH(request: NextRequest) {
  const { user } = await validateRequest();
  if (!user) {
    return new NextResponse("Not Authorized", {
      status: 401,
    });
  }

  const data = await request.json();
  const updatedUser = await db.user.update({
    where: {
      id: user.id,
    },
    data: {
      ...data,
      active: true,
    },
  });

  return NextResponse.json(updatedUser);
}

export async function DELETE(request: NextRequest) {
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
    sessionCookie.attributes
  );
  return new NextResponse();
}
