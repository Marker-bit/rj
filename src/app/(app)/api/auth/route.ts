import { USERNAME_MESSAGE, USERNAME_REGEX } from "@/lib/api-validate";
import { lucia } from "@/lib/auth";
import { db } from "@/lib/db";
import { validateRequest } from "@/lib/server-validate-request";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { hash, verify } from "@node-rs/argon2";

export async function POST(request: NextRequest) {
  const data = await request.json();
  const username = data.username;
  const password = data.password;
  const hashedPassword = await hash(password);

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
      return NextResponse.json({
        status: "authorized",
      });
    } else {
      return NextResponse.json(
        {
          status: "invalid-password",
        },
        {
          status: 400,
        },
      );
    }
  }

  const createdUser = await db.user.create({
    data: {
      username: username,
      hashedPassword,
    },
  });

  const session = await lucia.createSession(createdUser.id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  (await cookies()).set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );
  return NextResponse.json({
    status: "created",
  });
}

export async function PATCH(request: NextRequest) {
  const { user } = await validateRequest();
  if (!user) {
    return new NextResponse("Not Authorized", {
      status: 401,
    });
  }

  const d = await request.json();

  if (d.firstName !== null && d.length < 3) {
    return NextResponse.json({
      error: "Длина имени должна быть не менее 3-х символов",
    });
  }

  if (d !== null && d.length < 3) {
    return NextResponse.json({
      error: "Длина фамилии должна быть не менее 3-х символов",
    });
  }

  if (USERNAME_REGEX.test(d.username) === false) {
    return NextResponse.json(
      {
        error: USERNAME_MESSAGE,
      },
      { status: 400 },
    );
  }

  const existingUser = await db.user.findFirst({
    where: {
      username: d.username,
    },
  });

  if (existingUser && existingUser.id !== user.id) {
    return NextResponse.json(
      {
        error: "Пользователь с таким именем уже существует",
      },
      { status: 400 },
    );
  }
  const updatedUser = await db.user.update({
    where: {
      id: user.id,
    },
    data: {
      firstName: d.firstName,
      lastName: d.lastName,
      username: d.username,
      shareFollowers: d.shareFollowers,
      shareSubscriptions: d.shareSubscriptions,
      shareStats: d.shareStats,
      avatarUrl: d.avatarUrl,
      active: true,
      hideActivity: d.hideActivity,
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
    sessionCookie.attributes,
  );
  return new NextResponse();
}
