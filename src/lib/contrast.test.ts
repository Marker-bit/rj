import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { contrastRatio, parseOklch } from "./contrast";

const css = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");

function rootToken(name: string): string {
  const start = css.indexOf(":root");
  const end = css.indexOf("}", start);
  const block = css.slice(start, end);
  const match = block.match(new RegExp(`${name}:\\s*([^;]+);`));
  if (!match) throw new Error(`Missing token ${name}`);
  return match[1].trim();
}

describe("light theme contrast", () => {
  it("primary text meets AA", () => {
    const ratio = contrastRatio(
      parseOklch(rootToken("--primary")),
      parseOklch(rootToken("--primary-foreground")),
    );
    expect(ratio).toBeGreaterThanOrEqual(4.5);
  });

  it("muted text meets AA on the card background", () => {
    const ratio = contrastRatio(
      parseOklch(rootToken("--muted-foreground")),
      parseOklch(rootToken("--card")),
    );
    expect(ratio).toBeGreaterThanOrEqual(4.5);
  });
});
