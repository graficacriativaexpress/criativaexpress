import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";

async function readProjectFile(relativePath: string) {
  return readFile(new URL(`../${relativePath}`, import.meta.url), "utf8");
}

describe("experiência pública de produto", () => {
  it("mantém a navegação ordenada entre itens ativos do catálogo", async () => {
    const detail = await readProjectFile("client/src/pages/ProductDetail.tsx");

    expect(detail).toContain("trpc.catalog.list.useQuery()");
    expect(detail).toContain("Produto anterior:");
    expect(detail).toContain("Próximo produto:");
    expect(detail).toContain("absolute -left-3 top-1/2");
    expect(detail).toContain("absolute -right-3 top-1/2");
    expect(detail).not.toContain("Navegação entre produtos");
  });

  it("informa as condições de pagamento na vitrine e no detalhe", async () => {
    const [home, detail] = await Promise.all([
      readProjectFile("client/src/pages/Home.tsx"),
      readProjectFile("client/src/pages/ProductDetail.tsx"),
    ]);

    for (const source of [home, detail]) {
      expect(source).toContain("Até 3x sem juros");
      expect(source).toContain("5% de desconto no PIX à vista");
    }
  });

  it("deixa o catálogo acessível diretamente, sem título introdutório ou busca", async () => {
    const home = await readProjectFile("client/src/pages/Home.tsx");

    expect(home).toContain("catalogCategories.map");
    expect(home).not.toContain("Encontre o acabamento certo.");
    expect(home).not.toContain("Busque um produto");
    expect(home).not.toContain("from \"@/components/ui/input\"");
  });
});
