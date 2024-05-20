import { lucia } from "@/lib/auth"
import { db } from "@/lib/db"
import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"
import { Argon2id } from "oslo/password"
import {
  USERNAME_REGEX,
  USERNAME_MESSAGE,
  PASSWORD_REGEX,
  PASSWORD_MESSAGE,
} from "@/lib/api-validate"
import { createAvatar } from "@dicebear/core"
import { shapes } from "@dicebear/collection"
import { utapi } from "../../uploadthing/core"

export async function POST(request: NextRequest) {
  const data = await request.json()
  const username = data.username
  const password = data.password
  const hashedPassword = await new Argon2id().hash(password)

  const user = await db.user.findFirst({
    where: {
      username: username,
    },
  })
  if (user) {
    return NextResponse.json(
      {
        error: "Пользователь с таким именем уже существует",
      },
      { status: 400 }
    )
  }

  if (USERNAME_REGEX.test(username) === false) {
    return NextResponse.json(
      {
        error: USERNAME_MESSAGE,
      },
      { status: 400 }
    )
  }

  if (PASSWORD_REGEX.test(password) === false) {
    return NextResponse.json(
      {
        error: PASSWORD_MESSAGE,
      },
      { status: 400 }
    )
  }

  if (
    !data.firstName ||
    !data.lastName ||
    data.firstName.length < 3 ||
    data.lastName.length < 3
  ) {
    return NextResponse.json(
      {
        error: "Укажите имя и фамилию (мин. 3 символа)",
      },
      { status: 400 }
    )
  }

  const avatar = createAvatar(shapes, {
    seed: username,
    size: 100,
  })

  const png = await avatar.png()
  const buffer = await png.toArrayBuffer()

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
  })

  const session = await lucia.createSession(createdUser.id, {})
  const sessionCookie = lucia.createSessionCookie(session.id)
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  )
  return new NextResponse(null, { status: 200 })
}
