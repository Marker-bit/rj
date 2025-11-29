"use server";

import { hash } from "@node-rs/argon2";
import { db } from "../db";
import { validateRequest } from "../server-validate-request";

export async function setVerification(userId: string, verified: boolean) {
  const { user: currentUser } = await validateRequest();
  if (!currentUser) {
    throw new Error("Unauthorized");
  }
  if (!currentUser.admin) {
    throw new Error("Unauthorized");
  }
  const user = await db.user.update({
    where: {
      id: userId,
    },
    data: {
      verified,
    },
  });

  return user;
}

export async function setAI(userId: string, enabled: boolean) {
  const { user: currentUser } = await validateRequest();
  if (!currentUser) {
    throw new Error("Unauthorized");
  }
  if (!currentUser.admin) {
    throw new Error("Unauthorized");
  }
  const user = await db.user.update({
    where: {
      id: userId,
    },
    data: {
      aiEnabled: enabled,
    },
  });

  return user;
}

export async function setPassword(userId: string, password: string) {
  const { user: currentUser } = await validateRequest();
  if (!currentUser) {
    throw new Error("Unauthorized");
  }
  if (!currentUser.admin) {
    throw new Error("Unauthorized");
  }
  const hashedPassword = await hash(password);
  const user = await db.user.update({
    where: {
      id: userId,
    },
    data: {
      hashedPassword,
    },
  });

  return user;
}
