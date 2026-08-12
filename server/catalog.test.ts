import { describe, expect, it } from "vitest";
import { buildWhatsappOrderMessage, categoryLabel, formatCurrency, normalizeWhatsappNumber, slugFromName } from "../shared/catalog";

describe("catalog utilities", () => {
  it("normalizes a Brazilian WhatsApp number", () => {
    expect(normalizeWhatsappNumber("+55 (61) 99999-1234")).toBe("5561999991234");
  });

  it("builds a formatted kit order message", () => {
    expect(
      buildWhatsappOrderMessage({
        companyName: "Criativa Express",
        greeting: "Olá! Quero comprar.",
        productName: "Kit Luxo",
        price: "49.90",
        isKit: true,
      })
    ).toContain("*Kit:* Kit Luxo");
  });

  it("uses the default greeting and identifies a product in its order message", () => {
    const message = buildWhatsappOrderMessage({
      companyName: "Criativa Express",
      productName: "Tag personalizada",
      price: 12.5,
      isKit: false,
    });

    expect(message).toContain("Olá! Gostaria de fazer um pedido.");
    expect(message).toContain("*Produto:* Tag personalizada");
    expect(message).toContain("*Valor:* R$ 12,50");
  });

  it("formats Brazilian prices and returns the configured category label", () => {
    expect(formatCurrency("199.9")).toBe("R$ 199,90");
    expect(categoryLabel("cartao_visita")).toBe("Cartão de Visita");
  });

  it("creates URL-safe product slugs", () => {
    expect(slugFromName("Cartão de Visita — Premium")).toBe("cartao-de-visita-premium");
  });
});
