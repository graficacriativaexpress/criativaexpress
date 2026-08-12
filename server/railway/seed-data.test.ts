import { describe, expect, it } from "vitest";
import { listSettings } from "./seed-data.mjs";

describe("listSettings", () => {
  it("normaliza o objeto único de configurações exportado pelo catálogo", () => {
    const setting = { id: 1, companyName: "Criativa Express" };
    expect(listSettings(setting)).toEqual([setting]);
  });

  it("preserva uma lista de configurações e trata valores ausentes", () => {
    const settings = [{ id: 1 }, { id: 2 }];
    expect(listSettings(settings)).toEqual(settings);
    expect(listSettings(undefined)).toEqual([]);
  });
});
