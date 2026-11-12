import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

const createPrismaClient = () =>
  new PrismaClient({
    adapter: new PrismaPg({
      connectionString: process.env.DB_PRISMA_URL ?? "",
      // Prisma 7 delegates pooling to `pg`, which has no connect timeout by
      // default. Match Prisma 6's 5-second bound so stalled handshakes fail
      // instead of queueing requests indefinitely.
      connectionTimeoutMillis: 5_000,
    }),
  });

declare global {
  var prisma: ReturnType<typeof createPrismaClient> | undefined;
}

export const db = globalThis.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = db;
}
