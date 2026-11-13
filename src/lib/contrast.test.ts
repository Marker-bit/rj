import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { contrastRatio, parseOklch, relativeLuminance } from "./contrast";

const css = readFileSync(
  new URL("../app/globals.css", import.meta.url),
  "utf8",
);

function rootToken(name: string): string {
  const start = css.indexOf(":root");
  const end = css.indexOf("}", start);
  const block = css.slice(start, end);
  const match = block.match(new RegExp(`${name}:\\s*([^;]+);`));
  if (!match) throw new Error(`Missing token ${name}`);
  return match[1].trim();
}

describe("light theme contrast", () => {
  it("primary text stays light and readable", () => {
    const primary = parseOklch(rootToken("--primary"));
    const primaryForeground = parseOklch(rootToken("--primary-foreground"));

    // Light theme keeps near-white text on the orange primary, so the
    // foreground must be lighter than the fill. A dark foreground fails here.
    expect(relativeLuminance(primaryForeground)).toBeGreaterThan(
      relativeLuminance(primary),
    );
    // Readable at the 3:1 AA threshold for large text / UI components.
    expect(contrastRatio(primary, primaryForeground)).toBeGreaterThanOrEqual(3);
  });

  it("muted text meets AA on the card background", () => {
    const ratio = contrastRatio(
      parseOklch(rootToken("--muted-foreground")),
      parseOklch(rootToken("--card")),
    );
    expect(ratio).toBeGreaterThanOrEqual(4.5);
  });
});
