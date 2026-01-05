import { GroupMemberRole } from "@prisma/client";
import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { validateRequest } from "@/lib/server-validate-request";

export async function PATCH(
  req: NextRequest,
  props: { params: Promise<{ groupId: string; memberId: string }> },
) {
  const params = await props.params;
  const { user } = await validateRequest();

  if (!user) {
    return new NextResponse("Unauthorized", {
      status: 401,
    });
  }

  const group = await db.group.findUniqueOrThrow({
    where: {
      id: params.groupId,
      members: {
        some: {
          userId: user.id,
          role: {
            in: [GroupMemberRole.CREATOR, GroupMemberRole.MODERATOR],
          },
        },
      },
    },
    include: {
      members: true,
    },
  });

  if (!group) {
    return NextResponse.json(
      {
        error:
          "Не существует группы, вы не состоите в ней или вы не создатель и не модератор",
      },
      { status: 404 },
    );
  }

  const userMember = group.members.find((member) => member.userId === user.id);
  const member = group.members.find((member) => member.id === params.memberId);
  const body = (await req.json()) as { role: GroupMemberRole };

  if (userMember?.role !== GroupMemberRole.CREATOR) {
    return NextResponse.json(
      {
        error: "Вы не создатель группы",
      },
      { status: 403 },
    );
  }

  if (body.role === GroupMemberRole.CREATOR) {
    return NextResponse.json(
      {
        error: "Нельзя назначить создателя",
      },
      { status: 400 },
    );
  }

  if (!member) {
    return NextResponse.json(
      {
        error: "Не существует участника группы",
      },
      { status: 404 },
    );
  }

  const _updatedMember = await db.groupMember.update({
    where: {
      id: params.memberId,
    },
    data: {
      role: body.role,
    },
  });

  return NextResponse.json({
    message: "Роль участника успешно изменена",
  });
}

export async function DELETE(
  _req: NextRequest,
  props: { params: Promise<{ groupId: string; memberId: string }> },
) {
  const params = await props.params;
  const { user } = await validateRequest();

  if (!user) {
    return new NextResponse("Unauthorized", {
      status: 401,
    });
  }

  const group = await db.group.findUniqueOrThrow({
    where: {
      id: params.groupId,
      members: {
        some: {
          userId: user.id,
          role: {
            in: [GroupMemberRole.CREATOR, GroupMemberRole.MODERATOR],
          },
        },
      },
    },
    include: {
      members: true,
    },
  });

  if (!group) {
    return NextResponse.json(
      {
        error:
          "Не существует группы, вы не состоите в ней или вы не создатель и не модератор",
      },
      { status: 404 },
    );
  }

  const userMember = group.members.find((member) => member.userId === user.id);
  const member = group.members.find((member) => member.id === params.memberId);

  if (
    userMember?.role === GroupMemberRole.MODERATOR &&
    member?.role === GroupMemberRole.MODERATOR
  ) {
    return NextResponse.json(
      {
        error: "Модератор не может исключить модератора",
      },
      { status: 400 },
    );
  } else if (
    userMember?.role === GroupMemberRole.CREATOR &&
    member?.role === GroupMemberRole.CREATOR
  ) {
    return NextResponse.json(
      {
        error: "Создатель не может исключить создателя",
      },
      { status: 400 },
    );
  } else if (
    userMember?.role === GroupMemberRole.MODERATOR &&
    member?.role === GroupMemberRole.CREATOR
  ) {
    return NextResponse.json(
      {
        error: "Модератор не может исключить создателя",
      },
      { status: 400 },
    );
  }

  await db.groupMember.delete({
    where: {
      id: params.memberId,
    },
  });

  await db.group.update({
    where: {
      id: params.groupId,
    },
    data: {
      blockedUsers: {
        connect: {
          id: member?.userId,
        },
      },
    },
  });

  return NextResponse.json({ message: "Участник исключен" }, { status: 200 });
}
