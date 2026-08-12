import { describe, expect, it } from "vitest";
import { toMySqlDateTime } from "./seed-dates.mjs";

describe("toMySqlDateTime", () => {
  it("converte a data ISO do catálogo para o formato DATETIME do MySQL", () => {
    expect(toMySqlDateTime("2026-08-12T17:15:52.000Z")).toBe("2026-08-12 17:15:52");
  });

  it("rejeita datas inválidas antes de iniciar a carga do catálogo", () => {
    expect(() => toMySqlDateTime("data-inválida")).toThrow("Data inválida na semente Railway");
  });
});
