"use server";

import { createHash } from "node:crypto";
import { cookies } from "next/headers";
import { GroupMemberRole } from "@/generated/prisma/enums";
import { lucia } from "@/lib/auth";
import { hash, verify } from "@node-rs/argon2";
import { z } from "zod";
import { db } from "@/lib/db";
import { checkRateLimit, resetRateLimit } from "@/lib/rate-limit";
import { validateRequest } from "@/lib/server-validate-request";
import { registerSchema } from "@/lib/validation/schemas";

const passwordChangeSchema = z
  .object({
    currentPassword: z.string().min(1, "Введите текущий пароль"),
    password: registerSchema.shape.password,
    confirmPassword: z.string().min(1, "Повторите новый пароль"),
  })
  .refine(({ password, confirmPassword }) => password === confirmPassword, {
    message: "Пароли не совпадают",
  });

export async function changePassword(input: unknown) {
  const { user, session } = await validateRequest();
  if (!user) return { error: "Войдите в аккаунт снова" };

  const parsed = passwordChangeSchema.safeParse(input);
  if (!parsed.success)
    return {
      error: parsed.error.issues[0]?.message ?? "Проверьте введённые данные",
    };

  const rateLimitKey = `change-password:${user.id}`;
  if (!checkRateLimit(rateLimitKey, { limit: 5, windowMs: 15 * 60_000 }).ok) {
    return { error: "Слишком много попыток. Попробуйте через 15 минут." };
  }

  const { currentPassword, password } = parsed.data;
  const account = await db.user.findUnique({
    where: { id: user.id },
    select: { hashedPassword: true },
  });

  if (!account || !(await verify(account.hashedPassword, currentPassword))) {
    return { error: "Неверный текущий пароль" };
  }
  if (password === currentPassword) {
    return { error: "Новый пароль должен отличаться от текущего" };
  }

  const hashedPassword = await hash(password);
  const changed = await db.$transaction(async (tx) => {
    const updated = await tx.user.updateMany({
      where: { id: user.id, hashedPassword: account.hashedPassword },
      data: { hashedPassword },
    });
    if (updated.count === 0) return false;

    await tx.session.deleteMany({
      where: { userId: user.id, id: { not: session.id } },
    });
    return true;
  });

  if (!changed) return { error: "Пароль уже был изменён. Повторите попытку." };
  resetRateLimit(rateLimitKey);
  return { success: true };
}

export async function signOutOtherSessions() {
  const { user, session } = await validateRequest();
  if (!user) return { error: "Войдите в аккаунт снова" };

  const result = await db.session.deleteMany({
    where: {
      userId: user.id,
      id: { not: session.id },
      expiresAt: { gt: new Date() },
    },
  });

  return { count: result.count };
}

function sessionReference(id: string) {
  return createHash("sha256").update(id).digest("hex");
}

function browserName(userAgent: string | null) {
  if (!userAgent) return "Неизвестный браузер";
  if (/Edg(?:A|iOS)?\//.test(userAgent)) return "Edge";
  if (/OPR\/|OPT\//.test(userAgent)) return "Opera";
  if (/Firefox\/|FxiOS\//.test(userAgent)) return "Firefox";
  if (/Chrome\/|CriOS\//.test(userAgent)) return "Chrome";
  if (/Safari\//.test(userAgent)) return "Safari";
  return "Другой браузер";
}

export async function listActiveSessions() {
  const { user, session } = await validateRequest();
  if (!user) throw new Error("Войдите в аккаунт снова");
  const sessions = await db.session.findMany({
    where: { userId: user.id, expiresAt: { gt: new Date() } },
    select: { id: true, createdAt: true, userAgent: true },
    orderBy: { createdAt: { sort: "desc", nulls: "last" } },
  });

  return sessions
    .map(({ id, createdAt, userAgent }) => ({
      reference: sessionReference(id),
      createdAt,
      browser: browserName(userAgent),
      current: id === session.id,
    }))
    .sort((a, b) => Number(b.current) - Number(a.current));
}

export async function revokeSession(reference: string) {
  const { user, session } = await validateRequest();
  if (!user) throw new Error("Войдите в аккаунт снова");
  const sessions = await db.session.findMany({
    where: {
      userId: user.id,
      expiresAt: { gt: new Date() },
      id: { not: session.id },
    },
    select: { id: true },
  });
  const target = sessions.find(({ id }) => sessionReference(id) === reference);
  if (target) {
    await db.session.deleteMany({ where: { id: target.id, userId: user.id } });
  }
}

export async function deleteAccount(input: unknown) {
  const { user } = await validateRequest();
  if (!user) return { error: "Войдите в аккаунт снова" };

  const password = z.string().min(1).safeParse(input);
  if (!password.success) return { error: "Введите текущий пароль" };
  if (
    !checkRateLimit(`delete-account:${user.id}`, {
      limit: 5,
      windowMs: 15 * 60_000,
    }).ok
  ) {
    return { error: "Слишком много попыток. Попробуйте через 15 минут." };
  }

  const account = await db.user.findUnique({
    where: { id: user.id },
    select: { hashedPassword: true },
  });
  if (!account || !(await verify(account.hashedPassword, password.data))) {
    return { error: "Неверный текущий пароль" };
  }

  await db.$transaction(
    async (tx) => {
      const ownedGroups = await tx.group.findMany({
        where: {
          members: { some: { userId: user.id, role: GroupMemberRole.CREATOR } },
        },
        select: {
          id: true,
          members: {
            where: { userId: { not: user.id } },
            select: { id: true, role: true },
            orderBy: { id: "asc" },
          },
        },
      });

      await Promise.all(
        ownedGroups.map((group) => {
          if (
            group.members.some(({ role }) => role === GroupMemberRole.CREATOR)
          )
            return;
          const successor =
            group.members.find(
              ({ role }) => role === GroupMemberRole.MODERATOR,
            ) ?? group.members[0];
          return successor
            ? tx.groupMember.update({
                where: { id: successor.id },
                data: { role: GroupMemberRole.CREATOR },
              })
            : tx.group.delete({ where: { id: group.id } });
        }),
      );

      await tx.groupBook.updateMany({
        where: { addedBy: { userId: user.id } },
        data: { addedById: null },
      });
      await tx.answerRead.deleteMany({ where: { userId: user.id } });
      await tx.supportAnswer.deleteMany({ where: { fromUserId: user.id } });
      await tx.supportQuestion.deleteMany({ where: { fromUserId: user.id } });
      await tx.follow.deleteMany({
        where: { OR: [{ firstId: user.id }, { secondId: user.id }] },
      });
      await tx.user.delete({
        where: { id: user.id, hashedPassword: account.hashedPassword },
      });
    },
    { isolationLevel: "Serializable" },
  );

  const sessionCookie = lucia.createBlankSessionCookie();
  (await cookies()).set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );
  return { success: true };
}
