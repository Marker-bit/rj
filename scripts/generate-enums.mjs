#!/usr/bin/env node
/**
 * Generates src/lib/enums.ts from prisma/schema.prisma.
 *
 * Client components must not import enum values from `@prisma/client`,
 * because that pulls the Prisma runtime into the browser bundle. This script
 * keeps browser-safe mirrors in sync with the schema instead of maintaining
 * them by hand.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

const schemaPath = resolve(process.cwd(), "prisma/schema.prisma");
const outputPath = resolve(process.cwd(), "src/lib/enums.ts");

if (!existsSync(schemaPath)) {
  console.error(`[generate-enums] Schema not found at ${schemaPath}`);
  process.exit(1);
}

const source = readFileSync(schemaPath, "utf8")
  .replace(/\/\*[\s\S]*?\*\//g, "")
  .replace(/\/\/.*$/gm, "");

const enumBlocks = [...source.matchAll(/^enum\s+(\w+)\s*\{([\s\S]*?)^\}/gm)];

const enums = [];

for (const [, name, body] of enumBlocks) {
  const values = body
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("@@"))
    // The first token is the client-facing value; `@map(...)` only changes
    // the value stored in the database.
    .map((line) => line.split(/\s+/)[0])
    .filter((value) => /^[A-Za-z_]\w*$/.test(value));

  if (values.length > 0) {
    enums.push({ name, values });
  }
}

if (enums.length === 0) {
  console.error("[generate-enums] No enums found in the Prisma schema");
  process.exit(1);
}

const header = `/**
 * AUTO-GENERATED FILE - DO NOT EDIT.
 *
 * Generated from prisma/schema.prisma by scripts/generate-enums.mjs.
 * Run \`pnpm generate:enums\` (also runs after install, before dev and before
 * build) whenever the Prisma schema changes.
 *
 * These are browser-safe mirrors of the Prisma enums. Importing enum values
 * from the Prisma Client in client components would pull the Prisma runtime
 * into the browser bundle.
 */`;

const blocks = enums.map(({ name, values }) => {
  const entries = values.map((value) => `  ${value}: "${value}",`).join("\n");
  const singleLineType = `export type ${name} = (typeof ${name})[keyof typeof ${name}];`;
  // Keep the output stable with the repo's 80-column formatter.
  const typeAlias =
    singleLineType.length <= 80
      ? singleLineType
      : `export type ${name} =\n  (typeof ${name})[keyof typeof ${name}];`;

  return `export const ${name} = {
${entries}
} as const;

${typeAlias}`;
});

const output = `${header}\n\n${blocks.join("\n\n")}\n`;

mkdirSync(dirname(outputPath), { recursive: true });

const existing = existsSync(outputPath) ? readFileSync(outputPath, "utf8") : "";

if (existing === output) {
  console.log(`[generate-enums] Up to date (${enums.length} enums)`);
} else {
  writeFileSync(outputPath, output);
  console.log(
    `[generate-enums] Wrote ${enums.length} enums to src/lib/enums.ts`,
  );
}
