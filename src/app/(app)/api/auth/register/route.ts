import {
  PASSWORD_MESSAGE,
  PASSWORD_REGEX,
  USERNAME_MESSAGE,
  USERNAME_REGEX,
} from "@/lib/api-validate";
import { lucia } from "@/lib/auth";
import { db } from "@/lib/db";
import { validateRequest } from "@/lib/server-validate-request";
import { registerSchema } from "@/lib/validation/schemas";
import { hash } from "@node-rs/argon2";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function POST(request: NextRequest) {
  const { user: currentUser } = await validateRequest();

  if (currentUser) {
    return NextResponse.json(
      {
        error: "Вы уже зарегистрированы",
      },
      {
        status: 400,
      }
    );
  }
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
    return NextResponse.json(
      {
        error: "Пользователь с таким именем уже существует",
      },
      { status: 400 }
    );
  }

  try {
    registerSchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const message = error.issues.map((i) => i.message).join(", ");
      return NextResponse.json(
        {
          error: message,
        },
        { status: 400 }
      );
      /* [
        {
          expected: 'string',
          code: 'invalid_type',
          path: [ 'username' ],
          message: 'Invalid input: expected string'
        },
        {
          expected: 'number',
          code: 'invalid_type',
          path: [ 'xp' ],
          message: 'Invalid input: expected number'
        }
      ] */
    }
  }

  // const avatar = createAvatar(shapes, {
  //   seed: username,
  //   size: 100,
  // })

  // const png = avatar.png()
  // const buffer = await png.toArrayBuffer()

  // const resp = await fetch("/api/uploadthing/uploadFiles", {
  //   method: "POST",
  //   body: JSON.stringify({
  //     files: [
  //       {
  //         name: "avatar.png",
  //         type: "image/png",
  //         buffer: buffer,
  //       },
  //     ],
  //   }),
  // })

  // const files = await utapi.uploadFiles(new File([buffer], "avatar.png"))

  const createdUser = await db.user.create({
    data: {
      username: username,
      hashedPassword,
      active: true,
      firstName: data.firstName,
      lastName: data.lastName,
      // avatarUrl: files.data?.url,
    },
  });

  const session = await lucia.createSession(createdUser.id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  (await cookies()).set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );
  return new NextResponse(null, { status: 200 });
}
