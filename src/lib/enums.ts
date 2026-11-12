/**
 * AUTO-GENERATED FILE - DO NOT EDIT.
 *
 * Generated from prisma/schema.prisma by scripts/generate-enums.mjs.
 * Run `pnpm generate:enums` (also runs after install, before dev and before
 * build) whenever the Prisma schema changes.
 *
 * These are browser-safe mirrors of the Prisma enums. Importing enum values
 * from the Prisma Client in client components would pull the Prisma runtime
 * into the browser bundle.
 */

export const SharePeople = {
  NONE: "NONE",
  ALL: "ALL",
  SUBS: "SUBS",
} as const;

export type SharePeople = (typeof SharePeople)[keyof typeof SharePeople];

export const BackgroundColor = {
  NONE: "NONE",
  YELLOW: "YELLOW",
  RED: "RED",
  BLUE: "BLUE",
  GREEN: "GREEN",
} as const;

export type BackgroundColor =
  (typeof BackgroundColor)[keyof typeof BackgroundColor];

export const BookStatus = {
  NONE: "NONE",
  HIDDEN: "HIDDEN",
  ARCHIVED: "ARCHIVED",
} as const;

export type BookStatus = (typeof BookStatus)[keyof typeof BookStatus];

export const GroupMemberRole = {
  CREATOR: "CREATOR",
  MODERATOR: "MODERATOR",
  MEMBER: "MEMBER",
} as const;

export type GroupMemberRole =
  (typeof GroupMemberRole)[keyof typeof GroupMemberRole];
