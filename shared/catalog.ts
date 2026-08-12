export const catalogCategories = [
  { value: "tags", label: "Tags" },
  { value: "dtf", label: "DTF" },
  { value: "cartao_visita", label: "Cartão de Visita" },
  { value: "kits", label: "Kits" },
] as const;

export type CatalogCategory = (typeof catalogCategories)[number]["value"];

export function categoryLabel(category: CatalogCategory) {
  return catalogCategories.find(item => item.value === category)?.label ?? category;
}

export function formatCurrency(value: string | number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(value));
}

export function normalizeWhatsappNumber(value: string) {
  return value.replace(/\D/g, "");
}

export function buildWhatsappOrderMessage(input: {
  companyName: string;
  greeting?: string | null;
  productName: string;
  price: string | number;
  isKit: boolean;
}) {
  const subject = input.isKit ? "kit" : "produto";
  const greeting = input.greeting?.trim() || "Olá! Gostaria de fazer um pedido.";
  return [
    greeting,
    "",
    `*${subject === "kit" ? "Kit" : "Produto"}:* ${input.productName}`,
    `*Valor:* ${formatCurrency(input.price)}`,
    "",
    `Enviado pelo catálogo ${input.companyName}.`,
  ].join("\n");
}

export function slugFromName(name: string) {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}
