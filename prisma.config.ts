import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: env("DB_PRISMA_URL"),
    directUrl: env("DB_URL_NON_POOLING"),
  },
});
