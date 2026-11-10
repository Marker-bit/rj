import type { User } from "lucia";
import { validateRequest } from "./server-validate-request";

export async function requireAdmin(): Promise<User> {
  const { user } = await validateRequest();
  if (!user || !user.admin) {
    throw new Error("Unauthorized");
  }
  return user;
}
