import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";

async function readProjectFile(relativePath: string) {
  return readFile(new URL(`../${relativePath}`, import.meta.url), "utf8");
}

describe("brand palette interface states", () => {
  it("defines the logo-derived magenta, cyan, orange and graphite tokens", async () => {
    const css = await readProjectFile("client/src/index.css");

    expect(css).toContain("--color-wine: oklch(0.48 0.19 332)");
    expect(css).toContain("--color-sky: oklch(0.69 0.15 224)");
    expect(css).toContain("--color-gold: oklch(0.72 0.17 63)");
    expect(css).toContain("--color-ink: oklch(0.24 0 0)");
  });

  it("keeps primary actions, category filters and WhatsApp controls visibly interactive", async () => {
    const [home, whatsappButton] = await Promise.all([
      readProjectFile("client/src/pages/Home.tsx"),
      readProjectFile("client/src/components/WhatsAppOrderButton.tsx"),
    ]);

    expect(home).toContain("hover:bg-rose");
    expect(home).toContain("hover:border-sky/70");
    expect(home).toContain("focus-visible:outline-sky");
    expect(whatsappButton).toContain("hover:bg-rose");
    expect(whatsappButton).toContain("focus-visible:outline-sky");
  });

  it("does not expose administrative shortcuts in the public storefront", async () => {
    const home = await readProjectFile("client/src/pages/Home.tsx");

    expect(home).not.toContain('href="/admin"');
    expect(home).not.toContain("Área da loja");
    expect(home).not.toContain("Gerenciar loja");
  });
});
