import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { validateRequest } from "@/lib/server-validate-request";

export async function POST(
  _req: NextRequest,
  props: { params: Promise<{ username: string }> },
) {
  const params = await props.params;
  const { user: currentUser } = await validateRequest();

  if (!currentUser) {
    return new NextResponse("Not Authorized", {
      status: 401,
    });
  }

  const user = await db.user.findFirst({
    where: {
      username: params.username,
    },
  });

  if (!user) {
    return NextResponse.json(
      { error: "Пользователь не найден" },
      { status: 404 },
    );
  }

  if (user.id === currentUser.id) {
    return NextResponse.json(
      { error: "Нельзя подписаться на себя" },
      { status: 400 },
    );
  }

  const _follow = await db.follow.create({
    data: {
      firstId: currentUser.id,
      secondId: user.id,
    },
  });

  return NextResponse.json({ message: `Вы подписались на @${user.username}` });
}

export async function DELETE(
  _req: NextRequest,
  props: { params: Promise<{ username: string }> },
) {
  const params = await props.params;
  const { user: currentUser } = await validateRequest();

  if (!currentUser) {
    return new NextResponse("Not Authorized", {
      status: 401,
    });
  }

  const user = await db.user.findFirst({
    where: {
      username: params.username,
    },
  });

  if (!user) {
    return NextResponse.json(
      { error: "Пользователь не найден" },
      { status: 404 },
    );
  }

  await db.follow.deleteMany({
    where: {
      firstId: currentUser.id,
      secondId: user.id,
    },
  });

  return NextResponse.json({ message: `Вы отписались от @${user.username}` });
}
