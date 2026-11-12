import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Optional for `prisma generate` (which runs on install and before every
    // build), required for commands that actually connect to the database.
    url: process.env.DB_PRISMA_URL ?? "",
  },
});
