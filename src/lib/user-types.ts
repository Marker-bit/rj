import type { SharePeople } from "@prisma/client";

export type PublicUser = {
  id: string;
  username: string;
  firstName: string | null;
  lastName: string | null;
  avatarUrl: string;
  verified: boolean;
};

export type FollowEdge = { id: string; firstId: string; secondId: string };

export type ProfileUser = PublicUser & {
  shareSubscriptions: SharePeople;
  shareFollowers: SharePeople;
  shareStats: SharePeople;
  follower: (FollowEdge & { second: PublicUser })[];
  following: (FollowEdge & { first: PublicUser })[];
};
