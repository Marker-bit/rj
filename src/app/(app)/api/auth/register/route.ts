import { hash } from "@node-rs/argon2";
import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { lucia } from "@/lib/auth";
import { db } from "@/lib/db";
import { checkRateLimit } from "@/lib/rate-limit";
import { validateRequest } from "@/lib/server-validate-request";
import { registerSchema } from "@/lib/validation/schemas";

export async function POST(request: NextRequest) {
  const { user: currentUser } = await validateRequest();

  if (currentUser) {
    return NextResponse.json(
      {
        error: "Вы уже зарегистрированы",
      },
      {
        status: 400,
      },
    );
  }
  const data = await request.json();

  const parsed = registerSchema.safeParse(data);
  if (!parsed.success) {
    const message = parsed.error.issues.map((i) => i.message).join(", ");
    return NextResponse.json(
      {
        error: message,
      },
      { status: 400 },
    );
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const rateLimit = checkRateLimit(`register:${ip}`, {
    limit: 5,
    windowMs: 60 * 60 * 1000,
  });
  if (!rateLimit.ok) {
    return NextResponse.json(
      {
        error: "Слишком много попыток",
      },
      { status: 429 },
    );
  }

  const { username, password, firstName, lastName } = parsed.data;
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
      { status: 400 },
    );
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
      firstName: firstName,
      lastName: lastName,
      // avatarUrl: files.data?.url,
    },
  });

  const session = await lucia.createSession(createdUser.id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  (await cookies()).set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );
  return NextResponse.json({ id: createdUser.id }, { status: 200 });
}
