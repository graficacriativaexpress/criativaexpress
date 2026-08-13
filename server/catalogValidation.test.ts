import { describe, expect, it } from "vitest";
import { validateCatalogEntry } from "./catalogValidation";

describe("validação de itens do catálogo", () => {
  it("permite um kit independente sem composição estruturada", () => {
    expect(() => validateCatalogEntry({ type: "kit", category: "kits", kitItems: [] })).not.toThrow();
  });

  it("mantém a categoria exclusiva de kits", () => {
    expect(() => validateCatalogEntry({ type: "kit", category: "tags", kitItems: [] })).toThrow("Kits devem usar a categoria Kits.");
  });

  it("impede itens repetidos quando uma composição é informada", () => {
    expect(() => validateCatalogEntry({ type: "kit", category: "kits", kitItems: [{ itemProductId: 7 }, { itemProductId: 7 }] })).toThrow("Não repita produtos na composição do kit.");
  });
});
