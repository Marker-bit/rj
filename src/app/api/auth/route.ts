import { lucia } from "@/lib/auth";
import { db } from "@/lib/db";
import { setCookie } from "cookies-next";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { Argon2id } from "oslo/password";
import { validateRequest } from "./session/route";

export async function POST(request: NextRequest) {
  const data = await request.json();
  const username = data.username;
  const password = data.password;
  const hashedPassword = await new Argon2id().hash(password);

  // TODO: check if username is already used
  // await db.table("user").insert({
  //   id: userId,
  // username: username,
  // hashed_password: hashedPassword
  // });
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
      console.log(sessionCookie);
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      );
      return NextResponse.json({
        ...user,
        hashedPassword: null,
      });
    } else {
      return NextResponse.json(
        {
          errors: ["Invalid password"],
        },
        {
          status: 400,
        }
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
  console.log(sessionCookie);
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );
  return NextResponse.json({
    ...createdUser,
    hashedPassword: null,
  });
}

export async function DELETE(request: NextRequest) {
  const { session } = await validateRequest();
	if (!session) {
		return {
			error: "Unauthorized"
		};
	}

	await lucia.invalidateSession(session.id);

	const sessionCookie = lucia.createBlankSessionCookie();
	cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
	return new NextResponse();
}
