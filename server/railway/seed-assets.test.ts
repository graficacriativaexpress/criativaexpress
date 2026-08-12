import { describe, expect, it } from "vitest";
import { buildSeedAsset, resolveLegacyAssetUrl } from "./seed-assets.mjs";

describe("ativos da semente Railway", () => {
  it("cria um caminho público persistente e seguro para cada arquivo", () => {
    expect(buildSeedAsset(7, "kits/Tag Rosé.png")).toEqual({
      relativePath: "seed/7-Tag-Rose.png",
      publicUrl: "/uploads/seed/7-Tag-Rose.png",
    });
  });

  it("resolve caminhos do armazenamento legado sem alterar URLs já públicas", () => {
    expect(resolveLegacyAssetUrl("/manus-storage/kit.png", "https://legado.example/")).toBe("https://legado.example/manus-storage/kit.png");
    expect(resolveLegacyAssetUrl("https://imagens.example/kit.png", "https://legado.example")).toBe("https://imagens.example/kit.png");
  });
});
