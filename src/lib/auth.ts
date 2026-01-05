/* src/lib/utils.ts */

import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import type { SharePeople } from "@prisma/client";
import { Lucia } from "lucia";
import { db } from "./db";

const adapter = new PrismaAdapter(db.session, db.user);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    expires: false,
    attributes: {
      secure: process.env.NODE_ENV === "production",
    },
  },
  getUserAttributes: (attributes) => {
    return {
      username: attributes.username,
      firstName: attributes.firstName,
      lastName: attributes.lastName,
      active: attributes.active,
      avatarUrl: attributes.avatarUrl,
      shareSubscriptions: attributes.shareSubscriptions,
      shareFollowers: attributes.shareFollowers,
      shareStats: attributes.shareStats,
      verified: attributes.verified,
      admin: attributes.admin,
      hideActivity: attributes.hideActivity,
    };
  },
});

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}

interface DatabaseUserAttributes {
  username: string;
  firstName: string;
  lastName: string;
  active: boolean;
  avatarUrl: string;
  shareFollowers: SharePeople;
  shareSubscriptions: SharePeople;
  shareStats: SharePeople;
  verified: boolean;
  admin: boolean;
  hideActivity: boolean;
}
